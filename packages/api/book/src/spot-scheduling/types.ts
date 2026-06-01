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
  disabled?: boolean;
  page?: number;
  page_size?: number;
};

export type RoomBlueprintCreatePayload = {
  name: string;
  company: number;
  establishment: number;
};

export type SpotShape =
  | "circular"
  | "square"
  | "rectangle"
  | "triangle"
  | "personalized";

export type SpotCustomization = "predefined" | "personalized";

export type SpotType = {
  id: number;
  name: string;
  prefix: string | null;
  suffix: string | null;
  shape: SpotShape;
  // When "personalized", free_image/taken_image/selected_image hold the spot's
  // rendered art and override `shape`. Legacy parity: a circular shape with
  // customization "personalized" must render the image, not a circle.
  customization: SpotCustomization;
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
  /** Beautifier-authored override. Legacy convention: `height` is the
   *  dominant dimension for non-rectangle shapes — square side, triangle
   *  side, circular diameter. */
  height?: number;
  /** Beautifier-authored width — primarily used for rectangle and
   *  personalized image spots. */
  width?: number;
  /** Used only when authored explicitly; legacy wire format prefers
   *  `height` as the diameter. */
  radius?: number;
  /** Per-spot body styling authored via the Beautifier. */
  fill?: string;
  stroke?: string;
  strokeWidth?: number | string;
  strokeDasharray?: string;
  /** Per-spot label styling authored via the Beautifier. */
  fontSize?: number | string;
  fontStyle?: string;
  fontWeight?: number | string;
  fontColor?: string;
  fontColorOnTaken?: string;
  fontColorOnSelected?: string;
  textOffsetX?: number;
  textOffsetY?: number;
  textStroke?: string;
  textStrokeWidth?: number | string;
};

export type CanvasTeacherData = {
  x: number;
  y: number;
  rotation?: number;
  /** Per-element avatar size override, multiplied by `coachHeight`. */
  height?: number;
  fontSize?: number | string;
  fontStyle?: string;
  fontColor?: string;
  fontWeight?: number | string;
  textOffsetX?: number;
  textOffsetY?: number;
  textStroke?: string;
  textStrokeWidth?: number | string;
};

export type CanvasScreenData = {
  x: number;
  y: number;
  /** Optional in the legacy wire format — the screen tool ships only
   *  position + colours, not size. */
  width?: number;
  height?: number;
  rotation?: number;
  stroke?: string;
  fill?: string;
  strokeWidth?: number | string;
  strokeLinecap?: "butt" | "round" | "square";
};

export type CanvasDoorData = {
  x: number;
  y: number;
  rotation?: number;
  stroke?: string;
  fill?: string;
  strokeWidth?: number | string;
  strokeLinecap?: "butt" | "round" | "square";
};

export type CanvasLineData = {
  /** Wire format from the legacy "wall" tool — an arbitrary polyline as a
   *  sequence of `[x, y]` pairs. */
  points: number[][];
  stroke?: string;
  fill?: string;
  strokeWidth?: number | string;
  strokeLinecap?: "butt" | "round" | "square";
  strokeDasharray?: string;
};

export type CanvasRectData = {
  x: number;
  y: number;
  width: number;
  height: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number | string;
  strokeDasharray?: string;
  rotation?: number;
  /** Optional pattern image — used by the saas-legacy "image rect" tool to
   *  drop a bitmap onto the canvas. */
  image?: string;
};
