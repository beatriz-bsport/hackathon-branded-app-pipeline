import type { CanvasElement } from "@bsport/api-book";

import {
  isDoorElement,
  isLineElement,
  isRectElement,
  isScreenElement,
  isSpotElement,
  isTeacherElement,
} from "./canvas-transformer";

export const VIEWBOX_PADDING = 50;
export const FALLBACK_VIEWBOX = "-100 -100 200 200";
// Spot fallback when a shape carries no width/height/radius — matches the
// renderer's largest default (square / personalized image).
const DEFAULT_SPOT_EXTENT = 40;
// DoorElement renders a hardcoded path spanning ±10 × ±5 around its centre.
const DOOR_HALF_WIDTH = 10;
const DOOR_HALF_HEIGHT = 5;

export type Bounds = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

const centredBounds = (
  x: number,
  y: number,
  w: number,
  h: number,
  rotation: number | undefined,
): Bounds => {
  // For any non-zero rotation, use the bounding circle of the unrotated rect
  // (radius = half-diagonal). Always correct, mildly conservative — the 50px
  // viewBox padding absorbs the slack.
  const halfW = w / 2;
  const halfH = h / 2;
  if (rotation && rotation !== 0) {
    const r = Math.sqrt(halfW * halfW + halfH * halfH);
    return { minX: x - r, minY: y - r, maxX: x + r, maxY: y + r };
  }
  return { minX: x - halfW, minY: y - halfH, maxX: x + halfW, maxY: y + halfH };
};

export const elementBounds = (
  el: CanvasElement<unknown>,
  coachHeight: number,
): Bounds | null => {
  if (isLineElement(el)) {
    const { x1, y1, x2, y2 } = el.data;
    return {
      minX: Math.min(x1, x2),
      minY: Math.min(y1, y2),
      maxX: Math.max(x1, x2),
      maxY: Math.max(y1, y2),
    };
  }
  if (isSpotElement(el)) {
    const { x, y, width, height, radius, rotation } = el.data;
    const w = width ?? (radius != null ? radius * 2 : DEFAULT_SPOT_EXTENT);
    const h = height ?? (radius != null ? radius * 2 : DEFAULT_SPOT_EXTENT);
    return centredBounds(x, y, w, h, rotation);
  }
  if (isTeacherElement(el)) {
    return centredBounds(
      el.data.x,
      el.data.y,
      coachHeight,
      coachHeight,
      el.data.rotation,
    );
  }
  if (isScreenElement(el) || isRectElement(el)) {
    return centredBounds(
      el.data.x,
      el.data.y,
      el.data.width,
      el.data.height,
      el.data.rotation,
    );
  }
  if (isDoorElement(el)) {
    return centredBounds(
      el.data.x,
      el.data.y,
      DOOR_HALF_WIDTH * 2,
      DOOR_HALF_HEIGHT * 2,
      el.data.rotation,
    );
  }
  return null;
};

export const computeViewBox = (
  elements: CanvasElement<unknown>[],
  coachHeight: number,
): string => {
  const extents = elements.reduce<Bounds>(
    (acc, el) => {
      const b = elementBounds(el, coachHeight);
      if (b) {
        acc.minX = Math.min(acc.minX, b.minX);
        acc.minY = Math.min(acc.minY, b.minY);
        acc.maxX = Math.max(acc.maxX, b.maxX);
        acc.maxY = Math.max(acc.maxY, b.maxY);
      }
      return acc;
    },
    { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity },
  );

  if (!Number.isFinite(extents.minX)) return FALLBACK_VIEWBOX;

  const w = extents.maxX - extents.minX + VIEWBOX_PADDING * 2;
  const h = extents.maxY - extents.minY + VIEWBOX_PADDING * 2;
  return `${extents.minX - VIEWBOX_PADDING} ${extents.minY - VIEWBOX_PADDING} ${w} ${h}`;
};
