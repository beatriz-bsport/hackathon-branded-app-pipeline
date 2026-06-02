import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@bsport/kaizen-primitive-core";

import {
  IMAGE_SPOTS_CURRENT,
  IMAGE_SPOTS_SESSION_ID,
  MIXED_SESSION_ID,
  SESSION_ID,
  STUDIO_BEAUBOURG_CURRENT_SPOT,
  STUDIO_BEAUBOURG_SESSION_ID,
  TAKEN_SPOTS_WITH_CURRENT,
  noopFetch,
  seededFullBlueprintSpotSelectorClient,
  seededImageSpotsSpotSelectorClient,
  seededSpotSelectorClient,
  seededStudioBeaubourgSpotSelectorClient,
} from "#src/components/spot-selector/__fixtures__/spot-selector-modal-fixtures";
import { SpotSelectorModal } from "#src/components/spot-selector/spot-selector-modal/spot-selector-modal";
import { storybookDecorator } from "#src/utils/storybook-decorator";

type SpotSelectorModalComponent = typeof SpotSelectorModal;

const withSeededClient =
  (takenSpots: number[]): Decorator =>
  (Story) => (
    <QueryClientProvider client={seededSpotSelectorClient(takenSpots)}>
      <Story />
    </QueryClientProvider>
  );

const meta: Meta<SpotSelectorModalComponent> = {
  component: SpotSelectorModal,
  title: "Session Management/SpotSelectorModal",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "The modal that opens when a studio manager wants to set or change a student's spot in a class.",
          "",
          "It wraps `SpotCanvas` (the floor-plan renderer) and `SpotStatusLegend` (the colour key beneath it) inside a modal. The modal's job is to make the canvas **interactive** — it passes a click handler down, which turns every free spot into a clickable button. Clicking stages a spot; confirming sends the assignment to the backend.",
          "",
          "The same canvas + legend pair also appears inline on the session management page as `FloorPlanBlock` — same view, just read-only.",
        ].join("\n"),
      },
    },
  },
  decorators: storybookDecorator,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<SpotSelectorModalComponent>;

type TriggerProps = {
  sessionId: number | null;
  currentSpot?: number | null;
};

const OpenTrigger = ({ sessionId, currentSpot }: TriggerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button
        label="Open spot selector"
        size="md"
        intent="default"
        color="main"
        onClick={() => setIsOpen(true)}
      />
      <SpotSelectorModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={(spotIndex) => {
          console.log("onConfirm", { spotIndex });
          setIsOpen(false);
        }}
        sessionId={sessionId}
        fetch={noopFetch}
        currentSpot={currentSpot}
      />
    </>
  );
};

/**
 * The student already has a spot booked (spot 10) and the manager is
 * opening the modal to move them to a different one. The student's current
 * spot is highlighted on the floor plan, and the legend below shows a
 * "Current spot" chip so the manager can see at a glance where the student
 * is starting from.
 */
export const WithCurrentSpot: Story = {
  decorators: [withSeededClient(TAKEN_SPOTS_WITH_CURRENT)],
  render: () => <OpenTrigger sessionId={SESSION_ID} currentSpot={10} />,
};

/**
 * The modal opened without a session — for example if the parent component
 * hasn't picked one yet. Skips the data fetch and shows the empty state.
 */
export const WithoutSession: Story = {
  decorators: [withSeededClient([])],
  render: () => <OpenTrigger sessionId={null} />,
};

/**
 * A complete studio room with every kind of element the canvas supports
 * drawn at once: spots of two different types, the coach (with photo), a
 * screen at the front, the perimeter walls, a door, and a decorative
 * storage rectangle with a dashed outline.
 *
 * Useful for spotting visual regressions — if one element starts overlapping
 * or clashing with another, this is where it'll be most obvious.
 */
export const CompleteBlueprintDefaultShapes: Story = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={seededFullBlueprintSpotSelectorClient()}>
        <Story />
      </QueryClientProvider>
    ),
  ],
  render: () => <OpenTrigger sessionId={MIXED_SESSION_ID} currentSpot={6} />,
};

/**
 * A real production room (Studio Beaubourg). The studio has uploaded a
 * photo of the floor as the background and authored a mix of shapes — round
 * spots next to rectangular benches — each spot type tinted differently.
 *
 * Pinned to live production data so it catches quirks in the data format
 * that hand-written test fixtures might miss.
 */
export const WithCustomShapesBackgroundAndColours: Story = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={seededStudioBeaubourgSpotSelectorClient()}>
        <Story />
      </QueryClientProvider>
    ),
  ],
  render: () => (
    <OpenTrigger
      sessionId={STUDIO_BEAUBOURG_SESSION_ID}
      currentSpot={STUDIO_BEAUBOURG_CURRENT_SPOT}
    />
  ),
};

/**
 * A spinning-class room where every spot is a real photo of a bike rather
 * than a geometric shape. Each spot uses three versions of the same photo:
 * an available bike, a taken bike, and a highlighted bike for the spot the
 * manager has just clicked. Common setup for indoor cycling studios.
 */
export const WithImageSpotIcons: Story = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={seededImageSpotsSpotSelectorClient()}>
        <Story />
      </QueryClientProvider>
    ),
  ],
  render: () => (
    <OpenTrigger
      sessionId={IMAGE_SPOTS_SESSION_ID}
      currentSpot={IMAGE_SPOTS_CURRENT}
    />
  ),
};
