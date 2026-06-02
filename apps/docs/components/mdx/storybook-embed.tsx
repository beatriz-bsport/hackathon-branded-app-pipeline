import { useEffect, useMemo, useState } from "react";

const DEFAULT_BASE = "https://docs.infra.bsport.io/storybook/kaizen/dev";
const STORYBOOK_BASE =
  import.meta.env.VITE_STORYBOOK_BASE_URL?.trim() || DEFAULT_BASE;
const DEFAULT_MODE = "playground";
const DEFAULT_HEIGHT = 520;
const STORYBOOK_THEME = "light";

type StorybookEmbedMode = "playground" | "preview";

function buildSrc(base: string, id: string): string {
  const params = new URLSearchParams({
    path: `/story/${id}`,
    viewMode: "story",
    docsEmbed: "1",
    nav: "0",
    panel: "bottom",
    shortcuts: "false",
    singleStory: "true",
    globals: `theme:${STORYBOOK_THEME}`,
  });
  return `${base.replace(/\/$/, "")}/index.html?${params.toString()}`;
}

export type StorybookEmbedProps = {
  id: string;
  height?: number;
  title?: string;
  stories?: Array<{ id: string; label: string }>;
  mode?: StorybookEmbedMode;
};

export function StorybookEmbed({
  id,
  height = DEFAULT_HEIGHT,
  title,
  stories,
  mode = DEFAULT_MODE,
}: StorybookEmbedProps) {
  const options = useMemo(
    () =>
      stories && stories.length > 0
        ? stories
        : [{ id, label: "Playground" }],
    [id, stories],
  );
  const defaultStoryId = options[0]?.id ?? id;
  const [selectedId, setSelectedId] = useState<string>(defaultStoryId);

  useEffect(() => {
    setSelectedId(defaultStoryId);
  }, [defaultStoryId]);

  const base = STORYBOOK_BASE;
  const src = buildSrc(base, selectedId);
  const label = title ?? `Live example: ${selectedId}`;
  const managerHref = `${base.replace(/\/$/, "")}/index.html?path=/story/${selectedId}`;

  return (
    <figure className="storybook-embed my-4 w-full max-w-none overflow-hidden rounded-lg border border-[color:var(--color-border)]">
      {mode === "playground" ? (
        <div className="flex items-center justify-between gap-3 border-b border-[color:var(--color-border)] bg-[color:var(--color-bg-subtle)] px-3 py-2">
          <label className="flex min-w-0 items-center gap-2 text-xs text-[color:var(--color-fg-muted)]">
            <span>Story</span>
            <select
              className="min-w-[220px] rounded border border-[color:var(--color-border)] bg-[color:var(--color-bg-canvas)] px-2 py-1 text-xs text-[color:var(--color-fg)]"
              value={selectedId}
              onChange={(event) => setSelectedId(event.target.value)}
            >
              {options.map((story) => (
                <option key={story.id} value={story.id}>
                  {story.label}
                </option>
              ))}
            </select>
          </label>
          <a
            href={managerHref}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 text-xs font-medium text-[color:var(--color-fg)]"
          >
            Open in Storybook ↗
          </a>
        </div>
      ) : null}
      <iframe
        src={src}
        title={label}
        loading="lazy"
        className="block w-full border-0 bg-white"
        style={{ height }}
      />
    </figure>
  );
}
