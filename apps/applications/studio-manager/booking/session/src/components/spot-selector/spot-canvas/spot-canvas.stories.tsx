import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import type React from "react";

import type {
  AssetForBlueprint,
  RoomBlueprint,
  SpotType,
} from "@bsport/api-book";

import {
  baseSpotType,
  doorElement,
  lineElement,
  rectElement,
  screenElement,
  spotElement,
  teacherElement,
} from "#src/components/spot-selector/__fixtures__/canvas-elements";
import coachPhoto from "#src/components/spot-selector/assets/coach.jpeg";
import spinBikeAvailable from "#src/components/spot-selector/assets/spin-bike-available.jpg";
import spinBikeSelected from "#src/components/spot-selector/assets/spin-bike-selected.jpg";
import spinBikeTaken from "#src/components/spot-selector/assets/spin-bike-taken.jpeg";
import { SpotCanvas } from "#src/components/spot-selector/spot-canvas/spot-canvas";

const assets: AssetForBlueprint[] = [];

const fourStateRow: RoomBlueprint = {
  id: 1,
  disabled: false,
  name: "States",
  company: 1,
  establishment: 1,
  canvas: {
    coachHeight: 1,
    elements: [
      spotElement(1, -90, 0),
      spotElement(2, -30, 0),
      spotElement(3, 30, 0),
      spotElement(4, 90, 0),
    ],
  },
};

const FOUR_STATE_FRAME = { width: 420, height: 160 } as const;

const fourStateDecorator: Decorator = (Story) => (
  <div style={FOUR_STATE_FRAME}>
    <Story />
  </div>
);

const fourStateArgs = {
  roomBlueprint: fourStateRow,
  assets,
  spotTypes: [{ ...baseSpotType, prefix: null }],
  takenSpots: [2],
  selectedSpot: 3,
  currentSpot: 4,
};

const meta: Meta<typeof SpotCanvas> = {
  title: "SpotCanvas",
  component: SpotCanvas,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "The floor plan of a studio room, drawn as a small diagram by the studio manager",
          "",
          'A **spot** is a specific position in the room that a customer can book — a particular bike in a spinning class, a reformer in a Pilates studio, a mat space in yoga. This feature is only used by establishments that let their customers choose exactly where they want to be when they book a class, instead of just "signing up".',
          "",
          "`SpotCanvas` is the **core renderer**. The *same* canvas — same component, same data — appears in both of the places the floor plan shows up on the session management page (`/calendar/:sessionId`):",
          "",
          "- **`SpotSelectorModal`** wraps the canvas (plus the legend) in a modal and passes a click handler in. That click handler is what makes the canvas **editable** — each free spot becomes a clickable button, so the staff member can assign or move a student's spot.",
          "- **`FloorPlanBlock`** wraps the canvas (plus the same legend) inline in the session panel's floor-plan accordion, with **no** click handler. The canvas renders in read-only mode and the manager just sees the room and which spots are filled.",
          "",
          "The stories below each isolate one piece of how the canvas behaves: the four states a spot can be in (free / taken / selected / current spot), the different shapes a spot can take (circle, square, rectangle, custom photo of a bike), and the other room elements that go around the spots (coach, screen, walls, doors, decorative furniture).",
        ].join("\n"),
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof SpotCanvas>;

/**
 * The four states a single spot can be in, reading left to right:
 *
 * 1. **Free** — available, the manager can click to assign a student to it.
 * 2. **Taken** — already booked by another student.
 * 3. **Selected** — the manager has just clicked it but hasn't confirmed the assignment yet.
 * 4. **Current spot** — the student's existing booking (e.g. the manager is moving them from this spot to another one).
 *
 * Use Storybook's Controls panel to clear `onSelectSpot` to see the read-only
 * variant — the one used in the floor-plan preview on the session management
 * page. With no click handler, each spot renders as an image instead of a
 * button.
 */
