import { Link, useLocation } from "react-router-dom";

import { SidebarNavGroup } from "#src/components/layout/sidebar-nav-group";
import { cx } from "#src/lib/cx";
import { type TopTab, getActiveTabKey, isNavGroup } from "#src/lib/nav";

type SidebarProps = {
  topTabs: TopTab[];
};

function linkClassName(isActive: boolean): string {
  return cx(
    "block rounded-md px-3 py-1.5 text-sm transition-colors",
    isActive
      ? "bg-[color:var(--color-bg-muted)] font-medium text-[color:var(--color-accent)]"
      : "text-[color:var(--color-fg-subtle)] hover:bg-[color:var(--color-bg-subtle)] hover:text-[color:var(--color-fg)]",
  );
}

export function Sidebar({ topTabs }: SidebarProps) {
  const { pathname } = useLocation();
  const activeKey = getActiveTabKey(pathname, topTabs);
  const active = topTabs.find((tab) => tab.key === activeKey);

  if (!active || active.children.length === 0) {
    return (
      <aside className="docs-sidebar hidden md:block" aria-hidden="true" />
    );
  }

  const isWelcomeAlias =
    active.key === "welcome" &&
    (pathname === "/" || pathname === "/index.html");
  const isLandingActive = pathname === active.href || isWelcomeAlias;

  return (
    <aside
      className="docs-sidebar hidden md:block"
      aria-label={`${active.label} navigation`}
    >
      <div className="flex flex-col gap-0.5">
        <Link
          to={active.href}
          aria-current={isLandingActive ? "page" : undefined}
          className={linkClassName(isLandingActive)}
        >
          Overview
        </Link>
        {active.children.map((entry) => {
          if (isNavGroup(entry)) {
            return (
              <SidebarNavGroup
                key={entry.label}
                group={entry}
                pathname={pathname}
                linkClassName={linkClassName}
              />
            );
          }

          const isActive = pathname === entry.href;
          return (
            <Link
              key={entry.slug}
              to={entry.href}
              aria-current={isActive ? "page" : undefined}
              className={linkClassName(isActive)}
            >
              {entry.label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
