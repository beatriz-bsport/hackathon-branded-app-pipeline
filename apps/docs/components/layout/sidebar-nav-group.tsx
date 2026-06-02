import { Link } from "react-router-dom";
import { useEffect, useId, useState } from "react";

import { cx } from "#src/lib/cx";
import type { NavGroup, NavItem } from "#src/lib/nav";

type SidebarNavGroupProps = {
  group: NavGroup;
  pathname: string;
  linkClassName: (isActive: boolean) => string;
};

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className={cx(
        "size-3.5 shrink-0 text-[color:var(--color-fg-muted)] transition-transform duration-200",
        open ? "rotate-180" : "rotate-0",
      )}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 6l4 4 4-4" />
    </svg>
  );
}

function SidebarNavLink({
  item,
  pathname,
  linkClassName,
  nested = false,
}: {
  item: NavItem;
  pathname: string;
  linkClassName: (isActive: boolean) => string;
  nested?: boolean;
}) {
  const isActive = pathname === item.href;

  return (
    <Link
      to={item.href}
      aria-current={isActive ? "page" : undefined}
      className={cx(linkClassName(isActive), nested && "pl-3")}
    >
      {item.label}
    </Link>
  );
}

export function SidebarNavGroup({
  group,
  pathname,
  linkClassName,
}: SidebarNavGroupProps) {
  const panelId = useId();
  const hasActiveChild = group.items.some((item) => pathname === item.href);
  const isGroupActive = group.href != null && pathname === group.href;
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (hasActiveChild || isGroupActive) setOpen(true);
  }, [hasActiveChild, isGroupActive]);

  return (
    <div className="mt-2 flex flex-col gap-0.5 first:mt-0">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className={cx(
          "flex w-full items-center justify-between gap-2 rounded-md px-3 py-1 text-left text-xs font-normal transition-colors",
          isGroupActive
            ? "bg-[color:var(--color-bg-muted)] text-[color:var(--color-fg-subtle)]"
            : "text-[color:var(--color-fg-muted)] hover:bg-[color:var(--color-bg-subtle)] hover:text-[color:var(--color-fg-subtle)]",
        )}
      >
        <span className="min-w-0 truncate">{group.label}</span>
        <ChevronIcon open={open} />
      </button>
      {open ? (
        <div id={panelId} className="flex flex-col gap-0.5">
          {group.href ? (
            <SidebarNavLink
              item={{
                slug: group.slug,
                label: "Overview",
                href: group.href,
              }}
              pathname={pathname}
              linkClassName={linkClassName}
              nested
            />
          ) : null}
          {group.items.map((item) => (
            <SidebarNavLink
              key={item.slug}
              item={item}
              pathname={pathname}
              linkClassName={linkClassName}
              nested
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
