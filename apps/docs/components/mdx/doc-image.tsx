import { resolveAssetUrl } from "#src/lib/asset-url";
import { cx } from "#src/lib/cx";

export type DocImageAspectRatio =
  | "auto"
  | "16/9"
  | "4/3"
  | "3/2"
  | "1/1"
  | "9/16";

export type DocImageProps = {
  /** Static image path or absolute URL. */
  src: string;
  alt: string;
  /** Optional caption below the image. */
  caption?: string;
  /** Optional Figma frame URL. When set, the image links to Figma. */
  figma?: string;
  /** Fixed aspect ratio for the image frame. Defaults to `auto` (natural image proportions). */
  aspectRatio?: DocImageAspectRatio;
  /** When `false`, constrains width and centers the block. Defaults to `true`. */
  fullWidth?: boolean;
};

const ASPECT_RATIO_CLASS: Record<
  Exclude<DocImageAspectRatio, "auto">,
  string
> = {
  "16/9": "aspect-video",
  "4/3": "aspect-[4/3]",
  "3/2": "aspect-[3/2]",
  "1/1": "aspect-square",
  "9/16": "aspect-[9/16]",
};

export function DocImage({
  src,
  alt,
  caption,
  figma,
  aspectRatio = "auto",
  fullWidth = true,
}: DocImageProps) {
  const imageSrc = resolveAssetUrl(src);
  const hasFixedAspectRatio = aspectRatio !== "auto";

  const image = (
    <img
      src={imageSrc}
      alt={alt}
      className={cx(
        "block bg-[color:var(--color-bg-canvas)]",
        hasFixedAspectRatio
          ? "size-full object-contain"
          : "w-full object-contain",
      )}
    />
  );

  const media = figma ? (
    <a
      href={figma}
      target="_blank"
      rel="noreferrer"
      className="group block size-full"
      aria-label={`Open Figma frame: ${alt}`}
    >
      {image}
      <span className="flex items-center justify-end border-t border-[color:var(--color-border)] px-3 py-1.5 text-[11px] font-medium text-[color:var(--color-fg-muted)] group-hover:text-[color:var(--color-fg)]">
        Open in Figma ↗
      </span>
    </a>
  ) : (
    image
  );

  return (
    <figure
      className={cx(
        "doc-image my-4 flex flex-col overflow-hidden rounded-lg border border-[color:var(--color-border)]",
        fullWidth ? "w-full" : "mx-auto w-full max-w-2xl",
      )}
    >
      <div
        className={cx(
          "overflow-hidden bg-[color:var(--color-bg-canvas)]",
          hasFixedAspectRatio &&
            cx(
              "flex items-center justify-center bg-[color:var(--color-bg-subtle)]",
              ASPECT_RATIO_CLASS[aspectRatio],
            ),
        )}
      >
        {hasFixedAspectRatio ? <div className="size-full">{media}</div> : media}
      </div>
      {caption ? (
        <figcaption className="border-t border-[color:var(--color-border)] px-4 py-2 text-sm text-[color:var(--color-fg-subtle)]">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
