import type {
  AssetForBlueprint,
  CanvasSpotData,
  RoomBlueprint,
  SpotType,
} from "@bsport/api-book";

import {
  rectElement,
  spotElement,
  teacherElement,
} from "#src/components/spot-selector/__fixtures__/canvas-elements";

// Verbatim production data — company 2443, establishment 8706 ("Studio
// Beaubourg"), blueprint 922. Captures the archetypal blueprint shape that
// drives most field issues:
//  - Background floor-plan as an "unbound asset" rect with embedded image URL
//  - Two SpotType groups in one blueprint (bench-shaped + circle-shaped)
//  - Personalized image art per state on every SpotType
//  - Wire-format quirks: numeric-looking strings (strokeWidth: "1"),
//    fontColorOnSelected: "transparent" (label vanishes on selection)

export const STUDIO_BEAUBOURG_BLUEPRINT_ID = 922;

const BENCH_TYPE_ID = 245;
const SPOT_TYPE_ID = 251;

const benchType: SpotType = {
  id: BENCH_TYPE_ID,
  name: "Bench",
  prefix: "B",
  suffix: "",
  shape: "circular",
  customization: "personalized",
  fill_color: "",
  stroke_color: "black",
  // SpotType.shape says "circular" but the personalized images are
  // rectangular — the image wins over the shape (asset-resolution.ts).
  free_image:
    "https://assets.production.bsport.io/spot_for_blueprint/available_spot_-_rectangle.png",
  taken_image:
    "https://assets.production.bsport.io/spot_for_blueprint/unavailable_spot_-_rectangle.png",
  selected_image:
    "https://assets.production.bsport.io/spot_for_blueprint/my_spot_-_rectangle.png",
};

const spotType: SpotType = {
  id: SPOT_TYPE_ID,
  name: "Spot",
  prefix: "S",
  suffix: "",
  shape: "circular",
  customization: "personalized",
  fill_color: "",
  stroke_color: "black",
  free_image:
    "https://assets.production.bsport.io/spot_for_blueprint/available_spot_-_circle_nCz7b19.png",
  taken_image:
    "https://assets.production.bsport.io/spot_for_blueprint/unavailable_spot_-_circle_1W7OuNU.png",
  selected_image:
    "https://assets.production.bsport.io/spot_for_blueprint/my_spot_-_circle_XgzK9B7.png",
};

// Unused by the canvas (no spotTypeId references it) but present in the API
// response. Included to verify the renderer tolerates unreferenced spot types.
const spotTypeUnused: SpotType = {
  ...spotType,
  id: 242,
  free_image:
    "https://assets.production.bsport.io/spot_for_blueprint/available_spot_-_circle.png",
  taken_image:
    "https://assets.production.bsport.io/spot_for_blueprint/unavailable_spot_-_circle.png",
  selected_image:
    "https://assets.production.bsport.io/spot_for_blueprint/my_spot_-_circle.png",
};

export const studioBeaubourgSpotTypes: SpotType[] = [
  benchType,
  spotType,
  spotTypeUnused,
];

export const studioBeaubourgAssets: AssetForBlueprint[] = [
  {
    id: 78,
    identifier: "21ca39ed-4e18-44bd-9a49-0e89683ecc98",
    asset:
      "https://assets.production.bsport.io/video/BG_MAPPING_LECERCLE_QUINCAMPOIX.png",
    blueprint: STUDIO_BEAUBOURG_BLUEPRINT_ID,
    is_unbound: true,
  },
];

// Beautifier-authored styling shared across all bench/circle spots.
const benchStyling: Partial<CanvasSpotData> = {
  width: 75,
  height: 150,
  fontSize: 30,
  fontStyle: "normal",
  fontWeight: 900,
  strokeWidth: "1",
  textOffsetX: -35,
  textOffsetY: 40,
  textStroke: "#ffffff",
  textStrokeWidth: 0,
  fontColorOnTaken: "#ffffff",
  fontColorOnSelected: "transparent",
};

