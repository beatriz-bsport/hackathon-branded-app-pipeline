import type {
  CanvasDoorData,
  CanvasElement,
  CanvasLineData,
  CanvasRectData,
  CanvasScreenData,
  CanvasSpotData,
  CanvasTeacherData,
  SpotType,
} from "@bsport/api-book";

export const baseSpotType: SpotType = {
  id: 1,
  name: "Standard",
  prefix: "A",
  suffix: null,
  shape: "circular",
  customization: "predefined",
  fill_color: null,
  stroke_color: null,
  free_image: null,
  taken_image: null,
  selected_image: null,
};

export const spotElement = (
  index: number,
  x: number,
  y: number,
  spotTypeId = 1,
  asset_identifier: string | null = null,
  extra: Partial<CanvasSpotData> = {},
): CanvasElement<CanvasSpotData> => ({
  id: `s-${index}`,
  type: "spot",
  data: {
    index,
    indexType: index,
    spotTypeId,
    taken: false,
    selected: false,
    asset_identifier,
    x,
    y,
    ...extra,
  },
});

export const lineElement = (
  id: string,
  points: number[][],
  extra: Partial<CanvasLineData> = {},
): CanvasElement<CanvasLineData> => ({
  id,
  type: "line",
  data: { points, ...extra },
});

export const screenElement = (
  id: string,
  x: number,
  y: number,
  width?: number,
  height?: number,
  extra: Partial<CanvasScreenData> = {},
): CanvasElement<CanvasScreenData> => ({
  id,
  type: "screen",
  data: {
    x,
    y,
    ...(width != null ? { width } : {}),
    ...(height != null ? { height } : {}),
    ...extra,
  },
});

export const rectElement = (
  id: string,
  x: number,
  y: number,
  width: number,
  height: number,
  extra: Partial<CanvasRectData> = {},
): CanvasElement<CanvasRectData> => ({
  id,
  type: "rect",
  data: { x, y, width, height, ...extra },
});

export const doorElement = (
  id: string,
  x: number,
  y: number,
  extra: Partial<CanvasDoorData> = {},
): CanvasElement<CanvasDoorData> => ({
  id,
  type: "door",
  data: { x, y, ...extra },
});

export const teacherElement = (
  id: string,
  x: number,
  y: number,
  extra: Partial<CanvasTeacherData> = {},
): CanvasElement<CanvasTeacherData> => ({
  id,
  type: "teacher",
  data: { x, y, ...extra },
});
