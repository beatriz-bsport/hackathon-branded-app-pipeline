import { Link } from "react-router-dom";

import { HeaderHeightSync } from "#src/components/layout/header-height-sync";
import { TopNav } from "#src/components/layout/top-nav";
import { ThemeToggle } from "#src/components/theme/theme-toggle";
import type { TopTab } from "#src/lib/nav";

type HeaderProps = {
  topTabs: TopTab[];
};

export function Header({ topTabs }: HeaderProps) {
  return (
    <header
      data-site-header
      className="sticky top-0 z-30 border-b border-[color:var(--color-border)] bg-[color:var(--color-bg)]"
    >
      <HeaderHeightSync />
      <div className="mx-auto flex max-w-screen-2xl items-center gap-6 px-4 py-3 md:px-6">
        <Link
          to="/welcome"
          className="flex items-center gap-2 font-semibold tracking-tight"
          aria-label="Kaizen home"
        >
          <span
            aria-hidden="true"
            className="inline-block size-6 rounded-md bg-[color:var(--color-accent)]"
          />
          <span>Kaizen</span>
          <span className="rounded-md bg-[color:var(--color-bg-subtle)] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[color:var(--color-fg-muted)]">
            v0.1
          </span>
        </Link>
        <TopNav topTabs={topTabs} className="hidden md:flex" />
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
      <TopNav
        topTabs={topTabs}
        className="border-t border-[color:var(--color-border)] px-3 py-2 md:hidden"
      />
    </header>
  );
}
