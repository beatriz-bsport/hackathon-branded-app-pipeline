import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import { cx } from "#src/lib/cx";

type Heading = {
  id: string;
  text: string;
  level: number;
};

function collectHeadings(): HTMLHeadingElement[] {
  const article = document.querySelector("article");
  if (!article) return [];

  return Array.from(
    article.querySelectorAll<HTMLHeadingElement>("h2, h3"),
  ).filter((el) => el.id);
}

export function TableOfContents() {
  const { pathname } = useLocation();
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    let headingObserver: IntersectionObserver | undefined;
    let mutationObserver: MutationObserver | undefined;
    let cancelled = false;
    let debounceTimer: ReturnType<typeof setTimeout> | undefined;

    const sync = () => {
      if (cancelled) return;

      const elements = collectHeadings();

      setHeadings(
        elements.map((el) => ({
          id: el.id,
          text: el.textContent?.trim() ?? "",
          level: Number(el.tagName.slice(1)),
        })),
      );
      setActiveId((current) => current ?? elements[0]?.id ?? null);

      headingObserver?.disconnect();
      if (elements.length === 0) return;

      headingObserver = new IntersectionObserver(
        (entries) => {
          const visible = entries.filter((entry) => entry.isIntersecting);
          if (visible.length === 0) return;
          const first = visible.sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )[0];
          setActiveId(first.target.id);
        },
        { rootMargin: "-80px 0px -65% 0px", threshold: [0, 1] },
      );

      elements.forEach((el) => headingObserver?.observe(el));
    };

    const scheduleSync = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(sync, 50);
    };

    const article = document.querySelector("article");
    if (article) {
      mutationObserver = new MutationObserver(scheduleSync);
      mutationObserver.observe(article, { childList: true, subtree: true });
    }

    scheduleSync();

    return () => {
      cancelled = true;
      if (debounceTimer) clearTimeout(debounceTimer);
      headingObserver?.disconnect();
      mutationObserver?.disconnect();
    };
  }, [pathname]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[color:var(--color-fg-muted)]">
        On this page
      </p>
      <ul className="flex flex-col gap-1">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: (heading.level - 2) * 12 }}
          >
            <a
              href={`#${heading.id}`}
              className={cx(
                "block py-0.5 transition-colors",
                activeId === heading.id
                  ? "font-medium text-[color:var(--color-accent)]"
                  : "text-[color:var(--color-fg-subtle)] hover:text-[color:var(--color-fg)]",
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
