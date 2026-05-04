export type CanvasSelectableToolsEnum =
  | "eraser"
  | "line"
  | "rect"
  | "spot"
  | "pointer"
  | "hand"
  | "rotation"
  | "teacher"
  | "screen"
  | "door"
  | "spot_selector"
  | "resizer"
  | "beautifier"
  | "copier"
  | "preferential_bsport_spot_tool";

export type CanvasElement<D> = {
  type: CanvasSelectableToolsEnum;
  data: D;
  id: string;
  coachHeight?: number;
};

export type RoomBlueprint = {
  id: number;
  disabled: boolean;
  name: string;
  company: number;
  establishment: number;
  canvas: {
    coachHeight: number;
    elements: CanvasElement<unknown>[];
  };
  spivi_box_id?: number;
};

export type RoomBlueprintFilters = {
  establishment?: number;
  establishment__in?: number[];
};

export type SpotShape =
  | "circular"
  | "square"
  | "rectangle"
  | "triangle"
  | "personalized";

export type SpotType = {
  id: number;
  name: string;
  prefix: string | null;
  suffix: string | null;
  shape: SpotShape;
  fill_color: string | null;
  stroke_color: string | null;
  free_image: string | null;
  taken_image: string | null;
  selected_image: string | null;
};

export type AssetForBlueprint = {
  id: number;
  identifier: string;
  asset: string;
  blueprint: number;
  is_unbound: boolean;
};

export type SpotTypesFilters = {
  blueprint?: number;
  page_size?: number;
};

export type AssetsForBlueprintFilters = {
  blueprint: number;
  page_size?: number;
};

export type CanvasSpotData = {
  index: number;
  /** Label component: numeric when the spot uses a sequential number, string when the author set a custom label such as "A1". */
  indexType: string | number;
  spotTypeId: number;
  taken: boolean;
  selected: boolean;
  /** Snake_case matches the canvas JSON wire format stored on RoomBlueprint; do not rename. */
  asset_identifier: string | null;
  x: number;
  y: number;
  rotation?: number;
  width?: number;
  height?: number;
  radius?: number;
};

export type CanvasTeacherData = {
  x: number;
  y: number;
  rotation?: number;
};

export type CanvasScreenData = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
};

export type CanvasDoorData = {
  x: number;
  y: number;
  rotation?: number;
};

export type CanvasLineData = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke?: string;
};

export type CanvasRectData = {
  x: number;
  y: number;
  width: number;
  height: number;
  fill?: string;
  stroke?: string;
  rotation?: number;
};
