import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@bsport/kaizen-primitive-core";

import {
  SESSION_ID,
  TAKEN_SPOTS,
  TAKEN_SPOTS_WITH_CURRENT,
  noopFetch,
  seededSpotSelectorClient,
} from "#src/components/spot-selector/__fixtures__/spot-selector-modal-fixtures";
import { SpotSelectorModal } from "#src/components/spot-selector/spot-selector-modal/spot-selector-modal";

type SpotSelectorModalComponent = typeof SpotSelectorModal;

const withSeededClient =
  (takenSpots: number[] = TAKEN_SPOTS): Decorator =>
  (Story) => (
    <QueryClientProvider client={seededSpotSelectorClient(takenSpots)}>
      <Story />
    </QueryClientProvider>
  );

const meta: Meta<SpotSelectorModalComponent> = {
  component: SpotSelectorModal,
  title: "SpotSelectorModal",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Studio Manager spot picker. Stories pre-seed the TanStack Query cache so no backend is required — the four data queries short-circuit on the canned fixtures and the floor plan renders immediately.",
      },
    },
  },
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

export const WithSession: Story = {
  decorators: [withSeededClient()],
  render: () => <OpenTrigger sessionId={SESSION_ID} />,
};

/** Spot 10 is seeded into `taken_spots` to mirror the production API. */
export const WithCurrentSpot: Story = {
  decorators: [withSeededClient(TAKEN_SPOTS_WITH_CURRENT)],
  render: () => <OpenTrigger sessionId={SESSION_ID} currentSpot={10} />,
};

/** `sessionId: null` keeps the data hook inert; modal shows the empty state. */
export const WithoutSession: Story = {
  decorators: [withSeededClient()],
  render: () => <OpenTrigger sessionId={null} />,
};
