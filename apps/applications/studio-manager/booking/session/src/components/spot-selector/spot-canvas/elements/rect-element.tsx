import React from "react";

import type { CanvasElement, CanvasRectData } from "@bsport/api-book";

import { translateRotate } from "../canvas-transformer";

export type RectElementProps = { element: CanvasElement<CanvasRectData> };

const RectElementComponent: React.FC<RectElementProps> = ({ element }) => {
  const { width, height, fill, stroke } = element.data;
  return (
    <g transform={translateRotate(element.data)}>
      <rect
        x={-width / 2}
        y={-height / 2}
        width={width}
        height={height}
        fill={fill ?? "none"}
        stroke={stroke ?? "var(--kz-color-luna-grey-500)"}
      />
    </g>
  );
};

export const RectElement = React.memo(RectElementComponent);
