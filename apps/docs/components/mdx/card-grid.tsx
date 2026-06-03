import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { cx } from "#src/lib/cx";

export type CardGridProps = {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
};

const COLUMNS: Record<NonNullable<CardGridProps["columns"]>, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

export function CardGrid({ children, columns = 2 }: CardGridProps) {
  return (
    <div className={cx("my-4 grid gap-3", COLUMNS[columns])}>{children}</div>
  );
}

export type ContentCardProps = {
  title?: string;
  children: ReactNode;
};

export function ContentCard({ title, children }: ContentCardProps) {
  return (
    <section className="my-4 flex flex-col gap-2 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-bg)] p-4">
      {title ? (
        <p className="font-bold text-[color:var(--color-fg)]">{title}</p>
      ) : null}
      <div className="flex flex-col gap-2 [&_ol]:mb-0 [&_p]:mb-0 [&_ul]:mb-0">
        {children}
      </div>
    </section>
  );
}

export type CardProps = {
  href: string;
  title: string;
  description?: string;
  badge?: string;
};

export function Card({ href, title, description, badge }: CardProps) {
  const isInternal = href.startsWith("/");
  const className = cx(
    "group flex flex-col gap-1 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-bg)] p-4 transition-colors",
    "hover:border-[color:var(--color-accent)]/60 hover:bg-[color:var(--color-bg-subtle)]",
  );

  const content = (
    <>
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium text-[color:var(--color-accent)]">
          {title}
        </span>
        {badge ? (
          <span className="rounded-full border border-[color:var(--color-border)] px-2 py-0.5 text-[10px] uppercase tracking-wider text-[color:var(--color-fg-muted)]">
            {badge}
          </span>
        ) : null}
      </div>
      {description ? (
        <span className="text-sm text-[color:var(--color-fg-subtle)]">
          {description}
        </span>
      ) : null}
      <span className="mt-2 text-xs text-[color:var(--color-fg-muted)] group-hover:text-[color:var(--color-accent)]">
        Read more →
      </span>
    </>
  );

  return isInternal ? (
    <Link to={href} className={className}>
      {content}
    </Link>
  ) : (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {content}
    </a>
  );
}
