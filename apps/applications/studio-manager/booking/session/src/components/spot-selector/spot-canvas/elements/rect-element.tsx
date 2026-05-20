import React from "react";

import type { CanvasElement, CanvasRectData } from "@bsport/api-book";

import { translateRotate } from "../canvas-transformer";
import { DEFAULT_DECORATIVE_STROKE } from "../spot-styles";

export type RectElementProps = { element: CanvasElement<CanvasRectData> };

const RectElementComponent: React.FC<RectElementProps> = ({ element }) => {
  const {
    x,
    y,
    width,
    height,
    fill,
    stroke,
    strokeWidth,
    strokeDasharray,
    image,
    rotation,
  } = element.data;
  // Legacy parity (saas-legacy CanvasRect.component.tsx):
  //  - `(x, y)` is the rect's top-left.
  //  - Rotation pivots around the rect's centre `(width/2, height/2)` in the
  //    post-translate frame, NOT the top-left. Production blueprint 922 ships
  //    rect rotation 0 across the board, but rotated rects in other studios'
  //    blueprints would otherwise spin around their top-left corner.
  const transform = translateRotate({
    x,
    y,
    rotation,
    cx: width / 2,
    cy: height / 2,
  });

  if (image) {
    return (
      <g transform={transform}>
        <image
          href={image}
          x={0}
          y={0}
          width={width}
          height={height}
          preserveAspectRatio="none"
        />
      </g>
    );
  }

  return (
    <g transform={transform}>
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={fill ?? "transparent"}
        stroke={stroke ?? DEFAULT_DECORATIVE_STROKE}
        strokeWidth={strokeWidth ?? 1.5}
        strokeDasharray={strokeDasharray}
      />
    </g>
  );
};

export const RectElement = React.memo(RectElementComponent);
