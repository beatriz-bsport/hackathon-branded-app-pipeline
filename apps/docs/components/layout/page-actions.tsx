import { useEffect, useId, useRef, useState } from "react";

import { cx } from "#src/lib/cx";
import type { Frontmatter } from "#src/lib/frontmatter";

type PageActionsProps = {
  href: string;
  frontmatter: Frontmatter;
};

function withDocsBasePath(href: string): string {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
  const path = href.startsWith("/") ? href : `/${href}`;
  return `${basePath}${path}`;
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className={cx(
        "size-4 shrink-0 transition-transform duration-200",
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

export function PageActions({ href, frontmatter }: PageActionsProps) {
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle",
  );

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  async function handleCopy() {
    const markdownHref = `${withDocsBasePath(href)}.md`;

    try {
      const response = await fetch(markdownHref, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await response.text();
      await navigator.clipboard.writeText(text);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      setCopyState("error");
      setTimeout(() => setCopyState("idle"), 2500);
    } finally {
      setOpen(false);
    }
  }

  const menuItemClassName =
    "flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-[color:var(--color-fg)] hover:bg-[color:var(--color-bg-subtle)]";
  const markdownHref = `${withDocsBasePath(href)}.md`;

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="menu"
        aria-label="Page actions"
        onClick={() => setOpen((value) => !value)}
        className={cx(
          "inline-flex items-center justify-center rounded-md border border-[color:var(--color-border)]",
          "size-9 text-[color:var(--color-fg-muted)] transition-colors",
          "hover:bg-[color:var(--color-bg-subtle)] hover:text-[color:var(--color-fg)]",
          open &&
            "bg-[color:var(--color-bg-subtle)] text-[color:var(--color-fg)]",
        )}
      >
        <ChevronIcon open={open} />
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          className={[
            "absolute top-[calc(100%+0.375rem)] right-0 z-40 min-w-44",
            "rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-bg)] p-1 shadow-lg",
          ].join(" ")}
        >
          <button
            type="button"
            role="menuitem"
            onClick={handleCopy}
            aria-live="polite"
            className={cx(
              menuItemClassName,
              copyState === "copied" && "text-[color:var(--color-success)]",
              copyState === "error" && "text-[color:var(--color-danger)]",
            )}
          >
            {copyState === "copied"
              ? "Copied"
              : copyState === "error"
                ? "Copy failed"
                : "Copy as Markdown"}
          </button>
          <a
            href={markdownHref}
            target="_blank"
            rel="noreferrer"
            role="menuitem"
            className={menuItemClassName}
            onClick={() => setOpen(false)}
          >
            View .md
          </a>
          {frontmatter.figma ? (
            <a
              href={frontmatter.figma}
              target="_blank"
              rel="noreferrer"
              role="menuitem"
              className={menuItemClassName}
              onClick={() => setOpen(false)}
            >
              Open in Figma
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