const circleStyling: Partial<CanvasSpotData> = {
  width: 90,
  height: 90,
  fontSize: 30,
  fontStyle: "normal",
  fontWeight: 900,
  strokeWidth: "1",
  textStroke: "#ffffff",
  textStrokeWidth: 0,
  fontColorOnTaken: "#ffffff",
  fontColorOnSelected: "transparent",
};

// [index, x, y, indexType]
type Pos = [number, number, number, number];

const benchPositions: Pos[] = [
  [1, 79, 76, 1],
  [2, 261, 75, 2],
  [3, 456, 79, 3],
  [4, 162, 246, 4],
  [5, 361, 250, 5],
  [6, 564, 249, 6],
  [7, 77, 435, 7],
  [8, 262, 433, 8],
  [9, 460, 437, 9],
  [10, 656, 434, 10],
  [11, 169, 616, 11],
  [12, 371, 618, 12],
  [13, 566, 616, 13],
  [14, 765, 616, 14],
  [15, 82, 814, 15],
  [16, 266, 815, 16],
  [17, 471, 812, 17],
  [18, 667, 810, 18],
  [19, 169, 1000, 19],
  [20, 373, 996, 20],
  [21, 575, 1000, 21],
  [22, 772, 998, 22],
  [23, 88, 1185, 23],
  [24, 269, 1190, 24],
  [25, 469, 1191, 25],
  [26, 667, 1190, 26],
  [27, 846, 1193, 27],
  [28, 1003, 1189, 28],
];

const circlePositions: Pos[] = [
  [29, 1440, 80, 1],
  [30, 1785, 80, 2],
  [31, 1290, 185, 3],
  [32, 1610, 190, 4],
  [33, 1130, 285, 5],
  [34, 1435, 280, 6],
  [35, 1778, 289, 7],
  [36, 1285, 375, 8],
  [37, 1610, 375, 9],
  [38, 1940, 385, 10],
  [39, 1130, 480, 11],
  [40, 1440, 475, 12],
  [41, 1780, 480, 13],
  [42, 1285, 580, 14],
  [43, 1610, 580, 15],
  [44, 1140, 680, 16],
  [45, 1440, 685, 17],
  [46, 1775, 685, 18],
  [47, 1280, 785, 19],
  [48, 1610, 785, 20],
  [49, 1935, 785, 21],
  [50, 1140, 880, 22],
  [51, 1440, 870, 23],
  [52, 1780, 875, 24],
  [53, 1295, 975, 25],
  [54, 1620, 980, 26],
  [55, 1940, 980, 27],
  [56, 1790, 1045, 28],
];

const benchSpots = benchPositions.map(([index, x, y, indexType]) =>
  spotElement(index, x, y, BENCH_TYPE_ID, null, {
    indexType,
    ...benchStyling,
  }),
);

const circleSpots = circlePositions.map(([index, x, y, indexType]) =>
  spotElement(index, x, y, SPOT_TYPE_ID, null, {
    indexType,
    ...circleStyling,
  }),
);

export const studioBeaubourgBlueprint: RoomBlueprint = {
  id: STUDIO_BEAUBOURG_BLUEPRINT_ID,
  company: 2443,
  establishment: 8706,
  name: "Studio Beaubourg",
  disabled: false,
  canvas: {
    // Wire format ships `coachHeight: "2"` (string). The renderer reads it as
    // a number; cast at the fixture boundary so the type stays clean.
    coachHeight: 2,
    elements: [
      // Unbound-asset background: floor plan PNG (2096×1425). The wire `id`
      // prefix marks this as a bitmap drop ("unbound-asset-<uuid>") whose
      // identifier matches an AssetForBlueprint record; the data already
      // carries the resolved image URL inline, so rendering doesn't depend
      // on the asset map for this case.
      rectElement(
        "unbound-asset-21ca39ed-4e18-44bd-9a49-0e89683ecc98",
        0,
        0,
        2096,
        1425,
        {
          strokeWidth: "2",
          rotation: 0,
          image:
            "https://d2r95z4j5cc9cx.cloudfront.net/video/BG_MAPPING_LECERCLE_QUINCAMPOIX.png",
        },
      ),
      teacherElement("teacher-1711636304803", 885, 125, { rotation: 0 }),
      ...benchSpots,
      ...circleSpots,
    ],
  },
};
