import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { CycleResult } from "@/lib/neia/types";

export function RunCycleButton({
  label,
  pendingLabel,
  run,
  variant = "default",
}: {
  label: string;
  pendingLabel: string;
  run: () => Promise<CycleResult>;
  variant?: "default" | "secondary" | "paper";
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onClick() {
    if (pending) return;
    setPending(true);
    try {
      const result = await run();
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(result.summary || "Cycle complete");
      await router.invalidate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Cycle failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <Button
      variant={variant}
      onClick={() => void onClick()}
      disabled={pending}
      aria-busy={pending}
    >
      {pending ? <LoaderCircle className="animate-spin" /> : null}
      {pending ? pendingLabel : label}
    </Button>
  );
}
