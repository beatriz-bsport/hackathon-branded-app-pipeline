import React from "react";

import type { CanvasDoorData, CanvasElement } from "@bsport/api-book";

import { translateRotate } from "../canvas-transformer";

export type DoorElementProps = { element: CanvasElement<CanvasDoorData> };

const DoorElementComponent: React.FC<DoorElementProps> = ({ element }) => {
  return (
    <g transform={translateRotate(element.data)}>
      <path
        d="M -10 -5 L 10 -5 L 10 5 L -10 5 Z"
        fill="none"
        stroke="var(--kz-color-luna-grey-500)"
        strokeWidth={1.5}
      />
    </g>
  );
};

export const DoorElement = React.memo(DoorElementComponent);
