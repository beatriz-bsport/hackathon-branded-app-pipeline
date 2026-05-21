import React from "react";

import type { CanvasDoorData, CanvasElement } from "@bsport/api-book";

import { translateRotate } from "../canvas-transformer";
import { DEFAULT_DECORATIVE_STROKE } from "../spot-styles";

export type DoorElementProps = { element: CanvasElement<CanvasDoorData> };

// Legacy parity (saas-legacy CanvasDoor.component): the door symbol is a
// vertical "frame" bar on the hinge side plus a left-pointing arrow icon
// showing the swing direction. Legacy authors the glyph inside a 70×65
// bounding box anchored at the wire `(x, y)` and rotates around the box
// centre `(35, 32.5)`. The revamp centres elements on the wire `(x, y)`
// rather than treating it as a top-left, so the geometry below is the
// legacy glyph shifted by `(-35, -32.5)` to land on the local origin —
// this preserves the visual identity (bar + arrow) without forcing every
// existing door position to migrate to legacy's top-left anchor.
const BAR_X = -15;
const BAR_HALF_HEIGHT = 17.5;

const DoorElementComponent: React.FC<DoorElementProps> = ({ element }) => {
  const { stroke, strokeWidth, strokeLinecap } = element.data;
  const s = stroke ?? DEFAULT_DECORATIVE_STROKE;
  const w = strokeWidth ?? 5;
  const cap = strokeLinecap ?? "round";
  return (
    <g transform={translateRotate(element.data)}>
      {/* Hinge-side vertical bar — legacy's `points="20,15 20,50"`
          translated to centre the 70×65 glyph on the local origin. */}
      <polyline
        points={`${BAR_X},${-BAR_HALF_HEIGHT} ${BAR_X},${BAR_HALF_HEIGHT}`}
        fill={s}
        stroke={s}
        strokeWidth={w}
        strokeLinecap={cap}
      />
      {/* Left-pointing arrow icon (Material-style) showing swing direction.
          Path is legacy's verbatim; the surrounding transform shifts the
          original `translate(25 15) scale(1.5)` by `(-35, -32.5)` so the
          arrow lands beside the bar in our centred frame. */}
      <path
        d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
        fill={s}
        stroke={s}
        strokeLinecap={cap}
        transform="translate(-10 -17.5) scale(1.5)"
      />
    </g>
  );
};

export const DoorElement = React.memo(DoorElementComponent);
