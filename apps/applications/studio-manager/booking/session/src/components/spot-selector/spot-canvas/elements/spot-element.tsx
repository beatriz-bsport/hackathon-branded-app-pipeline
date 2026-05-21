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
  LENGTH_REFERENCE,
  resolveBodySize,
  smallestDim,
} from "./spot-dimensions";
import {
  labelAnchor,
  resolveSpotTextFill,
  rotationCentre,
} from "./spot-element-helpers";

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

// Each kind is positioned in the spot's local frame (where the spot's
// authored (x, y) is the top-left origin — saas-legacy CanvasSpot parity).
type ShapeGeometry =
  | { kind: "rect"; x: number; y: number; w: number; h: number; rx: number }
  | { kind: "polygon"; points: string }
  | { kind: "circle"; cx: number; cy: number; r: number }
  | { kind: "image"; href: string; w: number; h: number };

const shapeGeometry = (
  shape: SpotType["shape"] | undefined,
  data: CanvasSpotData,
  assetUrl: string | undefined,
  offset = 0,
): ShapeGeometry => {
  // Legacy parity: a resolved image overrides `shape`. Production SpotTypes
  // commonly report `shape: "circular"` alongside `customization: "personalized"`
  // — see resolveSpotAssetUrl for the SpotType-image path.
  if (assetUrl) {
    const w = data.width ?? LENGTH_REFERENCE;
    const h = data.height ?? LENGTH_REFERENCE;
    if (offset === 0) {
      return { kind: "image", href: assetUrl, w, h };
    }
    // Selection ring around an image body — match the image's footprint so
    // the dashed ring doesn't read as a circle around a rectangle.
    return {
      kind: "rect",
      x: -offset,
      y: -offset,
      w: w + offset * 2,
      h: h + offset * 2,
      rx: 6,
    };
  }
  switch (shape) {
    case "square": {
      const s = resolveBodySize(data, DEFAULT_SQUARE);
      return {
        kind: "rect",
        x: -offset,
        y: -offset,
        w: s + offset * 2,
        h: s + offset * 2,
        rx: offset > 0 ? 6 : 4,
      };
    }
    case "rectangle": {
      const w = data.width ?? DEFAULT_RECT_W;
      const h = data.height ?? DEFAULT_RECT_H;
      return {
        kind: "rect",
        x: -offset,
        y: -offset,
        w: w + offset * 2,
        h: h + offset * 2,
        rx: offset > 0 ? 6 : 4,
      };
    }
    case "triangle": {
      // Legacy parity (renderTriangleSpot): apex at top-centre, base spans
      // the bottom of an s×s bounding box anchored at (0,0).
      const s = resolveBodySize(data, DEFAULT_SQUARE) + offset * 2;
      const o = offset;
      return {
        kind: "polygon",
        points: `${s / 2 - o},${-o} ${-o},${s - o} ${s - o},${s - o}`,
      };
    }
    case "personalized":
    case "circular":
    default: {
      // Legacy parity (renderCircularSpot): circle inscribed in an s×s
      // bounding box anchored at (0,0). `s` is the authored height (the
      // dominant axis for circulars on the wire) or the legacy fallback.
      const s = resolveBodySize(data, DEFAULT_RADIUS * 2);
      return { kind: "circle", cx: s / 2, cy: s / 2, r: s / 2 + offset };
    }
  }
};

