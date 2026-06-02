import {
  BODY_SCALE,
  DISPLAY_SCALE,
  TITLE_SCALE,
} from "#src/components/mdx/type-scale-data";
import { getTokenByPath } from "#src/lib/tokens";

export type TypeScaleItem = {
  label: string;
  sizePath: string;
  lineHeightPath: string;
  weightPath?: string;
  sample?: string;
  usage?: string;
  component?: string;
};

export type TypeScaleProps = {
  title?: string;
  description?: string;
  items: TypeScaleItem[];
};

function tokenValue(path: string): string {
  return getTokenByPath(path)?.value ?? "—";
}

function TypeScaleRow({ item }: { item: TypeScaleItem }) {
  const fontSize = tokenValue(item.sizePath);
  const lineHeight = tokenValue(item.lineHeightPath);
  const fontWeight = item.weightPath
    ? tokenValue(item.weightPath)
    : tokenValue("font.weight.weak");
  const sample = item.sample ?? "The quick brown fox jumps over the lazy dog";

  return (
    <div className="grid gap-4 border-b border-[color:var(--color-border)] px-4 py-5 last:border-b-0 md:grid-cols-[minmax(0,1fr)_minmax(220px,320px)] md:items-center">
      <p
        className="truncate text-[color:var(--color-fg)]"
        style={{ fontSize, lineHeight, fontWeight }}
      >
        {sample}
      </p>
      <dl className="grid gap-1 text-xs text-[color:var(--color-fg-muted)]">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <dt className="font-medium text-[color:var(--color-fg-subtle)]">
            {item.label}
          </dt>
          {item.component ? (
            <dd className="font-mono">{item.component}</dd>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono">
          <span>
            <code>{item.sizePath}</code> · {fontSize}
          </span>
          <span>
            <code>{item.lineHeightPath}</code> · {lineHeight}
          </span>
        </div>
        {item.usage ? (
          <dd className="text-[color:var(--color-fg-subtle)]">{item.usage}</dd>
        ) : null}
      </dl>
    </div>
  );
}

export function TypeScale({ title, description, items }: TypeScaleProps) {
  return (
    <section className="my-6">
      {title ? (
        <header className="mb-3">
          <h3 className="font-bold tracking-tight">{title}</h3>
          {description ? (
            <p className="mt-1 text-sm text-[color:var(--color-fg-subtle)]">
              {description}
            </p>
          ) : null}
        </header>
      ) : null}
      <div className="overflow-hidden rounded-lg ring-1 ring-[color:var(--color-border)]">
        {items.map((item) => (
          <TypeScaleRow key={item.label} item={item} />
        ))}
      </div>
    </section>
  );
}

export function TitleTypeScale() {
  return (
    <TypeScale
      title="Title"
      description="Maps to Title htmlVariant h1–h5 in Kaizen primitives."
      items={TITLE_SCALE}
    />
  );
}

export function BodyTypeScale() {
  return (
    <TypeScale
      title="Body"
      description="Token-backed sizes. Body also exposes size=display and size=xl for larger in-component emphasis — see Components."
      items={BODY_SCALE}
    />
  );
}

export function DisplayTypeScale() {
  return (
    <TypeScale
      title="Display"
      description="Use sparingly in the Back Office. Prefer title tokens for operational screens."
      items={DISPLAY_SCALE}
    />
  );
}
