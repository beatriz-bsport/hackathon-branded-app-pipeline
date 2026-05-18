import type React from "react";

import type { SpotType } from "@bsport/api-book";
import { Body } from "@bsport/kaizen-primitive-core";

export type SpotLegendProps = { spotTypes: SpotType[] };

const CHIP_PX = 20;

/**
 * Renders a non-interactive visual sample for one SpotType:
 *  - personalized types with a `free_image` show the actual PNG (aspect ratio
 *    preserved inside the chip box), so benches read as rectangles and
 *    cycle/bag spots read as circles — matches what the user sees on the
 *    canvas exactly.
 *  - non-personalized types fall back to their authored `shape` rendered with
 *    the SpotType's own fill / stroke colours.
 *
 * Bypasses `<SpotElement>` because the legend doesn't want the label glyph
 * or click handling — just a clean swatch.
 */
const SpotLegendChip: React.FC<{ spotType: SpotType }> = ({ spotType }) => {
  if (spotType.customization === "personalized" && spotType.free_image) {
    return (
      <svg
        width={CHIP_PX}
        height={CHIP_PX}
        aria-hidden="true"
        className="shrink-0"
      >
        <image
          href={spotType.free_image}
          width={CHIP_PX}
          height={CHIP_PX}
          preserveAspectRatio="xMidYMid meet"
        />
      </svg>
    );
  }
  const fill = spotType.fill_color || "var(--kz-color-surface-default)";
  const stroke = spotType.stroke_color || "var(--kz-color-onsurface-default)";
  return (
    <svg
      width={CHIP_PX}
      height={CHIP_PX}
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="shrink-0"
    >
      {spotType.shape === "rectangle" ? (
        <rect
          x={2}
          y={5}
          width={16}
          height={10}
          rx={1}
          fill={fill}
          stroke={stroke}
          strokeWidth={1.25}
        />
      ) : spotType.shape === "triangle" ? (
        <polygon
          points="10,2 18,18 2,18"
          fill={fill}
          stroke={stroke}
          strokeWidth={1.25}
          strokeLinejoin="round"
        />
      ) : spotType.shape === "square" ? (
        <rect
          x={3}
          y={3}
          width={14}
          height={14}
          rx={1}
          fill={fill}
          stroke={stroke}
          strokeWidth={1.25}
        />
      ) : (
        <circle
          cx={10}
          cy={10}
          r={8}
          fill={fill}
          stroke={stroke}
          strokeWidth={1.25}
        />
      )}
    </svg>
  );
};

/** Legend for spot types (e.g. Standard, VIP, Poolside); rendered horizontally
 *  and shown only when a session has multiple referenced types.
 *
 *  Uses `display: contents` so items flow into the parent flex-wrap container
 *  in SpotSelectorModal — keeps the status + type legends on one continuous
 *  wrapping row instead of two independently-wrapping rows. */
export const SpotLegend: React.FC<SpotLegendProps> = ({ spotTypes }) => {
  return (
    <div className="contents" role="list">
      {spotTypes.map((st) => (
        <div key={st.id} role="listitem" className="flex items-center gap-2xs">
          <SpotLegendChip spotType={st} />
          <Body size="sm" weight="weak" color="default">
            {st.name}
          </Body>
        </div>
      ))}
    </div>
  );
};
