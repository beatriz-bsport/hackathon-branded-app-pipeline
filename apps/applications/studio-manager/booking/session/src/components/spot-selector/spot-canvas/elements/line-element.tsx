import React from "react";

import type { CanvasElement, CanvasLineData } from "@bsport/api-book";

export type LineElementProps = { element: CanvasElement<CanvasLineData> };

const LineElementComponent: React.FC<LineElementProps> = ({ element }) => {
  // CanvasLineData has no `rotation`; rotation is implicit in the two endpoints.
  const { x1, y1, x2, y2, stroke } = element.data;
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={stroke ?? "var(--kz-color-luna-grey-500)"}
      strokeWidth={1.5}
    />
  );
};

export const LineElement = React.memo(LineElementComponent);
