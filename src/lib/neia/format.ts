import type { Category, Confidence, Severity } from "./types";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = iso.slice(0, 10);
  const [y, m, day] = d.split("-").map(Number);
  if (!y || !m || !day) return iso;
  return `${day} ${MONTHS[m - 1]} ${y}`;
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = formatDate(iso);
  const time = iso.length > 10 ? iso.slice(11, 16) : "";
  return time ? `${date} ${time}` : date;
}

export function severityLabel(s: Severity): string {
  if (s === "critical") return "Critical — act now";
  if (s === "important") return "Important";
  return "Watch";
}

export function confidenceLabel(c: Confidence): string {
  if (c === "high") return "High confidence";
  if (c === "medium") return "Medium confidence";
  if (c === "low") return "Low confidence";
  return "Speculation";
}

export function verificationLabel(n: number): string {
  const map: Record<number, string> = {
    1: "L1 social claim",
    2: "L2 single outlet",
    3: "L3 multi-source",
    4: "L4 primary",
    5: "L5 primary + confirm",
  };
  return map[n] ?? `L${n}`;
}

export function categoryLabel(c: Category): string {
  const map: Record<Category, string> = {
    policy: "Policy",
    regulation: "Regulation",
    finance: "Finance",
    solar: "Solar",
    storage: "Storage",
    technology: "Technology",
    customer: "Customer market",
    competitor: "Competitors",
    global: "Global",
    market: "Market data",
  };
  return map[c] ?? c;
}

export function impactLabel(tag: string): string {
  return tag.replace(/_/g, " ");
}
