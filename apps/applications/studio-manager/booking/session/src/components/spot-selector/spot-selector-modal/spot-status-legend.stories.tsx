import type { Meta, StoryObj } from "@storybook/react-vite";

import type {
  AssetForBlueprint,
  CanvasElement,
  CanvasSpotData,
  SpotType,
} from "@bsport/api-book";

import { spotElement } from "#src/components/spot-selector/__fixtures__/canvas-elements";
import spinBikeAvailable from "#src/components/spot-selector/assets/spin-bike-available.jpg";
import spinBikeSelected from "#src/components/spot-selector/assets/spin-bike-selected.jpg";
import spinBikeTaken from "#src/components/spot-selector/assets/spin-bike-taken.jpeg";
import { SpotStatusLegend } from "#src/components/spot-selector/spot-selector-modal/spot-status-legend";
import { storybookDecorator } from "#src/utils/storybook-decorator";

type SpotStatusLegendComponent = typeof SpotStatusLegend;

// Personalized SpotType using the vendored spin-bike photos — drives the
// single-type stories' real-swatch rendering.
const cycleType: SpotType = {
  id: 23,
  name: "Cycle",
  prefix: "",
  suffix: "",
  shape: "circular",
  customization: "personalized",
  fill_color: "",
  stroke_color: "black",
  free_image: spinBikeAvailable,
  taken_image: spinBikeTaken,
  selected_image: spinBikeSelected,
};

// Predefined (colour-only) SpotType — paired with `cycleType` so the
// multi-type story trips the generic-circle fallback.
const benchType: SpotType = {
  id: 24,
  name: "Bench",
  prefix: "B",
  suffix: "",
  shape: "rectangle",
  customization: "predefined",
  fill_color: "#6cca64",
  stroke_color: "black",
  free_image: null,
  taken_image: null,
  selected_image: null,
};

const emptyAssets: AssetForBlueprint[] = [];

const cycleSpotElement = (taken: boolean): CanvasElement<CanvasSpotData> => ({
  ...spotElement(7, 0, 0, cycleType.id),
  data: {
    ...spotElement(7, 0, 0, cycleType.id).data,
    taken,
  },
});

const benchSpotElement = (taken: boolean): CanvasElement<CanvasSpotData> => ({
  ...spotElement(11, 0, 0, benchType.id),
  data: {
    ...spotElement(11, 0, 0, benchType.id).data,
    taken,
  },
});

const meta: Meta<SpotStatusLegendComponent> = {
  component: SpotStatusLegend,
  title: "Session Management/SpotStatusLegend",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          'The colour key that sits beneath the floor plan, telling the studio manager "this is what a free spot looks like, this is what a taken spot looks like". Rendered beneath `SpotCanvas` in both `SpotSelectorModal` and `FloorPlanBlock`.',
          "",
          "If the room only has one kind of spot (e.g. a spinning studio where every spot is a bike), the chips show real swatches of that spot — the manager sees in the legend exactly the same icon they see on the floor plan above. If the room has more than one kind (bikes **and** benches, for example), no single item could represent both, so the chips fall back to generic outlined / filled circles.",
          "",
          "Two extra chips show up when relevant: **Current spot** (the student's existing booking) and **Selected** (the spot the manager is about to confirm). Both are hidden when they don't apply.",
        ].join("\n"),
      },
    },
  },
  decorators: [
    ...storybookDecorator,
    (Story) => (
      // Mirror `SpotSelectorModal`'s wrapping flex row so the chips lay out
      // horizontally (the component uses `display: contents`).
      <div className="flex flex-wrap items-center gap-md">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<SpotStatusLegendComponent>;

/**
 * A room with one kind of spot — a spinning bike. The Free and Taken chips
 * show the actual bike photo, so the manager can match the legend chip
 * directly to what they see on the floor plan.
 */
export const SingleType: Story = {
  args: {
    spotTypes: [cycleType],
    assets: emptyAssets,
    freeCount: 18,
    takenCount: 2,
    currentSpotElement: null,
    selectedSpotElement: null,
  },
};

/**
 * An older room blueprint where the studio hasn't set up any spot-type
 * metadata at all. Every spot on the floor plan falls back to the canvas's
 * default circle styling. The legend chips below need to match — so they
 * use the same circle palette the canvas uses, ensuring the chip and the
 * spot agree on what "taken" looks like.
 */
export const NoSpotTypes: Story = {
  args: {
    spotTypes: [],
    assets: emptyAssets,
    freeCount: 8,
    takenCount: 1,
    currentSpotElement: null,
    selectedSpotElement: null,
  },
};

/**
 * A room with more than one kind of spot — bikes **and** benches, for
 * example. The Free / Taken chips become generic outlined and filled
 * circles, because no single image could represent both spot types at once.
 *
 * The manager identifies which spot type is which from a separate per-type
 * legend (`SpotLegend`); these chips just communicate availability.
 */
export const MultiType: Story = {
  args: {
    spotTypes: [cycleType, benchType],
    assets: emptyAssets,
    freeCount: 25,
    takenCount: 5,
    currentSpotElement: null,
    selectedSpotElement: null,
  },
};

/**
 * All four chips visible at once: a generic Free, a generic Taken, the
 * student's **Current spot** (their existing booking — a Cycle), and the
 * spot the manager is about to confirm (**Selected** — a Bench).
 *
 * Useful for checking that the chips lay out cleanly when every type is
 * present, and that each chip's swatch matches its actual spot type.
 */
export const WithCurrentAndSelected: Story = {
  args: {
    spotTypes: [cycleType, benchType],
    assets: emptyAssets,
    freeCount: 23,
    takenCount: 7,
    currentSpotElement: cycleSpotElement(true),
    selectedSpotElement: benchSpotElement(false),
  },
};
