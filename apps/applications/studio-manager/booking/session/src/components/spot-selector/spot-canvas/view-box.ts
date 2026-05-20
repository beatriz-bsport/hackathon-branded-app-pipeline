import type { CanvasElement } from "@bsport/api-book";

import {
  isDoorElement,
  isLineElement,
  isRectElement,
  isScreenElement,
  isSpotElement,
  isTeacherElement,
} from "./canvas-transformer";
import { COACH_AVATAR_BASE_SIZE } from "./elements/teacher-dimensions";

export const VIEWBOX_PADDING = 50;
export const FALLBACK_VIEWBOX = "-100 -100 200 200";
// Spot fallback when a shape carries no width/height/radius — matches the
// renderer's largest default (square / personalized image).
const DEFAULT_SPOT_EXTENT = 40;
// DoorElement renders an architectural door symbol (slab + swing arc)
// spanning ±DOOR_HALF in both axes around the authored (x, y).
const DOOR_HALF = 17.5;
// Mirrors ScreenElement defaults — see elements/screen-element.tsx.
const SCREEN_DEFAULT_WIDTH = 100;
const SCREEN_DEFAULT_HEIGHT = 15;

export type Bounds = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

/**
 * Bounds for an element whose authored `(x, y)` is its **top-left** corner
 * (saas-legacy CanvasSpot / CanvasRect parity). Non-zero rotations use the
 * bounding circle of the unrotated rect — always correct, mildly conservative.
 * The 50px viewBox padding absorbs the slack.
 */
const topLeftBounds = (
  x: number,
  y: number,
  w: number,
  h: number,
  rotation: number | undefined,
): Bounds => {
  if (rotation && rotation !== 0) {
    const cx = x + w / 2;
    const cy = y + h / 2;
    const r = Math.sqrt(w * w + h * h) / 2;
    return { minX: cx - r, minY: cy - r, maxX: cx + r, maxY: cy + r };
  }
  return { minX: x, minY: y, maxX: x + w, maxY: y + h };
};

export const elementBounds = (
  el: CanvasElement<unknown>,
  coachHeight: number,
): Bounds | null => {
  if (isLineElement(el)) {
    // Walls/lines are polylines on the wire; sum the extent across every
    // authored point so long multi-segment runs stay inside the viewBox.
    const { points } = el.data;
    if (!points || points.length === 0) return null;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const [x, y] of points) {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
    return { minX, minY, maxX, maxY };
  }
  if (isSpotElement(el)) {
    // Legacy parity (saas-legacy spots): `data.height` is the dominant
    // dimension for non-rectangle shapes — square side, triangle side,
    // circular diameter. `width` is only meaningful for rectangles. The
    // viewBox sums the largest plausible footprint so authored sizes don't
    // get clipped on initial layout.
    const { x, y, width, height, radius, rotation } = el.data;
    const fromHeight =
      height ?? (radius != null ? radius * 2 : DEFAULT_SPOT_EXTENT);
    const w = width ?? fromHeight;
    return topLeftBounds(x, y, w, fromHeight, rotation);
  }
  if (isTeacherElement(el)) {
    // Legacy parity (saas-legacy CanvasTeacher.component): the avatar's
    // top-left lands at `(x - avatarSize/4, y - avatarSize/4)`; the avatar
    // spans `avatarSize` in each axis from there. `coachHeight` is a scale
    // factor, not a pixel size.
    const size = (el.data.height ?? COACH_AVATAR_BASE_SIZE) * coachHeight;
    const tlX = el.data.x - size / 4;
    const tlY = el.data.y - size / 4;
    return topLeftBounds(tlX, tlY, size, size, el.data.rotation);
  }
  if (isScreenElement(el)) {
    // ScreenElement renders the polyline symmetrically around (x, y) — not
    // top-left like spots/rects (diverges from saas-legacy CanvasScreen,
    // which uses a 130×65 top-left frame with the polyline inset). Mirror
    // our renderer's centred convention here so the bounds stay accurate.
    const w = el.data.width ?? SCREEN_DEFAULT_WIDTH;
    const h = el.data.height ?? SCREEN_DEFAULT_HEIGHT;
    return topLeftBounds(
      el.data.x - w / 2,
      el.data.y - h / 2,
      w,
      h,
      el.data.rotation,
    );
  }
  if (isRectElement(el)) {
    return topLeftBounds(
      el.data.x,
      el.data.y,
      el.data.width,
      el.data.height,
      el.data.rotation,
    );
  }
  if (isDoorElement(el)) {
    // Door symbol is drawn symmetrically around the authored (x, y) — that
    // anchor predates the top-left convention used by spots/rects. Keep the
    // centred bounds so the swing arc stays inside the viewBox.
    const cx = el.data.x;
    const cy = el.data.y;
    return topLeftBounds(
      cx - DOOR_HALF,
      cy - DOOR_HALF,
      DOOR_HALF * 2,
      DOOR_HALF * 2,
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
