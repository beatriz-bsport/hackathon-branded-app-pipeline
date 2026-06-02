import { useState } from "react";

import { cx } from "#src/lib/cx";

const MANAGERS = [
  { key: "pnpm", label: "pnpm", command: (pkg: string) => `pnpm add ${pkg}` },
  { key: "npm", label: "npm", command: (pkg: string) => `npm install ${pkg}` },
  { key: "yarn", label: "yarn", command: (pkg: string) => `yarn add ${pkg}` },
  { key: "bun", label: "bun", command: (pkg: string) => `bun add ${pkg}` },
] as const;

type ManagerKey = (typeof MANAGERS)[number]["key"];

export type InstallTabsProps = {
  packageName: string;
  dev?: boolean;
};

export function InstallTabs({ packageName, dev = false }: InstallTabsProps) {
  const [active, setActive] = useState<ManagerKey>("pnpm");
  const [copied, setCopied] = useState(false);

  const manager = MANAGERS.find((m) => m.key === active) ?? MANAGERS[0];
  const flagFor = (key: ManagerKey): string => {
    if (!dev) return "";
    return key === "npm" ? " --save-dev" : " -D";
  };
  const command = manager.command(packageName) + flagFor(active);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="my-4 overflow-hidden rounded-lg border border-[color:var(--color-border)]">
      <div className="flex items-center gap-1 border-b border-[color:var(--color-border)] bg-[color:var(--color-bg-subtle)] px-2 pt-2">
        {MANAGERS.map((m) => {
          const isActive = m.key === active;
          return (
            <button
              key={m.key}
              type="button"
              onClick={() => setActive(m.key)}
              className={cx(
                "rounded-t-md border-b-2 px-3 py-1.5 text-sm font-medium",
                isActive
                  ? "border-[color:var(--color-accent)] text-[color:var(--color-accent)]"
                  : "border-transparent text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)]",
              )}
            >
              {m.label}
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-between gap-3 px-3 py-3">
        <code className="overflow-x-auto whitespace-pre font-mono text-sm">
          {command}
        </code>
        <button
          type="button"
          onClick={copy}
          className="shrink-0 rounded-md border border-[color:var(--color-border)] px-2 py-1 text-xs font-medium hover:bg-[color:var(--color-bg-subtle)]"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
