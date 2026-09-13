const MODEL = "grok-4.5";

export type GrokJsonResult = {
  ok: true;
  value: unknown;
  citations: string[];
} | {
  ok: false;
  error: string;
};

function extractText(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "";
  const rec = payload as Record<string, unknown>;
  if (typeof rec.output_text === "string" && rec.output_text.trim()) {
    return rec.output_text;
  }
  const output = rec.output;
  if (Array.isArray(output)) {
    const chunks: string[] = [];
    for (const item of output) {
      if (!item || typeof item !== "object") continue;
      const node = item as Record<string, unknown>;
      const content = node.content;
      if (Array.isArray(content)) {
        for (const part of content) {
          if (!part || typeof part !== "object") continue;
          const p = part as Record<string, unknown>;
          if (typeof p.text === "string") chunks.push(p.text);
        }
      }
      if (typeof node.text === "string") chunks.push(node.text);
    }
    if (chunks.length) return chunks.join("\n");
  }
  const choices = rec.choices;
  if (Array.isArray(choices) && choices[0] && typeof choices[0] === "object") {
    const msg = (choices[0] as Record<string, unknown>).message;
    if (msg && typeof msg === "object") {
      const content = (msg as Record<string, unknown>).content;
      if (typeof content === "string") return content;
    }
  }
  return "";
}

function extractCitations(payload: unknown): string[] {
  if (!payload || typeof payload !== "object") return [];
  const rec = payload as Record<string, unknown>;
  const raw = rec.citations;
  if (!Array.isArray(raw)) return [];
  return raw
    .map((c) => {
      if (typeof c === "string") return c;
      if (c && typeof c === "object") {
        const o = c as Record<string, unknown>;
        if (typeof o.url === "string") return o.url;
        if (typeof o.uri === "string") return o.uri;
      }
      return null;
    })
    .filter((x): x is string => Boolean(x));
}

function parseJsonObject(text: string): unknown {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = (fenced ? fenced[1] : trimmed).trim();
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Model did not return JSON");
  }
  return JSON.parse(candidate.slice(start, end + 1));
}

export async function grokJson(opts: {
  instructions: string;
  input: string;
  schema: Record<string, unknown>;
  search?: boolean;
  maxOutputTokens?: number;
}): Promise<GrokJsonResult> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "AI is not available in this environment" };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 110_000);

  const body = {
    model: MODEL,
    input: [
      { role: "system", content: opts.instructions },
      { role: "user", content: opts.input },
    ],
    max_output_tokens: opts.maxOutputTokens ?? 6000,
    tools: opts.search === false ? undefined : [{ type: "web_search" }],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "neia_result",
        strict: true,
        schema: opts.schema,
      },
    },
  };

  try {
    const res = await fetch("https://api.x.ai/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!res.ok) {
      const fallback = await grokChatFallback(apiKey, opts, controller.signal);
      if (fallback.ok) return fallback;
      return {
        ok: false,
        error: `xAI API error ${res.status}`,
      };
    }

    const payload: unknown = await res.json();
    const text = extractText(payload);
    if (!text) {
      return { ok: false, error: "Empty model response" };
    }
    return {
      ok: true,
      value: parseJsonObject(text),
      citations: extractCitations(payload),
    };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.name === "AbortError"
          ? "The intelligence cycle timed out. Try again."
          : err.message
        : "Unknown AI error";
    return { ok: false, error: message };
  } finally {
    clearTimeout(timer);
  }
}

async function grokChatFallback(
  apiKey: string,
  opts: {
    instructions: string;
    input: string;
    schema: Record<string, unknown>;
    maxOutputTokens?: number;
  },
  signal: AbortSignal,
): Promise<GrokJsonResult> {
  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: opts.instructions },
        {
          role: "user",
          content: `${opts.input}\n\nReturn ONLY JSON matching this schema:\n${JSON.stringify(opts.schema)}`,
        },
      ],
      max_tokens: opts.maxOutputTokens ?? 5000,
      response_format: { type: "json_object" },
    }),
    signal,
  });
  if (!res.ok) return { ok: false, error: `xAI API error ${res.status}` };
  const payload: unknown = await res.json();
  const text = extractText(payload);
  if (!text) return { ok: false, error: "Empty model response" };
  return { ok: true, value: parseJsonObject(text), citations: [] };
}
