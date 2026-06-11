import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";

import { makeInboxHandlers } from "@bsport/api-cdp/inbox/mocks";

import { storybookDecorator } from "#src/utils/storybook-decorator";

import { ThreadList } from "./thread-list";

/** Constrains the panel to a realistic inbox-column size so scroll has bounds. */
const withPanelFrame: Decorator = (Story) => (
  <div className="h-[640px] w-[380px] overflow-hidden border border-stroke-thin border-stroke-weak">
    <Story />
  </div>
);

const meta: Meta<typeof ThreadList> = {
  title: "Inbox/ThreadList",
  component: ThreadList,
  parameters: {
    layout: "centered",
    msw: { handlers: makeInboxHandlers() },
    docs: {
      description: {
        component:
          "The Inbox left panel: an infinite-scrolling list of conversation threads. Data is fetched through the real `@bsport/api-cdp` infinite-query hook, backed by MSW mocks exported from `@bsport/api-cdp/inbox/mocks`. Scroll to the bottom to load the next page.",
      },
    },
  },
  decorators: [withPanelFrame, ...storybookDecorator],
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ThreadList>;

export const Default: Story = {};

export const Empty: Story = {
  parameters: {
    msw: { handlers: makeInboxHandlers({ dataset: [] }) },
    docs: {
      description: {
        story:
          "No conversations have been started yet — renders the `ThreadListEmpty` placeholder (illustration + message).",
      },
    },
  },
};

export const Loading: Story = {
  parameters: {
    msw: { handlers: makeInboxHandlers({ delayMs: "infinite" }) },
    docs: {
      description: {
        story: "Initial load state — the request never resolves.",
      },
    },
  },
};

export const Error: Story = {
  parameters: {
    msw: { handlers: makeInboxHandlers({ errorFromPage: 1 }) },
    docs: {
      description: {
        story: "The initial page request fails — nothing could be loaded.",
      },
    },
  },
};

export const NextPageError: Story = {
  parameters: {
    msw: { handlers: makeInboxHandlers({ errorFromPage: 2 }) },
    docs: {
      description: {
        story:
          "The first page loads fine, but fetching the next page fails with a 500. No scrolling is needed: the overscan-driven prefetch requests page 2 right after mount. The already-loaded list stays on screen; a persistent critical toast appears with a 'Try again' action, and the trailing load-more row offers a matching retry. Retrying re-requests page 2 (which keeps failing under this mock, so the toast re-fires).",
      },
    },
  },
};
