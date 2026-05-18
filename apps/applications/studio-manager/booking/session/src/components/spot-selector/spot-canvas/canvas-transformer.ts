import type {
  CanvasDoorData,
  CanvasElement,
  CanvasLineData,
  CanvasRectData,
  CanvasScreenData,
  CanvasSpotData,
  CanvasTeacherData,
  RoomBlueprint,
} from "@bsport/api-book";

export const isSpotElement = (
  el: CanvasElement<unknown>,
): el is CanvasElement<CanvasSpotData> => el.type === "spot";

export const isTeacherElement = (
  el: CanvasElement<unknown>,
): el is CanvasElement<CanvasTeacherData> => el.type === "teacher";

export const isScreenElement = (
  el: CanvasElement<unknown>,
): el is CanvasElement<CanvasScreenData> => el.type === "screen";

export const isDoorElement = (
  el: CanvasElement<unknown>,
): el is CanvasElement<CanvasDoorData> => el.type === "door";

export const isLineElement = (
  el: CanvasElement<unknown>,
): el is CanvasElement<CanvasLineData> => el.type === "line";

export const isRectElement = (
  el: CanvasElement<unknown>,
): el is CanvasElement<CanvasRectData> => el.type === "rect";

export type ApplyTakenStateParams = {
  roomBlueprint: RoomBlueprint;
  takenSpots: number[];
};

/**
 * Returns elements with `data.taken` set per `takenSpots`. Selection is
 * intentionally NOT applied here so `<SpotElement>` can receive `selected` as
 * a primitive prop and stay memo-stable across selection changes.
 *
 * Asset overlay (the "spot_taken" swap for taken personalized spots) is
 * handled centrally in `resolveSpotAssetUrl`, so this function no longer
 * mutates `asset_identifier`.
 */
export const applyTakenState = ({
  roomBlueprint,
  takenSpots,
}: ApplyTakenStateParams): CanvasElement<unknown>[] => {
  const source = roomBlueprint.canvas.elements ?? [];
  const takenSet = new Set(takenSpots);
  let changed = false;

  const next = source.map((el) => {
    if (!isSpotElement(el)) return el;

    const isTaken = takenSet.has(el.data.index);
    if (el.data.taken === isTaken) return el;

    changed = true;
    const data: CanvasSpotData = { ...el.data, taken: isTaken };
    return { ...el, data };
  });

  return changed ? next : source;
};

/**
 * Builds the SVG `transform` string used by every element renderer.
 *
 * Legacy parity (saas-legacy `CanvasSpot.getTransform` /
 * `getTransformRectangle` / `getTransformTriangle` / `CanvasDoor.getTransform`
 * etc.): rotation pivots around the element's CENTRE in the post-translate
 * frame, not the top-left. Callers pass `cx` / `cy` as the half-dimensions
 * of the body they're about to draw — image-bearing spots use authored
 * width/height, triangles add the +13 baseline offset that legacy applies.
 *
 * Elements whose body is already centred on the local origin (door, screen,
 * teacher with its quarter-inset translation) leave `cx`/`cy` at the default
 * `0` so the rotation pivots around the origin, which is their centre.
 */
export const translateRotate = ({
  x,
  y,
  rotation,
  cx = 0,
  cy = 0,
}: {
  x: number;
  y: number;
  rotation?: number;
  cx?: number;
  cy?: number;
}): string =>
  `translate(${x} ${y})${rotation ? ` rotate(${rotation} ${cx} ${cy})` : ""}`;
