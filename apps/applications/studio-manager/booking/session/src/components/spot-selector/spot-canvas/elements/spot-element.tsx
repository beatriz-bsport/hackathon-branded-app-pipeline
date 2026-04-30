import clsx from "clsx";
import React from "react";

import type { CanvasElement, CanvasSpotData, SpotType } from "@bsport/api-book";

import { useTranslation } from "#src/utils/i18n";

import { translateRotate } from "../canvas-transformer";
import { composeLabel, truncateLabel } from "../spot-label";
import {
  SPOT_RING_STROKE,
  SPOT_STATE_LABEL_KEY,
  SPOT_STATE_STYLE,
  resolveSpotState,
} from "../spot-styles";
import {
  DEFAULT_RADIUS,
  DEFAULT_RECT_H,
  DEFAULT_RECT_W,
  DEFAULT_SQUARE,
  PERSONALIZED_IMAGE_SIZE,
  smallestDim,
} from "./spot-dimensions";

export type SpotElementProps = {
  element: CanvasElement<CanvasSpotData>;
  spotType: SpotType | undefined;
  assetUrl: string | undefined;
  /** True when this spot is the participant's pending selection. */
  selected?: boolean;
  /** True when this spot is the participant's existing / current spot. */
  isCurrent?: boolean;
  onClick?: (index: number, spotTypeId: number) => void;
};

const IMAGE_CLIP_PATH_STYLE: React.CSSProperties = {
  clipPath: "inset(0 round 4px)",
};

type ShapeGeometry =
  | { kind: "rect"; w: number; h: number; rx: number }
  | { kind: "polygon"; points: string }
  | { kind: "circle"; r: number }
  | { kind: "image"; href: string; size: number };

const shapeGeometry = (
  shape: SpotType["shape"] | undefined,
  data: CanvasSpotData,
  assetUrl: string | undefined,
  offset = 0,
): ShapeGeometry => {
  switch (shape) {
    case "square": {
      const s = (data.width ?? DEFAULT_SQUARE) + offset * 2;
      return { kind: "rect", w: s, h: s, rx: offset > 0 ? 6 : 4 };
    }
    case "rectangle": {
      const w = (data.width ?? DEFAULT_RECT_W) + offset * 2;
      const h = (data.height ?? DEFAULT_RECT_H) + offset * 2;
      return { kind: "rect", w, h, rx: offset > 0 ? 6 : 4 };
    }
    case "triangle": {
      const s = (data.width ?? DEFAULT_SQUARE) + offset * 2;
      return {
        kind: "polygon",
        points: `0,${-s / 2} ${s / 2},${s / 2} ${-s / 2},${s / 2}`,
      };
    }
    case "personalized": {
      if (!assetUrl) {
        return { kind: "circle", r: (data.radius ?? DEFAULT_RADIUS) + offset };
      }
      if (offset === 0) {
        return { kind: "image", href: assetUrl, size: PERSONALIZED_IMAGE_SIZE };
      }
      // Selection ring around an image body — match the image's square
      // footprint so the dashed ring doesn't read as a circle around a square.
      const s = PERSONALIZED_IMAGE_SIZE + offset * 2;
      return { kind: "rect", w: s, h: s, rx: 6 };
    }
    case "circular":
    default:
      return { kind: "circle", r: (data.radius ?? DEFAULT_RADIUS) + offset };
  }
};

