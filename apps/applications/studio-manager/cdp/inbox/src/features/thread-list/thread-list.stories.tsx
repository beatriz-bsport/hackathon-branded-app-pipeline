import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within } from "storybook/test";

import {
  makeInboxHandlers,
  mockInboxConversations,
} from "@bsport/api-cdp/inbox/mocks";

import { storybookDecorator } from "#src/utils/storybook-decorator";

import { ThreadList } from "./thread-list";

/**
 * Opens the funnel menu and selects the "Unread" option. The menu renders in a
 * portal (outside `canvasElement`), so options are queried from the document body.
 */
const selectUnreadFilter = async (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement);
  const body = within(canvasElement.ownerDocument.body);

  await userEvent.click(
    await canvas.findByRole("button", { name: "Filter conversations" }),
  );
  await userEvent.click(await body.findByText("Unread"));
};

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

export const FilteredUnread: Story = {
  play: async ({ canvasElement }) => {
    await selectUnreadFilter(canvasElement);
  },
  parameters: {
    docs: {
      description: {
        story:
          "Opens the funnel menu and selects **Unread**. The mock honors `unread=true`, so only conversations with unread messages remain in the feed.",
      },
    },
  },
};

export const UnreadEmpty: Story = {
  parameters: {
    msw: {
      handlers: makeInboxHandlers({
        dataset: mockInboxConversations.map((conversation) => ({
          ...conversation,
          studio_unread_count: 0,
        })),
      }),
    },
    docs: {
      description: {
        story:
          "Conversations exist but all are read. Selecting **Unread** filters them all out, falling back to the generic 'No conversations' empty state.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    await selectUnreadFilter(canvasElement);
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
