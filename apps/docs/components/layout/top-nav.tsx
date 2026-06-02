import { Link, useLocation } from "react-router-dom";

import { cx } from "#src/lib/cx";
import { type TopTab, getActiveTabKey } from "#src/lib/nav";

type TopNavProps = {
  topTabs: TopTab[];
  className?: string;
};

export function TopNav({ topTabs, className }: TopNavProps) {
  const { pathname } = useLocation();
  const activeKey = getActiveTabKey(pathname, topTabs);

  return (
    <nav
      aria-label="Primary"
      className={cx("flex items-center gap-1 overflow-x-auto", className)}
    >
      {topTabs.map((tab) => {
        const isActive = tab.key === activeKey;
        return (
          <Link
            key={tab.key}
            to={tab.href}
            aria-current={isActive ? "page" : undefined}
            className={cx(
              "rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
              isActive
                ? "bg-[color:var(--color-bg-muted)] text-[color:var(--color-accent)]"
                : "text-[color:var(--color-fg-subtle)] hover:bg-[color:var(--color-bg-subtle)] hover:text-[color:var(--color-fg)]",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
