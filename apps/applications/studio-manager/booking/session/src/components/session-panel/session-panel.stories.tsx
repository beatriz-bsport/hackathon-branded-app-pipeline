import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";

import { DetailsLayout } from "@bsport/kaizen-primitive-core";
import { FeatureFlagsProvider } from "@bsport/sm-backbone";

import {
  SESSION_ID,
  seededSessionPanelClient,
  sessionVariants,
} from "./__fixtures__/session-panel-fixtures";
import { SessionPanel } from "./session-panel";

type Variant = keyof typeof sessionVariants;

const withProviders =
  (variant: Variant): Decorator =>
  (Story) => (
    <FeatureFlagsProvider>
      <MemoryRouter initialEntries={[`/${SESSION_ID}`]}>
        <QueryClientProvider
          client={seededSessionPanelClient(sessionVariants[variant])}
        >
          <DetailsLayout withPanel>
            <DetailsLayout.Panel>
              <Story />
            </DetailsLayout.Panel>
          </DetailsLayout>
        </QueryClientProvider>
      </MemoryRouter>
    </FeatureFlagsProvider>
  );

const meta = {
  title: "Session Management/SessionPanel",
  component: SessionPanel,
  parameters: { layout: "fullscreen" },
  args: { sessionId: SESSION_ID },
} satisfies Meta<typeof SessionPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [withProviders("default")],
};

export const Minimal: Story = {
  decorators: [withProviders("minimal")],
};