export const States: Story = {
  decorators: [fourStateDecorator],
  args: {
    ...fourStateArgs,
    onSelectSpot: (i) => console.log("selected", i),
  },
};

const BIKE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#1F4F4D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>`;
const BIKE_ASSET = `data:image/svg+xml;base64,${btoa(BIKE_SVG)}`;

// Production blueprints supply a dedicated "spot_taken" overlay; reusing the
// bike here keeps the demo focused on the state styling, not asset substitution.
const IMAGE_ASSETS: AssetForBlueprint[] = [
  {
    id: 1,
    identifier: "bike",
    asset: BIKE_ASSET,
    blueprint: 1,
    is_unbound: false,
  },
  {
    id: 2,
    identifier: "spot_taken",
    asset: BIKE_ASSET,
    blueprint: 1,
    is_unbound: false,
  },
];

type ShapeRowConfig = {
  shape: SpotType["shape"];
  label: string;
  assetIdentifier?: string;
};

const SHAPES: ReadonlyArray<ShapeRowConfig> = [
  { shape: "circular", label: "Circular" },
  { shape: "square", label: "Square" },
  { shape: "rectangle", label: "Rectangle" },
  { shape: "triangle", label: "Triangle" },
  { shape: "personalized", label: "Personalized (no asset)" },
  {
    shape: "personalized",
    label: "Personalized (image asset)",
    assetIdentifier: "bike",
  },
];

const shapeStateBlueprint = (assetIdentifier?: string): RoomBlueprint => ({
  id: 1,
  disabled: false,
  name: "ShapeStates",
  company: 1,
  establishment: 1,
  canvas: {
    coachHeight: 1,
    elements: [
      spotElement(1, -90, 0, 1, assetIdentifier ?? null),
      spotElement(2, -30, 0, 1, assetIdentifier ?? null),
      spotElement(3, 30, 0, 1, assetIdentifier ?? null),
      spotElement(4, 90, 0, 1, assetIdentifier ?? null),
    ],
  },
});

const COLUMN_HEADERS = ["Free", "Taken", "Selected", "Current spot"];

/**
 * A spot doesn't have to be a circle — the studio can shape it however makes
 * sense for the activity. A spinning bike is usually a circle, a reformer is
 * drawn as a rectangle, a yoga mat fits well as a square. The bottom rows
 * show **personalized** spots, where the studio uploads its own icon or photo
 * for the spot (or leaves it as a numbered placeholder).
 *
 * Each column shows the same four states (free → taken → selected → current),
 * so you can verify the shape still reads correctly in every state.
 */
export const ShapeStates: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "180px 1fr",
        gap: "12px",
        alignItems: "center",
        width: 640,
      }}
    >
      <div />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          textAlign: "center",
          fontSize: 12,
          color: "var(--kz-color-onsurface-weak)",
        }}
      >
        {COLUMN_HEADERS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      {SHAPES.map((row) => (
        <ShapeRow
          key={`${row.shape}-${row.assetIdentifier ?? "vector"}`}
          shape={row.shape}
          label={row.label}
          assetIdentifier={row.assetIdentifier}
        />
      ))}
    </div>
  ),
};

const ShapeRow: React.FC<ShapeRowConfig> = ({
  shape,
  label,
  assetIdentifier,
}) => (
  <>
    <div style={{ fontSize: 13, fontWeight: 600 }}>{label}</div>
    <div style={{ height: 90 }}>
      <SpotCanvas
        roomBlueprint={shapeStateBlueprint(assetIdentifier)}
        assets={assetIdentifier ? IMAGE_ASSETS : assets}
        spotTypes={[{ ...baseSpotType, prefix: null, shape }]}
        takenSpots={[2]}
        selectedSpot={3}
        currentSpot={4}
      />
    </div>
  </>
);

