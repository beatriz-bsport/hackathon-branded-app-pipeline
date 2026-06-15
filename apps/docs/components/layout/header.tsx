import { Link } from "react-router-dom";

import { BsportLogoMark } from "#src/components/layout/bsport-logo-mark";
import { HeaderHeightSync } from "#src/components/layout/header-height-sync";
import { ThemeToggle } from "#src/components/layout/theme-toggle";
import { TopNav } from "#src/components/layout/top-nav";
import type { TopTab } from "#src/lib/nav";

type HeaderProps = {
  topTabs: TopTab[];
};

export function Header({ topTabs }: HeaderProps) {
  return (
    <header
      data-site-header
      className="z-30 shrink-0 border-b border-[color:var(--color-border)] bg-[color:var(--color-bg)]"
    >
      <HeaderHeightSync />
      <div className="flex w-full items-center gap-4 px-4 py-3 md:gap-6 md:px-6">
        <Link
          to="/welcome"
          className="flex items-center gap-2 font-semibold tracking-tight"
          aria-label="Kaizen home"
        >
          <BsportLogoMark className="size-7 shrink-0" />
          <span>Kaizen</span>
          <span className="rounded-md bg-[color:var(--color-bg-subtle)] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[color:var(--color-fg-muted)]">
            v0.1
          </span>
        </Link>
        <TopNav topTabs={topTabs} className="hidden min-w-0 flex-1 md:flex" />
        <ThemeToggle className="ml-auto shrink-0" />
      </div>
      <div className="flex items-center gap-2 border-t border-[color:var(--color-border)] px-3 py-2 md:hidden">
        <TopNav topTabs={topTabs} className="min-w-0 flex-1" />
      </div>
    </header>
  );
}
