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
