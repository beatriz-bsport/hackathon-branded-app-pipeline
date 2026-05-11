import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import type React from "react";

import type {
  AssetForBlueprint,
  RoomBlueprint,
  SpotType,
} from "@bsport/api-book";

import {
  baseSpotType,
  lineElement,
  screenElement,
  spotElement,
} from "#src/components/spot-selector/__fixtures__/canvas-elements";
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
        component:
          "Canvas-level renderer for a room blueprint. Drives the modal and the read-only floor-plan block.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof SpotCanvas>;

/** Order: `1 Free · 2 Taken · 3 Selected · 4 Current spot`. */
export const StatesInteractive: Story = {
  decorators: [fourStateDecorator],
  args: {
    ...fourStateArgs,
    onSelectSpot: (i) => console.log("selected", i),
  },
};

/** No `onSelectSpot` → spots render as `img` rather than `button`. */
export const StatesReadOnly: Story = {
  decorators: [fourStateDecorator],
  args: fourStateArgs,
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

export const WideLayoutBoundsCheck: Story = {
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Regression check for the viewBox bounds fix. The 500-wide screen and the diagonal line's (380, 160) endpoint live well outside the spot cluster — under the old `elementXY` (centre/x1-y1 only) they would have been clipped. With the fix, every element contributes its full extent and the SVG auto-fits everything.",
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
          lineElement("diagonal", 0, 0, 380, 160),
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