const ShapeGlyph: React.FC<{
  geometry: ShapeGeometry;
  attrs: React.SVGAttributes<SVGElement>;
  /** Image geometry can't accept fill/stroke directly. When set, overlays a
   *  semi-transparent rect using attrs.fill/stroke so personalized spots show
   *  the current/selected highlight. */
  highlightImage?: boolean;
}> = ({ geometry, attrs, highlightImage = false }) => {
  switch (geometry.kind) {
    case "rect":
      return (
        <rect
          x={-geometry.w / 2}
          y={-geometry.h / 2}
          width={geometry.w}
          height={geometry.h}
          rx={geometry.rx}
          {...attrs}
        />
      );
    case "polygon":
      return (
        <polygon points={geometry.points} strokeLinejoin="round" {...attrs} />
      );
    case "circle":
      return <circle r={geometry.r} {...attrs} />;
    case "image": {
      const half = geometry.size / 2;
      return (
        <>
          <image
            href={geometry.href}
            x={-half}
            y={-half}
            width={geometry.size}
            height={geometry.size}
            // Round image corners so the rect overlay/ring sits flush.
            style={IMAGE_CLIP_PATH_STYLE}
          />
          {highlightImage ? (
            <rect
              x={-half}
              y={-half}
              width={geometry.size}
              height={geometry.size}
              rx={4}
              fill={attrs.fill}
              fillOpacity={0.35}
              stroke={attrs.stroke}
              strokeWidth={attrs.strokeWidth}
              pointerEvents="none"
            />
          ) : null}
        </>
      );
    }
  }
};

const SpotElementComponent: React.FC<SpotElementProps> = ({
  element,
  spotType,
  assetUrl,
  selected = false,
  isCurrent = false,
  onClick,
}) => {
  const { t } = useTranslation("sessionManagement");
  const { index, indexType, spotTypeId, taken, x, y, rotation } = element.data;

  const visualState = resolveSpotState({ selected, isCurrent, taken });
  const style = SPOT_STATE_STYLE[visualState];

  const label = composeLabel(
    spotType?.prefix,
    indexType,
    index,
    spotType?.suffix,
  );

  // Legacy parity: taken spots still fire onClick — the parent surfaces the
  // "spot is taken" alert (see SpotSelectorModal.handleSelectSpot).
  const handleClick = onClick ? () => onClick(index, spotTypeId) : undefined;

  const ariaLabel = t("spotSelector.spotAriaLabel", {
    label,
    state: t(SPOT_STATE_LABEL_KEY[visualState]),
  });

  const dim = smallestDim(spotType?.shape, element.data, assetUrl);
  const fontSize = Math.max(10, Math.round(dim * 0.45));
  const ringOffset = dim / 2 + 5;

  const isInteractive = Boolean(onClick);
  const bodyGeometry = shapeGeometry(spotType?.shape, element.data, assetUrl);
  const ringGeometry = selected
    ? shapeGeometry(spotType?.shape, element.data, assetUrl, ringOffset)
    : null;

  return (
    <g
      transform={translateRotate({ x, y, rotation })}
      role={isInteractive ? "button" : "img"}
      aria-label={ariaLabel}
      aria-pressed={isInteractive ? selected : undefined}
      aria-disabled={isInteractive && taken ? true : undefined}
      onClick={handleClick}
      className={clsx(
        "spot-element",
        isInteractive && !taken && "cursor-pointer",
        isInteractive && taken && "cursor-not-allowed",
        // Fade taken spots so available ones stand out, but never fade the
        // participant's own selected or current spot
        taken && !selected && !isCurrent && "opacity-[0.55]",
        "transition-[filter,transform] duration-default",
        isInteractive && !taken && "hover:brightness-95",
      )}
    >
      {ringGeometry ? (
        <ShapeGlyph
          geometry={ringGeometry}
          attrs={{
            fill: "none",
            stroke: SPOT_RING_STROKE,
            strokeWidth: 2,
            strokeDasharray: "4 3",
          }}
        />
      ) : null}

      <ShapeGlyph
        geometry={bodyGeometry}
        attrs={{
          fill: style.fill,
          stroke: style.stroke,
          strokeWidth: style.strokeWidth,
        }}
        highlightImage={isCurrent || selected}
      />

      <text
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fill: style.textColor,
          fontSize,
          fontWeight: "var(--kz-font-weight-stronger)",
          // paint-order draws the stroke halo behind the fill so labels stay
          // legible on any spot colour.
          paintOrder: "stroke fill",
          stroke: selected
            ? "var(--kz-color-surface-main-strong)"
            : "var(--kz-color-surface-default)",
          strokeWidth: 3,
          strokeLinejoin: "round",
        }}
        className="pointer-events-none select-none"
      >
        {truncateLabel(label)}
      </text>
    </g>
  );
};

export const SpotElement = React.memo(SpotElementComponent);
