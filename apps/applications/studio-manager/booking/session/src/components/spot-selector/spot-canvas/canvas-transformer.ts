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
 * Returns elements with `data.taken` set per `takenSpots` and asset_identifier
 * swapped to "spot_taken" for taken personalized spots (legacy parity — see
 * `canvas-transformer.test.ts`). Selection is intentionally NOT applied here
 * so `<SpotElement>` can receive `selected` as a primitive prop and stay
 * memo-stable across selection changes.
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
    if (isTaken && data.asset_identifier) {
      data.asset_identifier = "spot_taken";
    }
    return { ...el, data };
  });

  return changed ? next : source;
};

export const translateRotate = ({
  x,
  y,
  rotation,
}: {
  x: number;
  y: number;
  rotation?: number;
}): string => `translate(${x} ${y})${rotation ? ` rotate(${rotation})` : ""}`;
