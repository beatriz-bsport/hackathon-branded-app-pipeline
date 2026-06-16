import { useEffect, useMemo, useState } from "react";

import { cx } from "#src/lib/cx";
import { getDocsScrollObserverOptions } from "#src/lib/docs-scroll-root";
import { headingSlug } from "#src/lib/heading-slug";

export type PageTabItem =
  | string
  | {
      label: string;
      id?: string;
    };

export type PageTabsProps = {
  items: PageTabItem[];
};

type ResolvedTab = {
  label: string;
  id: string;
};

function normalizeHeading(value: string): string {
  return value.trim().toLowerCase();
}

function resolveLabel(item: PageTabItem): string {
  return typeof item === "string" ? item : item.label;
}

function resolveFallbackId(item: PageTabItem): string {
  if (typeof item !== "string" && item.id) return item.id;
  return headingSlug(resolveLabel(item));
}

export function PageTabs({ items }: PageTabsProps) {
  const fallbackTabs = useMemo<ResolvedTab[]>(
    () =>
      items.map((item) => ({
        label: resolveLabel(item),
        id: resolveFallbackId(item),
      })),
    [items],
  );

  const [tabs, setTabs] = useState<ResolvedTab[]>(fallbackTabs);
  const [activeId, setActiveId] = useState<string | null>(
    fallbackTabs[0]?.id ?? null,
  );

  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    const headings = Array.from(
      article.querySelectorAll<HTMLHeadingElement>("h2[id]"),
    );

    const resolved = items.map((item) => {
      const label = resolveLabel(item);
      const explicitId = typeof item !== "string" ? item.id : undefined;
      const match = headings.find(
        (heading) =>
          normalizeHeading(heading.textContent ?? "") ===
          normalizeHeading(label),
      );

      return {
        label,
        id: explicitId ?? match?.id ?? headingSlug(label),
      };
    });

    setTabs(resolved);
    setActiveId(resolved[0]?.id ?? null);

    if (resolved.length === 0) return;

    const elements = resolved
      .map((tab) => document.getElementById(tab.id))
      .filter((element): element is HTMLElement => element != null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting);
      if (visible.length === 0) return;
      const first = visible.sort(
        (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
      )[0];
      setActiveId(first.target.id);
    }, getDocsScrollObserverOptions());

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [items]);

  if (tabs.length === 0) return null;

  return (
    <nav
      aria-label="Page sections"
      className="sticky top-0 z-[25] -mx-1 mb-4 w-[calc(100%+0.5rem)] bg-[color:var(--color-bg)] px-1"
    >
      <div
        role="tablist"
        className={[
          "flex overflow-x-auto whitespace-nowrap leading-none",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        ].join(" ")}
      >
        {tabs.map((tab) => {
          const isActive = activeId === tab.id;

          return (
            <a
              key={tab.id}
              href={`#${tab.id}`}
              role="tab"
              aria-selected={isActive}
              className={cx(
                "group -mb-px shrink-0 border-b-2 py-2 no-underline transition-colors",
                isActive
                  ? "border-[color:var(--color-accent)]"
                  : "border-transparent",
              )}
            >
              <span
                className={cx(
                  "mx-0.5 block rounded-md px-3 py-1.5 text-sm transition-colors",
                  isActive
                    ? "font-semibold text-[color:var(--color-accent)] hover:bg-[color:var(--color-bg-muted)] active:bg-[color:var(--color-bg-subtle)]"
                    : "font-normal text-[color:var(--color-fg-muted)] hover:bg-[color:var(--color-bg-subtle)] hover:text-[color:var(--color-fg)] active:bg-[color:var(--color-bg-muted)]",
                )}
              >
                {tab.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
