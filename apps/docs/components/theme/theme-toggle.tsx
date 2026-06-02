import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { cx } from "#src/lib/cx";

const order = ["system", "light", "dark"] as const;

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        type="button"
        className="size-8 rounded-md border border-[color:var(--color-border)]"
        aria-hidden="true"
      />
    );
  }

  const current = (theme ?? "system") as (typeof order)[number];
  const next = order[(order.indexOf(current) + 1) % order.length];
  const indicator = current === "system" ? resolvedTheme : current;

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Theme: ${current}. Click to switch to ${next}.`}
      title={`Theme: ${current}`}
      className={cx(
        "inline-flex size-8 items-center justify-center rounded-md border border-[color:var(--color-border)] text-sm",
        "hover:bg-[color:var(--color-bg-subtle)]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]",
      )}
    >
      <span aria-hidden="true">
        {current === "system" ? "◐" : indicator === "dark" ? "●" : "○"}
      </span>
    </button>
  );
}