// Production parity: many blueprints return SpotTypes with `shape: "circular"`
// + `customization: "personalized"` and free/taken/selected_image URLs on the
// SpotType itself (the older image system — separate from AssetForBlueprint).
// Without this fixture the renderer used to fall back to plain circles for
// real production data (see room-blueprint 8218 / spot-type 23 "Cycle").
//
// Three distinct indoor-cycle photos — one per state — so the story makes the
// free/taken/selected wiring visually unambiguous in Storybook.
const SPOT_TYPE_FREE_IMAGE = spinBikeAvailable;
const SPOT_TYPE_TAKEN_IMAGE = spinBikeTaken;
const SPOT_TYPE_SELECTED_IMAGE = spinBikeSelected;

const personalizedSpotTypeRow: RoomBlueprint = {
  id: 2,
  disabled: false,
  name: "PersonalizedSpotType",
  company: 1,
  establishment: 1,
  canvas: {
    coachHeight: 1,
    elements: [
      spotElement(1, -90, 0),
      spotElement(2, -30, 0),
      spotElement(3, 30, 0),
      spotElement(4, 90, 0),
    ],
  },
};

const personalizedSpotType: SpotType = {
  ...baseSpotType,
  // Matches the production SpotType wire shape (e.g. spot-type 23 "Cycle"):
  // circular shape, but customization === "personalized" pulls the rendered
  // art from free_image / taken_image / selected_image on the SpotType.
  shape: "circular",
  customization: "personalized",
  prefix: null,
  free_image: SPOT_TYPE_FREE_IMAGE,
  taken_image: SPOT_TYPE_TAKEN_IMAGE,
  selected_image: SPOT_TYPE_SELECTED_IMAGE,
};

/**
 * Many studios upload their own photos for each spot — typically a real
 * picture of the spinning bike (or reformer, or rower) at that spot. The
 * studio uploads three photos per spot type: one for **free**, one for
 * **taken**, and one for **selected**, and the canvas picks the right photo
 * for whatever state each spot is in.
 *
 * This story shows that working with the legacy image system, where the
 * photos hang off the spot type itself. Most existing production studios
 * still use this format.
 */
export const PersonalizedSpotTypeImages: Story = {
  decorators: [fourStateDecorator],
  args: {
    roomBlueprint: personalizedSpotTypeRow,
    assets,
    spotTypes: [personalizedSpotType],
    takenSpots: [2],
    selectedSpot: 3,
    currentSpot: 4,
  },
};

// ---------------------------------------------------------------------------
// Door element parity — architectural symbol (slab + swing arc)
// ---------------------------------------------------------------------------

const doorsBlueprint: RoomBlueprint = {
  id: 10,
  disabled: false,
  name: "Doors",
  company: 1,
  establishment: 1,
  canvas: {
    coachHeight: 1,
    elements: [
      // Default door pointing right.
      doorElement("door-default", -80, 0),
      // Rotated 90° — door opening downwards.
      doorElement("door-rotated", 0, 0, { rotation: 90 }),
      // Coloured door with custom stroke width.
      doorElement("door-coloured", 80, 0, {
        stroke: "#0F766E",
        strokeWidth: 3,
      }),
    ],
  },
};

/**
 * When the studio places a door in the room blueprint, it shows up as a
 * proper architectural symbol — a wall slab with the quarter-circle swing arc
 * that indicates which way the door opens.
 *
 * The three doors below show what's customisable: a default door pointing
 * right, a door rotated 90° (opens downward), and a door with a thicker,
 * coloured stroke.
 */
