import { useState } from "react";

import { cx } from "#src/lib/cx";

export type IconGridProps = {
  icons?: string[];
  importStatement?: (name: string) => string;
};

const SAMPLE_ICONS = [
  "arrow-left",
  "arrow-right",
  "check",
  "close",
  "search",
  "trash",
  "edit",
  "plus",
  "minus",
  "menu",
  "more-horizontal",
  "settings",
];

export function IconGrid({
  icons = SAMPLE_ICONS,
  importStatement = (name) =>
    `import { ${name.replace(/(^.|-.)/g, (m) => m.replace("-", "").toUpperCase())}Icon } from "@bsport/kaizen-primitive-core";`,
}: IconGridProps) {
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(name: string) {
    try {
      await navigator.clipboard.writeText(importStatement(name));
      setCopied(name);
      setTimeout(() => setCopied((c) => (c === name ? null : c)), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="my-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
      {icons.map((name) => (
        <button
          key={name}
          type="button"
          onClick={() => copy(name)}
          className={cx(
            "group flex items-center gap-3 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-3 py-2 text-left text-sm",
            "hover:border-[color:var(--color-accent)]/60 hover:bg-[color:var(--color-bg-subtle)]",
          )}
          aria-label={`Copy import statement for ${name}`}
        >
          <span
            aria-hidden="true"
            className="inline-flex size-7 items-center justify-center rounded border border-[color:var(--color-border)] bg-[color:var(--color-bg-muted)] text-xs"
          >
            ◆
          </span>
          <span className="flex flex-col">
            <span className="font-mono text-xs">{name}</span>
            <span className="text-[10px] text-[color:var(--color-fg-muted)]">
              {copied === name ? "Copied" : "Click to copy import"}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}
