import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { QueryClientProvider } from "@tanstack/react-query";

import {
  IMAGE_SPOTS_BLUEPRINT_ID,
  IMAGE_SPOTS_COACH_ID,
  IMAGE_SPOTS_SESSION_ID,
  MIXED_BLUEPRINT_ID,
  MIXED_COACH_ID,
  MIXED_SESSION_ID,
  STUDIO_BEAUBOURG_SESSION_ID,
  seededFullBlueprintSpotSelectorClient,
  seededImageSpotsSpotSelectorClient,
  seededStudioBeaubourgSpotSelectorClient,
} from "#src/components/spot-selector/__fixtures__/spot-selector-modal-fixtures";
import { STUDIO_BEAUBOURG_BLUEPRINT_ID } from "#src/components/spot-selector/__fixtures__/studio-beaubourg-blueprint-fixtures";

import { FloorPlanBlock } from "./floor-plan-block";

type FloorPlanBlockComponent = typeof FloorPlanBlock;

const withSeededClient =
  (
    client: ReturnType<typeof seededFullBlueprintSpotSelectorClient>,
  ): Decorator =>
  (Story) => (
    <QueryClientProvider client={client}>
      <Story />
    </QueryClientProvider>
  );

const meta: Meta<FloorPlanBlockComponent> = {
  component: FloorPlanBlock,
  title: "Session Management/FloorPlanBlock",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A read-only preview of the studio room's floor plan and filled spots, shown to studio managers on the session management page (`/calendar/:sessionId`). It sits inside a collapsible accordion, hidden by default, so the manager can access it when they need it.",
          "",
          "It wraps `SpotCanvas` (the floor-plan renderer) and the same `SpotStatusLegend` that `SpotSelectorModal` uses — identical components, same layout — but with no click handler passed in. So the manager sees exactly the same view they'd get when opening the modal to assign a spot, except this one stays read-only.",
        ].join("\n"),
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<FloorPlanBlockComponent>;

/**
 * A complete studio room exercising every element type: spots of two
 * different kinds, the coach, a screen at the front, the perimeter walls, a
 * door, and a decorative storage area.
 *
 * Because there's more than one spot type, the legend below shows generic
 * Free / Taken chips at the top and a per-type row underneath, so the
 * manager can tell each spot type apart.
 */
export const CompleteBlueprintDefaultShapes: Story = {
  decorators: [withSeededClient(seededFullBlueprintSpotSelectorClient())],
  render: () => (
    <FloorPlanBlock
      session={{
        id: MIXED_SESSION_ID,
        room_blueprint: MIXED_BLUEPRINT_ID,
        coach: MIXED_COACH_ID,
      }}
    />
  ),
};

/**
 * A real production room (Studio Beaubourg) — a photo of the studio floor
 * as the background, mixed spot shapes, each spot type tinted differently.
 * Confirms the read-only preview handles real-world data the same way the
 * interactive `SpotSelectorModal` does.
 */
export const WithCustomShapesBackgroundAndColours: Story = {
  decorators: [withSeededClient(seededStudioBeaubourgSpotSelectorClient())],
  render: () => (
    <FloorPlanBlock
      session={{
        id: STUDIO_BEAUBOURG_SESSION_ID,
        room_blueprint: STUDIO_BEAUBOURG_BLUEPRINT_ID,
        coach: null,
      }}
    />
  ),
};

/**
 * A spinning-class room where every spot is a real photo of a bike. Because
 * there's only one spot type, the legend's Free and Taken chips show those
 * same bike photos — exactly what the manager sees on the floor plan above,
 * just in chip form.
 */
export const WithImageSpotIcons: Story = {
  decorators: [withSeededClient(seededImageSpotsSpotSelectorClient())],
  render: () => (
    <FloorPlanBlock
      session={{
        id: IMAGE_SPOTS_SESSION_ID,
        room_blueprint: IMAGE_SPOTS_BLUEPRINT_ID,
        coach: IMAGE_SPOTS_COACH_ID,
      }}
    />
  ),
};
