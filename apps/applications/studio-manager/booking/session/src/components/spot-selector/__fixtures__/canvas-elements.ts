import type {
  CanvasElement,
  CanvasLineData,
  CanvasScreenData,
  CanvasSpotData,
  SpotType,
} from "@bsport/api-book";

export const baseSpotType: SpotType = {
  id: 1,
  name: "Standard",
  prefix: "A",
  suffix: null,
  shape: "circular",
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
  },
});

export const lineElement = (
  id: string,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): CanvasElement<CanvasLineData> => ({
  id,
  type: "line",
  data: { x1, y1, x2, y2 },
});

export const screenElement = (
  id: string,
  x: number,
  y: number,
  width: number,
  height: number,
): CanvasElement<CanvasScreenData> => ({
  id,
  type: "screen",
  data: { x, y, width, height },
});
