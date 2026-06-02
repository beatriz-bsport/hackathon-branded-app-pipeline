import type { ReactNode } from "react";

import { resolveAssetUrl } from "#src/lib/asset-url";
import { cx } from "#src/lib/cx";
import figmaImages from "#src/lib/generated/figma-images.json";

export type DoDontProps = {
  children: ReactNode;
};

export function DoDont({ children }: DoDontProps) {
  return <div className="my-4 grid gap-3 md:grid-cols-2">{children}</div>;
}

export type DoDontItemProps = {
  caption: string;
  /** Figma frame URL — must include `node-id`. Resolved at build time via generate:figma-images. */
  figma?: string;
  /** Static image path or URL. Used as-is, or as a fallback when the Figma API is unavailable. */
  image?: string;
  alt?: string;
};

type DoDontCardProps = DoDontItemProps & {
  variant: "do" | "dont";
  imageSrc: string | null;
};

function DoDontCard({
  caption,
  figma,
  imageSrc,
  alt,
  variant,
}: DoDontCardProps) {
  const isDo = variant === "do";
  const imageAlt = alt ?? caption;
  const image = imageSrc ? (
    figma ? (
      <a
        href={figma}
        target="_blank"
        rel="noreferrer"
        className="group block bg-[color:var(--color-bg-canvas)]"
        aria-label={`Open Figma frame: ${caption}`}
      >
        <img
          src={imageSrc}
          alt={imageAlt}
          className="block w-full object-contain"
        />
        <span className="flex items-center justify-end border-t border-[color:var(--color-border)] px-3 py-1.5 text-[11px] font-medium text-[color:var(--color-fg-muted)] group-hover:text-[color:var(--color-fg)]">
          Open in Figma ↗
        </span>
      </a>
    ) : (
      <img
        src={imageSrc}
        alt={imageAlt}
        className="block w-full bg-[color:var(--color-bg-canvas)] object-contain"
      />
    )
  ) : null;

  return (
    <figure
      className={cx(
        "flex flex-col overflow-hidden rounded-lg border",
        isDo
          ? "border-[color:var(--color-success)]/40"
          : "border-[color:var(--color-danger)]/40",
      )}
    >
      <div
        className={cx(
          "flex items-center gap-2 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider",
          isDo
            ? "bg-[color:var(--color-success)]/10 text-[color:var(--color-success)]"
            : "bg-[color:var(--color-danger)]/10 text-[color:var(--color-danger)]",
        )}
      >
        <span aria-hidden="true">{isDo ? "✓" : "✗"}</span>
        {isDo ? "Do" : "Don't"}
      </div>
      {image}
      <figcaption className="border-t border-[color:var(--color-border)] px-4 py-2 text-sm text-[color:var(--color-fg-subtle)]">
        {caption}
      </figcaption>
    </figure>
  );
}

const figmaImageMap = figmaImages as Record<string, string>;

function resolveDoDontImageSrc({
  figma,
  image,
}: {
  figma?: string;
  image?: string;
}): string | null {
  if (image?.trim()) return resolveAssetUrl(image);
  if (figma?.trim()) return figmaImageMap[figma.trim()] ?? null;
  return null;
}

export function Do({ caption, figma, image, alt }: DoDontItemProps) {
  const imageSrc = resolveDoDontImageSrc({ figma, image });
  return (
    <DoDontCard
      variant="do"
      caption={caption}
      figma={figma}
      image={image}
      alt={alt}
      imageSrc={imageSrc}
    />
  );
}

export function Dont({ caption, figma, image, alt }: DoDontItemProps) {
  const imageSrc = resolveDoDontImageSrc({ figma, image });
  return (
    <DoDontCard
      variant="dont"
      caption={caption}
      figma={figma}
      image={image}
      alt={alt}
      imageSrc={imageSrc}
    />
  );
}