export const DoorStyling: Story = {
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div style={{ width: 360, height: 200 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    roomBlueprint: doorsBlueprint,
    assets,
    spotTypes: [{ ...baseSpotType, prefix: null }],
    takenSpots: [],
  },
};

// ---------------------------------------------------------------------------
// Screen element parity — chalkboard polyline, not a filled rect
// ---------------------------------------------------------------------------

const screenBlueprint: RoomBlueprint = {
  id: 9,
  disabled: false,
  name: "Screens",
  company: 1,
  establishment: 1,
  canvas: {
    coachHeight: 1,
    elements: [
      // Default screen — no width supplied (matches legacy wire format).
      screenElement("screen-default", 0, -120),
      // Wider, custom stroke colour.
      screenElement("screen-coloured", 0, -50, 200, undefined, {
        stroke: "#1F4F4D",
        strokeWidth: 20,
      }),
    ],
  },
};

/**
 * A **screen** is the chalkboard, TV, or projection screen at the front of
 * the room — drawn as a thick horizontal line with rounded ends.
 *
 * Studios can change the colour and thickness. The legacy data format
 * doesn't ship a width or height for screens, so the canvas draws them as a
 * polyline rather than a filled rectangle.
 */
export const ScreenStyling: Story = {
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div style={{ width: 360, height: 280 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    roomBlueprint: screenBlueprint,
    assets,
    spotTypes: [{ ...baseSpotType, prefix: null }],
    takenSpots: [],
  },
};

// ---------------------------------------------------------------------------
// Rect element parity — stroke styling, dashing, image fill
// ---------------------------------------------------------------------------

// Inline pattern image so the story stays offline.
const RECT_IMAGE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 40"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#A78BFA"/><stop offset="1" stop-color="#22D3EE"/></linearGradient></defs><rect width="80" height="40" fill="url(#g)"/></svg>`;
const RECT_IMAGE_DATA_URL = `data:image/svg+xml;base64,${btoa(RECT_IMAGE_SVG)}`;

const rectsBlueprint: RoomBlueprint = {
  id: 8,
  disabled: false,
  name: "Rects",
  company: 1,
  establishment: 1,
  canvas: {
    coachHeight: 1,
    elements: [
      rectElement("plain", -120, -60, 80, 40, {
        fill: "transparent",
        stroke: "#1F2937",
        strokeWidth: 2,
      }),
      rectElement("dashed", 20, -60, 100, 40, {
        fill: "transparent",
        stroke: "#2563EB",
        strokeWidth: 2,
        strokeDasharray: "6 4",
      }),
      rectElement("filled", -120, 30, 80, 40, {
        fill: "#FEE2E2",
        stroke: "#DC2626",
        strokeWidth: 1.5,
      }),
      rectElement("image-fill", 30, 30, 100, 40, {
        image: RECT_IMAGE_DATA_URL,
      }),
    ],
  },
};

/**
 * Rectangles are used for everything in the room that isn't a spot, a wall,
 * or the coach — storage cupboards, mirrors, racks of weights, decorative
 * dividers. The studio can style each one independently: plain outline,
 * dashed outline, filled with a colour, or filled with an image they've
 * uploaded (a wood-floor pattern, a logo, etc.).
 */
export const RectStyling: Story = {
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div style={{ width: 480, height: 240 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    roomBlueprint: rectsBlueprint,
    assets,
    spotTypes: [{ ...baseSpotType, prefix: null }],
    takenSpots: [],
  },
};

// ---------------------------------------------------------------------------
// Line / wall element parity
// ---------------------------------------------------------------------------

const linesBlueprint: RoomBlueprint = {
  id: 7,
  disabled: false,
  name: "Lines",
  company: 1,
  establishment: 1,
  canvas: {
    coachHeight: 1,
    elements: [
      // Multi-segment wall, default stroke.
      lineElement("wall-default", [
        [-180, -80],
        [-60, -80],
        [-60, 40],
        [80, 40],
      ]),
      // Coloured wall with strokeWidth + linecap.
      lineElement(
        "wall-coloured",
        [
          [-180, 80],
          [80, 80],
        ],
        { stroke: "#1D4ED8", strokeWidth: 4, strokeLinecap: "round" },
      ),
      // Dashed line (e.g. divider).
      lineElement(
        "divider",
        [
          [120, -80],
          [120, 80],
        ],
        {
          stroke: "#D97706",
          strokeWidth: 3,
          strokeDasharray: "8 4",
        },
      ),
    ],
  },
};

/**
 * Walls and dividers in the room. A line can be a single straight segment or
 * a multi-segment shape that bends around corners — useful for a wall with a
 * step-back, an L-shaped partition, or a perimeter that follows the actual
 * shape of the studio.
 *
 * Colour, thickness, end-caps, and dashed-vs-solid styling are all editable
 * per line.
 */
export const LineStyling: Story = {
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div style={{ width: 480, height: 320 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    roomBlueprint: linesBlueprint,
    assets,
    spotTypes: [{ ...baseSpotType, prefix: null }],
    takenSpots: [],
  },
};

// ---------------------------------------------------------------------------
// Per-spot text styling — Beautifier-authored label appearance
// ---------------------------------------------------------------------------

const labelStyledBlueprint: RoomBlueprint = {
  id: 6,
  disabled: false,
  name: "LabelStyling",
  company: 1,
  establishment: 1,
  canvas: {
    coachHeight: 1,
    elements: [
      // Default styling.
      spotElement(1, -90, 0),
      // Bigger custom font.
      spotElement(2, -30, 0, 1, null, {
        fontSize: 22,
        fontWeight: 800,
        fontColor: "#1F4F4D",
      }),
      // Italic + tinted colour.
      spotElement(3, 30, 0, 1, null, {
        fontStyle: "italic",
        fontColor: "#7C3AED",
      }),
      // textOffsetY pushes the label off-centre (legacy Beautifier feature).
      spotElement(4, 90, 0, 1, null, {
        textOffsetY: 18,
        fontColor: "#0F766E",
      }),
    ],
  },
};

/**
 * Each spot has a label — usually a number (`1`, `2`, `3`) or a short code
 * (`A1`, `B2`). The studio can style each label independently: bigger numbers
 * for VIP rows, italics for a special spot, a different colour to call
 * attention. The label can also be nudged so it sits beside or below the spot
 * instead of inside it.
 */
export const PerSpotTextStyling: Story = {
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div style={{ width: 480, height: 180 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    roomBlueprint: labelStyledBlueprint,
    assets,
    spotTypes: [{ ...baseSpotType, prefix: null }],
    takenSpots: [],
  },
};

// ---------------------------------------------------------------------------
// Per-spot data overrides — Beautifier-authored size, fill, stroke, dashing
// ---------------------------------------------------------------------------

const beautifierBlueprint: RoomBlueprint = {
  id: 5,
  disabled: false,
  name: "BeautifierOverrides",
  company: 1,
  establishment: 1,
  canvas: {
    coachHeight: 1,
    elements: [
      // Default size — for reference.
      spotElement(1, -120, -60),
      // Larger circular via data.height (legacy wire format).
      spotElement(2, -40, -60, 1, null, { height: 60 }),
      // Custom fill + stroke — per-element override winning over theme.
      spotElement(3, 50, -60, 1, null, {
        fill: "#FCE7F3",
        stroke: "#BE185D",
        strokeWidth: 2,
      }),
      // Dashed body outline (Beautifier strokeDasharray).
      spotElement(4, 140, -60, 1, null, {
        strokeDasharray: "4 3",
        strokeWidth: 2,
      }),
      // Authored width on a rectangle stays the only way to grow horizontally.
      spotElement(5, -120, 40, 1, null, { width: 80, height: 30 }),
      // Combined: bigger, coloured, dashed.
      spotElement(6, 0, 40, 1, null, {
        height: 50,
        fill: "#FEF3C7",
        stroke: "#D97706",
        strokeWidth: 2,
        strokeDasharray: "5 3",
      }),
    ],
  },
};

/**
 * Beyond what the spot type defines, the studio can override any individual
 * spot — make this one bigger, that one a different colour, this one with a
 * dashed outline. Useful when one spot in a row is special: the instructor's
 * bike, a wheelchair-accessible space, a window seat. Per-spot styling wins
 * over the spot type's defaults.
 */
export const PerSpotDataOverrides: Story = {
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div style={{ width: 520, height: 240 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    roomBlueprint: beautifierBlueprint,
    assets,
    spotTypes: [
      { ...baseSpotType, prefix: null },
      { ...baseSpotType, id: 2, prefix: null, shape: "rectangle" },
    ],
    takenSpots: [],
  },
};

// ---------------------------------------------------------------------------
// SpotType authored fill_color / stroke_color
// ---------------------------------------------------------------------------

const COLORED_SPOT_TYPES: SpotType[] = [
  {
    ...baseSpotType,
    id: 10,
    prefix: null,
    fill_color: "#FEF3C7",
    stroke_color: "#D97706",
  },
  {
    ...baseSpotType,
    id: 11,
    prefix: null,
    fill_color: "#DBEAFE",
    stroke_color: "#1D4ED8",
  },
  {
    ...baseSpotType,
    id: 12,
    prefix: null,
    fill_color: "#DCFCE7",
    stroke_color: "#15803D",
  },
];

const coloredSpotsBlueprint: RoomBlueprint = {
  id: 4,
  disabled: false,
  name: "ColoredSpots",
  company: 1,
  establishment: 1,
  canvas: {
    coachHeight: 1,
    elements: [
      // Three rows × four columns. Each row uses a different SpotType so we
      // see authored colors hold for free spots while taken/selected fall back
      // to the theme state colors.
      spotElement(1, -90, -60, 10),
      spotElement(2, -30, -60, 10),
      spotElement(3, 30, -60, 10),
      spotElement(4, 90, -60, 10),
      spotElement(5, -90, 0, 11),
      spotElement(6, -30, 0, 11),
      spotElement(7, 30, 0, 11),
      spotElement(8, 90, 0, 11),
      spotElement(9, -90, 60, 12),
      spotElement(10, -30, 60, 12),
      spotElement(11, 30, 60, 12),
      spotElement(12, 90, 60, 12),
    ],
  },
};

/**
 * The studio can group spots by colour. Three rows here, each row a
 * different spot type with its own authored colour — yellow front row, blue
 * middle, green back. Free spots use those authored colours.
 *
 * When a spot is **taken** (spot 2), **selected** (spot 7), or the
 * student's **current spot** (spot 10), the canvas overrides the colour so
 * the state stays unambiguous — the manager can still tell at a glance
 * which spots are available, regardless of the studio's colour scheme.
 */
export const SpotTypeAuthoredColors: Story = {
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div style={{ width: 520, height: 320 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    roomBlueprint: coloredSpotsBlueprint,
    assets,
    spotTypes: COLORED_SPOT_TYPES,
    takenSpots: [2],
    selectedSpot: 7,
    currentSpot: 10,
  },
};

// ---------------------------------------------------------------------------
// Teacher element parity — coach photo + name + sizing
// ---------------------------------------------------------------------------

// Locally-vendored portrait so the fixture is self-contained (no network
// fetches in Storybook) and reads as a real photo rather than a vector icon.
// Matches the legacy production case where the coach's uploaded photo flows
// in via `coach.photo`.
const COACH_PHOTO_URL = coachPhoto;

const teacherDemoBlueprint: RoomBlueprint = {
  id: 3,
  disabled: false,
  name: "TeacherDemo",
  company: 1,
  establishment: 1,
  canvas: {
    coachHeight: 1,
    elements: [
      teacherElement("teacher", 0, -40),
      spotElement(1, -60, 60),
      spotElement(2, 0, 60),
      spotElement(3, 60, 60),
    ],
  },
};

/**
 * The coach (the instructor running the class) appears on the floor plan
 * too — their photo and first name, placed where they'll be standing during
 * the class. If the coach hasn't uploaded a photo, the canvas falls back to
 * a neutral silhouette.
 *
 * Left side: a coach with a photo. Right side: a coach without one.
 */
export const Teacher: Story = {
  parameters: { layout: "padded" },
  render: (args) => (
    <div style={{ display: "flex", gap: 24 }}>
      <div style={{ width: 360, height: 280 }}>
        <SpotCanvas
          {...args}
          coach={{
            id: 1,
            name: "Sandrine Dupont",
            firstname: "Sandrine",
            photo: COACH_PHOTO_URL,
          }}
        />
      </div>
      <div style={{ width: 360, height: 280 }}>
        <SpotCanvas
          {...args}
          coach={{
            id: 2,
            name: "Coach without photo",
          }}
        />
      </div>
    </div>
  ),
  args: {
    roomBlueprint: teacherDemoBlueprint,
    assets,
    spotTypes: [{ ...baseSpotType, prefix: null }],
    takenSpots: [],
  },
};

export const WideLayoutBoundsCheck: Story = {
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Rooms can be wide. A long screen across the front, a diagonal divider that stretches from corner to corner — anything the studio draws should fit inside the rendered floor plan, even if it extends well beyond where the spots are clustered. This story has a 500-wide screen and a diagonal line whose far endpoint sits well outside the spot cluster, and confirms everything still fits in the SVG with nothing clipped.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 600, height: 360 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    roomBlueprint: {
      id: 1,
      disabled: false,
      name: "WideLayout",
      company: 1,
      establishment: 1,
      canvas: {
        coachHeight: 1,
        elements: [
          screenElement("screen", 0, -120, 500, 24),
          lineElement("diagonal", [
            [0, 0],
            [380, 160],
          ]),
          spotElement(1, -80, -40),
          spotElement(2, -40, -40),
          spotElement(3, 0, -40),
          spotElement(4, 40, -40),
          spotElement(5, 80, -40),
          spotElement(6, -80, 40),
          spotElement(7, -40, 40),
          spotElement(8, 0, 40),
          spotElement(9, 40, 40),
          spotElement(10, 380, 160),
        ],
      },
    },
    assets,
    spotTypes: [{ ...baseSpotType, prefix: null }],
    takenSpots: [2],
    selectedSpot: 3,
    currentSpot: 7,
  },
};

// ---------------------------------------------------------------------------
// Regression: participant's own spot is also in `takenSpots`
// ---------------------------------------------------------------------------

const ownSpotBlueprint: RoomBlueprint = {
  id: 11,
  disabled: false,
  name: "OwnSpotInTakenList",
  company: 1,
  establishment: 1,
  canvas: {
    coachHeight: 1,
    elements: [
      // Three spots: 1 = taken by someone else, 2 = also taken — but this is
      // the participant's own booking, 3 = free, 4 = free.
      spotElement(1, -90, 0),
      spotElement(2, -30, 0),
      spotElement(3, 30, 0),
      spotElement(4, 90, 0),
    ],
  },
};

// Production-shaped SpotType: state-keyed images with `fontColorOnSelected:
// "transparent"` so the "Mon spot" yellow art absorbs the label, and
// `fontColorOnTaken: "#ffffff"` so taken spots show white text on black.
const ownSpotPersonalizedType: SpotType = {
  ...baseSpotType,
  shape: "circular",
  customization: "personalized",
  prefix: null,
  free_image: SPOT_TYPE_FREE_IMAGE,
  taken_image: SPOT_TYPE_TAKEN_IMAGE,
  selected_image: SPOT_TYPE_SELECTED_IMAGE,
};

/**
 * When the manager opens the modal to move a student who already has a
 * booking, the backend lists that booking as taken (it IS taken — by them).
 * The canvas needs to single it out as **the student's current spot**
 * rather than blending it in with everyone else's bookings, otherwise the
 * manager can't tell at a glance where the student is starting from.
 *
 * Spot 2 here is both *taken* and *the student's current spot*. It should
 * render as the highlighted "current spot" art — not as the dark "réservé"
 * art used for spots booked by other students.
 */
export const OwnSpotInTakenList: Story = {
  decorators: [fourStateDecorator],
  args: {
    roomBlueprint: ownSpotBlueprint,
    assets,
    spotTypes: [ownSpotPersonalizedType],
    takenSpots: [1, 2],
    currentSpot: 2,
  },
};
