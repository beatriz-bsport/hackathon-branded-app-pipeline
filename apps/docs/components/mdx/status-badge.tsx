import { cx } from "#src/lib/cx";

export type StatusBadgeProps = {
  status: "stable" | "beta" | "deprecated" | "internal";
};

const TONE: Record<StatusBadgeProps["status"], string> = {
  stable:
    "border-[color:var(--color-success)] text-[color:var(--color-success)]",
  beta: "border-[color:var(--color-info)] text-[color:var(--color-info)]",
  deprecated:
    "border-[color:var(--color-danger)] text-[color:var(--color-danger)]",
  internal:
    "border-[color:var(--color-warning)] text-[color:var(--color-warning)]",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider",
        TONE[status],
      )}
    >
      {status}
    </span>
  );
}
