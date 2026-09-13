import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  Crosshair,
  FileText,
  Menu,
  Radar,
  Scale,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DeskState } from "@/lib/neia/types";
import { formatDateTime } from "@/lib/neia/format";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/", label: "Daily brief", icon: FileText },
  { to: "/sources", label: "Source scout", icon: Radar },
  { to: "/ledger", label: "Assumption ledger", icon: Scale },
  { to: "/signals", label: "Signals", icon: Crosshair },
  { to: "/reviews", label: "Reviews", icon: BookOpen },
] as const;

export function AppShell({
  desk,
  children,
}: {
  desk: DeskState;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <div className="flex min-h-dvh">
        <aside className="sticky top-0 hidden h-dvh w-[232px] shrink-0 flex-col border-r border-border bg-bg-elevated lg:flex">
          <Brand />
          <NavList pathname={pathname} onNavigate={() => setOpen(false)} />
          <DeskMeta desk={desk} />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-bg/92 px-4 backdrop-blur-sm lg:hidden">
            <Link to="/" className="flex items-center gap-2">
              <Mark />
              <span className="font-display text-lg tracking-tight">NEIA</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X /> : <Menu />}
            </Button>
          </header>

          {open ? (
            <div className="border-b border-border bg-bg-elevated px-3 py-3 lg:hidden">
              <NavList pathname={pathname} onNavigate={() => setOpen(false)} />
              <DeskMeta desk={desk} />
            </div>
          ) : null}

          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-start gap-3 px-5 py-6">
      <Mark />
      <span>
        <span className="block font-display text-2xl leading-none tracking-tight">NEIA</span>
        <span className="mt-1 block text-[10px] uppercase tracking-[0.22em] text-muted">
          Netso intelligence
        </span>
      </span>
    </Link>
  );
}

function Mark() {
  return (
    <span
      aria-hidden
      className="mt-0.5 grid size-8 place-items-center rounded-sm bg-paper text-[13px] font-semibold text-paper-ink"
    >
      N
    </span>
  );
}

function NavList({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <nav className="flex flex-1 flex-col gap-0.5 px-3">
      {NAV.map((item) => {
        const active =
          item.to === "/"
            ? pathname === "/"
            : pathname === item.to || pathname.startsWith(`${item.to}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors duration-150",
              active
                ? "bg-bg-subtle text-fg"
                : "text-muted hover:bg-bg-subtle/60 hover:text-fg",
            )}
          >
            <Icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function DeskMeta({ desk }: { desk: DeskState }) {
  return (
    <div className="space-y-2 border-t border-border px-5 py-4 text-[11px] text-muted">
      <div className="flex justify-between gap-3">
        <span>Tier 1 sources</span>
        <span className="font-mono tabular-nums text-fg">{desk.tier1Count}</span>
      </div>
      <div className="flex justify-between gap-3">
        <span>Critical live</span>
        <span className="font-mono tabular-nums text-fg">{desk.criticalCount}</span>
      </div>
      <div className="flex justify-between gap-3">
        <span>Model reviews</span>
        <span className="font-mono tabular-nums text-fg">{desk.reviewCount}</span>
      </div>
      <p className="pt-2 leading-relaxed">
        Last cycle
        <br />
        <span className="text-subtle">
          {desk.lastCycle
            ? `${desk.lastCycle.kind} · ${formatDateTime(desk.lastCycle.createdAt)}`
            : "Not yet run"}
        </span>
      </p>
    </div>
  );
}
