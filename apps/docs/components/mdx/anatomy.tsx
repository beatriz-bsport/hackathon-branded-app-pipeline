import { resolveAssetUrl } from "#src/lib/asset-url";

export type AnatomyPart = {
  label: string;
  description?: string;
};

export type AnatomyProps = {
  src?: string;
  alt?: string;
  parts: AnatomyPart[];
};

export function Anatomy({ src, alt, parts }: AnatomyProps) {
  const imageSrc = src ? resolveAssetUrl(src) : null;

  return (
    <figure className="anatomy my-4 flex w-full flex-col gap-4">
      {imageSrc ? (
        <div className="w-full overflow-hidden rounded-lg bg-[color:var(--color-bg-subtle)] p-6">
          <img
            src={imageSrc}
            alt={alt ?? "Anatomy diagram"}
            className="mx-auto block max-h-72 w-auto"
          />
        </div>
      ) : (
        <div className="w-full rounded-lg bg-[color:var(--color-bg-subtle)] p-6 text-center text-sm text-[color:var(--color-fg-muted)]">
          Anatomy diagram placeholder
        </div>
      )}
      <div
        role="list"
        className="anatomy-parts grid w-full grid-cols-1 gap-3 sm:grid-cols-2"
      >
        {parts.map((part, index) => (
          <div
            key={part.label}
            role="listitem"
            className="flex w-full min-w-0 items-start gap-3 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-bg)] p-4 text-sm"
          >
            <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-bg-muted)] text-xs font-semibold">
              {index + 1}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="font-medium">{part.label}</span>
              {part.description ? (
                <span className="text-[color:var(--color-fg-subtle)]">
                  {part.description}
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}
