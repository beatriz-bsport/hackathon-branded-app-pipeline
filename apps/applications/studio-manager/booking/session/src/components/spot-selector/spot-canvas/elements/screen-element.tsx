import React from "react";

import type { CanvasElement, CanvasScreenData } from "@bsport/api-book";

import { translateRotate } from "../canvas-transformer";

export type ScreenElementProps = { element: CanvasElement<CanvasScreenData> };

const ScreenElementComponent: React.FC<ScreenElementProps> = ({ element }) => {
  const { width, height } = element.data;
  return (
    <g transform={translateRotate(element.data)}>
      <rect
        x={-width / 2}
        y={-height / 2}
        width={width}
        height={height}
        fill="var(--kz-color-luna-grey-800)"
        stroke="var(--kz-color-luna-grey-900)"
      />
    </g>
  );
};

export const ScreenElement = React.memo(ScreenElementComponent);
