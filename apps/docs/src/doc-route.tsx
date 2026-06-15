import type { MDXProps } from "mdx/types";
import { Suspense, lazy, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

import { PageActions } from "#src/components/layout/page-actions";
import { mdxComponents } from "#src/components/mdx";
import { HeadingAnchorEnhancer } from "#src/components/mdx/heading-anchor-enhancer";
import { PageTabs } from "#src/components/mdx/page-tabs";
import { cx } from "#src/lib/cx";
import type { Frontmatter } from "#src/lib/frontmatter";
import pagesManifest from "#src/lib/generated/pages-manifest.json";

type DocRouteProps = {
  slug?: string[];
  catchAll?: boolean;
};

type ManifestEntry = {
  slug: string[];
  href: string;
  frontmatter: Frontmatter;
  contentPath: string;
};

const manifest = pagesManifest as ManifestEntry[];

const mdxModules = import.meta.glob<{ default: React.ComponentType<MDXProps> }>(
  "../content/**/*.mdx",
);

const STATUS_TONE: Record<string, string> = {
  stable: "text-[color:var(--color-success)]",
  beta: "text-[color:var(--color-info)]",
  deprecated: "text-[color:var(--color-danger)]",
  internal: "text-[color:var(--color-warning)]",
};

function resolveSlug(props: DocRouteProps, pathname: string): string[] {
  if (props.slug) return props.slug;
  if (props.catchAll) {
    const slug = pathname.split("/").filter(Boolean);
    if (slug.length === 1 && slug[0] === "index.html") return ["welcome"];
    return slug.length > 0 ? slug : ["welcome"];
  }
  return ["welcome"];
}

function findEntry(slug: string[]): ManifestEntry | undefined {
  return manifest.find(
    (e) =>
      e.slug.length === slug.length && e.slug.every((s, i) => s === slug[i]),
  );
}

function contentPathToGlobKey(contentPath: string): string {
  return `../content/${contentPath}`;
}

export function DocRoute(props: DocRouteProps) {
  const { pathname } = useLocation();
  const slug = resolveSlug(props, pathname);
  const entry = findEntry(slug);

  if (!entry) {
    return (
      <article className="flex w-full flex-col py-2">
        <h1 className="text-4xl font-bold tracking-tight">Page not found</h1>
        <p className="mt-4 text-lg text-[color:var(--color-fg-subtle)]">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
      </article>
    );
  }

  return <DocPageContent entry={entry} key={entry.href} />;
}

function DocPageContent({ entry }: { entry: ManifestEntry }) {
  const { frontmatter, href } = entry;
  const statusTone = frontmatter.status
    ? STATUS_TONE[frontmatter.status]
    : undefined;

  const MdxComponent = useMemo(() => {
    const globKey = contentPathToGlobKey(entry.contentPath);
    const loader = mdxModules[globKey];
    if (!loader) return null;
    return lazy(loader);
  }, [entry.contentPath]);

  useEffect(() => {
    const title = frontmatter.title
      ? `${frontmatter.title} · Kaizen`
      : "Kaizen Design System";
    document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta && frontmatter.description) {
      meta.setAttribute("content", frontmatter.description);
    }
  }, [frontmatter]);

  if (!MdxComponent) {
    return (
      <article className="flex w-full flex-col py-2">
        <p className="text-lg text-[color:var(--color-fg-subtle)]">
          Content not found.
        </p>
      </article>
    );
  }

  return (
    <article
      className="flex w-full flex-col py-2"
      data-has-page-tabs={frontmatter.sections?.length ? "" : undefined}
    >
      <header
        className={cx(
          "mb-4 flex flex-col gap-4",
          !frontmatter.sections?.length &&
            "border-b border-[color:var(--color-border)] pb-6",
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <h1 className="text-4xl font-bold tracking-tight">
              {frontmatter.title}
            </h1>
            {frontmatter.status ? (
              <span
                className={[
                  "inline-flex items-center rounded-full border border-[color:var(--color-border)] px-2 py-0.5 text-xs font-medium uppercase tracking-wider",
                  statusTone ?? "text-[color:var(--color-fg-muted)]",
                ].join(" ")}
              >
                {frontmatter.status}
              </span>
            ) : null}
          </div>
          <PageActions href={href} frontmatter={frontmatter} />
        </div>
        {frontmatter.description ? (
          <p className="text-lg text-[color:var(--color-fg-subtle)]">
            {frontmatter.description}
          </p>
        ) : null}
      </header>
      {frontmatter.sections?.length ? (
        <PageTabs items={frontmatter.sections} />
      ) : null}
      <div className="prose-doc prose-doc-body mt-8 flex flex-col gap-4">
        <HeadingAnchorEnhancer />
        <Suspense
          fallback={
            <p className="text-sm text-[color:var(--color-fg-muted)]">
              Loading…
            </p>
          }
        >
          <MdxComponent components={mdxComponents} />
        </Suspense>
      </div>
    </article>
  );
}