const ShapeGlyph: React.FC<{
  geometry: ShapeGeometry;
  attrs: React.SVGAttributes<SVGElement>;
}> = ({ geometry, attrs }) => {
  switch (geometry.kind) {
    case "rect":
      return (
        <rect
          x={geometry.x}
          y={geometry.y}
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
      return (
        <circle cx={geometry.cx} cy={geometry.cy} r={geometry.r} {...attrs} />
      );
    case "image":
      // Legacy parity: state-keyed personalized images (free/taken/selected)
      // already encode the spot's state via the PNG itself — overlaying a
      // tint would muddy the yellow `selected_image`. Selection-vs-current
      // disambiguation lives in the surrounding ring, not a tint.
      return (
        <image
          href={geometry.href}
          x={0}
          y={0}
          width={geometry.w}
          height={geometry.h}
          // Round image corners so the selection ring sits flush.
          style={IMAGE_CLIP_PATH_STYLE}
        />
      );
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
  const baseStyle = SPOT_STATE_STYLE[visualState];
  // Legacy precedence (saas-legacy CanvasSpot.component): per-element
  // `data.fill` / `data.stroke` win over both SpotType.fill_color/
  // stroke_color and the state-driven theme defaults. SpotType-authored
  // colors then apply for the free state only — taken/selected/current keep
  // theme colors so the functional state stays visually unambiguous.
  const dataFill = element.data.fill;
  const dataStroke = element.data.stroke;
  const dataStrokeWidth = element.data.strokeWidth;
  const spotTypePalette =
    visualState === "free" && spotType?.customization !== "personalized"
      ? spotType
      : null;
  // `||` (not `??`): the API conflates "no color" with empty string for
  // SpotType.fill_color / stroke_color, so `""` must fall through to the
  // state-driven theme default the same way `null` does.
  const style = {
    fill: dataFill ?? (spotTypePalette?.fill_color || baseStyle.fill),
    stroke: dataStroke ?? (spotTypePalette?.stroke_color || baseStyle.stroke),
    strokeWidth: dataStrokeWidth ?? baseStyle.strokeWidth,
    textColor: baseStyle.textColor,
  };

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
  const ringOffset = 5;

  const isInteractive = Boolean(onClick);
  const bodyGeometry = shapeGeometry(spotType?.shape, element.data, assetUrl);
  const ringGeometry = selected
    ? shapeGeometry(spotType?.shape, element.data, assetUrl, ringOffset)
    : null;
  const labelPos = labelAnchor(spotType?.shape, element.data, assetUrl);
  // Legacy parity: rotation pivots around the body's centre, not the
  // post-translate origin (which sits at the top-left after the top-left
  // positioning fix). Defaults to (0, 0) for non-rotated spots, which is a
  // no-op — `translateRotate` only emits the `rotate(...)` clause when
  // `rotation` is truthy.
  const { cx, cy } = rotationCentre(spotType?.shape, element.data, assetUrl);

  return (
    <g
      transform={translateRotate({ x, y, rotation, cx, cy })}
      role={isInteractive ? "button" : "img"}
      aria-label={ariaLabel}
      aria-pressed={isInteractive ? selected : undefined}
      aria-disabled={isInteractive && taken ? true : undefined}
      onClick={handleClick}
      className={clsx(
        "spot-element",
        isInteractive && !taken && "cursor-pointer",
        isInteractive && taken && "cursor-not-allowed",
        // Legacy parity (saas-legacy CanvasSpot): personalized state-keyed
        // images already encode "taken" via the BLACK `taken_image` PNG —
        // a separate opacity fade was muddying that into grey and breaking
        // parity with the modal legend's "Taken = solid black" swatch.
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
          ...(element.data.strokeDasharray
            ? { strokeDasharray: element.data.strokeDasharray }
            : {}),
        }}
      />

      <text
        textAnchor="middle"
        dominantBaseline="central"
        x={labelPos.x}
        y={labelPos.y}
        style={{
          // Per-spot text styling precedence (legacy parity): per-state colour
          // overrides take effect for taken/selected, then the generic
          // `fontColor`, then the theme default.
          fill: resolveSpotTextFill({
            visualState,
            data: element.data,
            base: style.textColor,
          }),
          fontSize: element.data.fontSize ?? fontSize,
          fontStyle: element.data.fontStyle,
          fontWeight:
            element.data.fontWeight ?? "var(--kz-font-weight-stronger)",
          // paint-order draws the stroke halo behind the fill so labels stay
          // legible on any spot colour.
          paintOrder: "stroke fill",
          stroke:
            element.data.textStroke ??
            (selected
              ? "var(--kz-color-surface-main-strong)"
              : "var(--kz-color-surface-default)"),
          strokeWidth: element.data.textStrokeWidth ?? 3,
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
