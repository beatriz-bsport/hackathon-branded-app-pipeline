import type { ReactNode } from "react";

import { cx } from "#src/lib/cx";

export type CalloutType = "info" | "warning" | "deprecated" | "tip";

const TONE: Record<
  CalloutType,
  { ring: string; bg: string; label: string; icon: string }
> = {
  info: {
    ring: "border-[color:var(--color-info)]/40",
    bg: "bg-[color:var(--color-info)]/5",
    label: "text-[color:var(--color-info)]",
    icon: "i",
  },
  warning: {
    ring: "border-[color:var(--color-warning)]/40",
    bg: "bg-[color:var(--color-warning)]/8",
    label: "text-[color:var(--color-warning)]",
    icon: "!",
  },
  deprecated: {
    ring: "border-[color:var(--color-danger)]/40",
    bg: "bg-[color:var(--color-danger)]/5",
    label: "text-[color:var(--color-danger)]",
    icon: "×",
  },
  tip: {
    ring: "border-[color:var(--color-success)]/40",
    bg: "bg-[color:var(--color-success)]/5",
    label: "text-[color:var(--color-success)]",
    icon: "*",
  },
};

const LABEL: Record<CalloutType, string> = {
  info: "Note",
  warning: "Warning",
  deprecated: "Deprecated",
  tip: "Tip",
};

export type CalloutProps = {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
};

export function Callout({ type = "info", title, children }: CalloutProps) {
  const tone = TONE[type];
  return (
    <aside
      role="note"
      className={cx(
        "my-4 flex gap-3 rounded-lg border px-4 py-3 text-sm",
        tone.ring,
        tone.bg,
      )}
    >
      <span
        aria-hidden="true"
        className={cx(
          "mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-bold",
          tone.ring,
          tone.label,
        )}
      >
        {tone.icon}
      </span>
      <div className="flex flex-col gap-1">
        <p
          className={cx(
            "text-xs font-semibold uppercase tracking-wider",
            tone.label,
          )}
        >
          {title ?? LABEL[type]}
        </p>
        <div className="prose-doc">{children}</div>
      </div>
    </aside>
  );
}
