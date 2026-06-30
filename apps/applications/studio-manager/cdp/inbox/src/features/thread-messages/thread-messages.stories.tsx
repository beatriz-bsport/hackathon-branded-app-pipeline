import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";

import type { InboxParticipantSummary } from "@bsport/api-cdp/inbox";
import {
  MOCK_INBOX_FIRST_UNREAD_ID,
  makeInboxMessages,
  makeInboxMessagesHandlers,
} from "@bsport/api-cdp/inbox/mocks";

import { storybookDecorator } from "#src/utils/storybook-decorator";

import { ThreadMessages } from "./thread-messages";

const PARTICIPANT: InboxParticipantSummary = {
  fullName: "Emma Martin",
  initials: "EM",
};

/**
 * A dataset spread across several calendar days (~6 messages/day), so the feed
 * renders multiple date separators. Ids stay ascending so the windowed mock
 * pagination still works.
 */
const multiDayMessages = makeInboxMessages(48).map((item, index) => {
  const anchor = Date.UTC(2026, 3, 20, 9, 0, 0); // 2026-04-20T09:00:00Z
  const day = Math.floor(index / 6);
  const minute = (index % 6) * 30;
  return {
    ...item,
    date_created: new Date(
      anchor + day * 24 * 60 * 60 * 1000 + minute * 60 * 1000,
    ).toISOString(),
  };
});

/** Constrains the panel to a realistic right-column size so scroll has bounds. */
const withPanelFrame: Decorator = (Story) => (
  <div className="h-[680px] w-[520px] overflow-hidden border border-stroke-thin border-stroke-weak">
    <Story />
  </div>
);

const meta: Meta<typeof ThreadMessages> = {
  title: "Inbox/ThreadMessages",
  component: ThreadMessages,
  args: {
    conversationId: "conv-0001",
    participant: PARTICIPANT,
  },
  parameters: {
    layout: "centered",
    msw: { handlers: makeInboxMessagesHandlers() },
    docs: {
      description: {
        component:
          'The Inbox right panel: a member\'s conversation thread. Messages are fetched through the real `@bsport/api-cdp` bidirectional infinite-query hook, backed by MSW mocks. The feed is virtualized with reverse (chat-style) scrolling: scroll up to load older history (no viewport jump), scroll down to load newer messages. On open it anchors on the seam — the green "NEW" separator before the first unread message — and shows a "Jump to latest" button while newer messages remain below.',
      },
    },
  },
  decorators: [withPanelFrame, ...storybookDecorator],
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ThreadMessages>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Opens scrolled to the seam: read context above the green "NEW" separator, unread messages below. Scroll up/down to paginate older/newer history.',
      },
    },
  },
};

export const FullyRead: Story = {
  parameters: {
    msw: { handlers: makeInboxMessagesHandlers({ firstUnreadId: null }) },
    docs: {
      description: {
        story:
          'No unread messages — opens scrolled to the bottom (newest), with no "NEW" separator and no jump-to-latest button.',
      },
    },
  },
};

export const MultiDay: Story = {
  parameters: {
    msw: {
      handlers: makeInboxMessagesHandlers({
        dataset: multiDayMessages,
        firstUnreadId:
          multiDayMessages.at(-12)?.data.communication_sent_id ?? null,
      }),
    },
    docs: {
      description: {
        story:
          "Messages spanning several days, so a centered date separator marks each new calendar day. The seam sits a dozen messages from the end.",
      },
    },
  },
};

export const Loading: Story = {
  parameters: {
    msw: { handlers: makeInboxMessagesHandlers({ delayMs: "infinite" }) },
    docs: {
      description: {
        story: "Initial load state — the request never resolves.",
      },
    },
  },
};

export const Error: Story = {
  parameters: {
    msw: { handlers: makeInboxMessagesHandlers({ errorOnLoad: true }) },
    docs: {
      description: {
        story:
          "The initial load fails — nothing could be loaded, so the full-screen error placeholder with a retry shows.",
      },
    },
  },
};

export const SeamNearEnd: Story = {
  parameters: {
    msw: {
      handlers: makeInboxMessagesHandlers({
        firstUnreadId: MOCK_INBOX_FIRST_UNREAD_ID,
      }),
    },
    docs: {
      description: {
        story:
          "Explicit seam near the end of the conversation (the default dataset). Demonstrates that older history can be paged in above without the viewport jumping.",
      },
    },
  },
};
