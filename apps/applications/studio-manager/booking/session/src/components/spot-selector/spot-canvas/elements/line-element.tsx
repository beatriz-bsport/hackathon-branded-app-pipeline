import React from "react";

import type { CanvasElement, CanvasLineData } from "@bsport/api-book";

import { DEFAULT_DECORATIVE_STROKE } from "../spot-styles";

export type LineElementProps = { element: CanvasElement<CanvasLineData> };

const pointsToSvgString = (points: number[][]): string =>
  points.map(([x, y]) => `${x},${y}`).join(" ");

const LineElementComponent: React.FC<LineElementProps> = ({ element }) => {
  const { points, stroke, fill, strokeWidth, strokeLinecap, strokeDasharray } =
    element.data;

  if (!points || points.length < 2) return null;

  return (
    <polyline
      points={pointsToSvgString(points)}
      stroke={stroke ?? DEFAULT_DECORATIVE_STROKE}
      fill={fill ?? "transparent"}
      strokeWidth={strokeWidth ?? 1.5}
      strokeLinecap={strokeLinecap}
      strokeDasharray={strokeDasharray}
    />
  );
};

export const LineElement = React.memo(LineElementComponent);
