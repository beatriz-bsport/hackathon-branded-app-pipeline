import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { Suspense } from "react";

import type { InboxParticipantSummary } from "@bsport/api-cdp/inbox";
import {
  makeInboxHandlers,
  makeInboxMessagesHandlers,
} from "@bsport/api-cdp/inbox/mocks";
import {
  makeMemberHandlers,
  mockMemberDetail,
} from "@bsport/api-cdp/member/mocks";
import { makeTagHandlers } from "@bsport/api-cdp/tags/mocks";
import { makeUnpaidInvoiceHandlers } from "@bsport/api-financial-services/invoice/mocks";
import { Body, Loader, Title, cx } from "@bsport/kaizen-primitive-core";

import { MemberDetailContent } from "#src/features/member-detail/member-detail-content";
import { MessageComposerForm } from "#src/features/message-composer/message-composer-form";
import { ThreadList } from "#src/features/thread-list/thread-list";
import { ThreadMessagesHeader } from "#src/features/thread-messages/header/thread-messages-header";
import { ThreadMessages } from "#src/features/thread-messages/thread-messages";
import { storybookDecorator } from "#src/utils/storybook-decorator";

import { InboxLayout, type InboxLayoutProps } from "./inbox-layout";

/**
 * Story args mirror the three controllable layout states. They are wired to the
 * `default*` props (with a `key` so changing a control remounts the layout), so
 * the Storybook controls *and* the in-header toggle buttons both drive the same
 * uncontrolled state — no hook mocking needed.
 */
type LayoutStoryArgs = Pick<
  InboxLayoutProps,
  "mobileView" | "threadListOpen" | "detailOpen"
>;

/** A labelled, full-bleed placeholder standing in for a real pane. */
function Placeholder({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "flex h-full w-full items-center justify-center p-md text-center",
        className,
      )}
    >
      <Body size="sm" color="weak">
        {label}
      </Body>
    </div>
  );
}

/** Constrains the layout to a viewport-height frame so the panels have bounds. */
const withViewportFrame: Decorator = (Story) => (
  <div className="h-screen w-full overflow-hidden">
    <Story />
  </div>
);

const renderPlaceholderLayout = (args: LayoutStoryArgs) => (
  <InboxLayout
    key={`${args.mobileView}-${args.threadListOpen}-${args.detailOpen}`}
    defaultMobileView={args.mobileView}
    defaultThreadListOpen={args.threadListOpen}
    defaultDetailOpen={args.detailOpen}
  >
    <InboxLayout.ListPane>
      <Placeholder label="ListPane — ThreadList" className="bg-surface-page" />
    </InboxLayout.ListPane>

    <InboxLayout.Content>
      <InboxLayout.Header onBack={() => undefined}>
        <Title htmlVariant="h2" weight="strong" color="default">
          Emma Martin
        </Title>
      </InboxLayout.Header>

      <Placeholder
        label="Content body — ThreadMessages"
        className="bg-surface-default"
      />
      <div className="shrink-0 border-t-stroke-thin border-t-stroke-divider">
        <Placeholder
          label="MessageComposer"
          className="h-[88px] bg-surface-default"
        />
      </div>

      <InboxLayout.DetailPane>
        <Placeholder
          label="DetailPane — MemberDetail"
          className="bg-surface-page"
        />
      </InboxLayout.DetailPane>
    </InboxLayout.Content>
  </InboxLayout>
);

const meta: Meta<typeof InboxLayout> = {
  title: "Inbox/InboxLayout",
  component: InboxLayout,
  render: renderPlaceholderLayout,
  args: {
    mobileView: "list",
    threadListOpen: true,
    detailOpen: true,
  },
  argTypes: {
    mobileView: { control: "inline-radio", options: ["list", "thread"] },
    threadListOpen: { control: "boolean" },
    detailOpen: { control: "boolean" },
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Composable, responsive shell for the CDP Inbox. Arranges the thread list, the open thread (header + messages + composer), and the member detail pane, adapting between a 3-region desktop layout (≥`lg`) and a single full-bleed pane below it. The layout is UI-only — it *contains* the feature components without knowing anything about them. Use the **Canvas** tab with the viewport toolbar to see the responsive behavior; the in-header icon buttons toggle the list and detail panes live.",
      },
    },
  },
  decorators: [withViewportFrame, ...storybookDecorator],
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof InboxLayout>;

// ----- Desktop placeholder matrix (≥lg) -----

export const Default: Story = {
  args: { threadListOpen: true, detailOpen: false },
  parameters: {
    docs: {
      description: {
        story:
          "Desktop, list rail open and detail collapsed — the messages-focused two-region view. Click the right (layout) icon in the header to reveal the detail rail.",
      },
    },
  },
};

export const ListClosed: Story = {
  args: { threadListOpen: false, detailOpen: false },
  parameters: {
    docs: {
      description: {
        story:
          "Desktop with the thread-list rail collapsed (the left header icon toggles it). The center column reflows to fill the freed width.",
      },
    },
  },
};

export const DetailOpen: Story = {
  args: { threadListOpen: true, detailOpen: true },
  parameters: {
    docs: {
      description: {
        story:
          "Desktop, full 3-region layout: list rail, center thread, and the detail rail on the right.",
      },
    },
  },
};

// ----- Mobile placeholder matrix (<lg) -----

const mobileViewport = { defaultViewport: "mobile1" };

export const List: Story = {
  args: { mobileView: "list" },
  parameters: {
    viewport: mobileViewport,
    docs: {
      description: {
        story:
          'Mobile, list view — the thread list is full-bleed. Selecting a thread is a routing concern: the consumer flips `mobileView` to `"thread"`.',
      },
    },
  },
};

export const Thread: Story = {
  args: { mobileView: "thread", detailOpen: false },
  parameters: {
    viewport: mobileViewport,
    docs: {
      description: {
        story:
          "Mobile, thread view — the open conversation is full-bleed. The header's left icon is a `‹` back control (router seam via `onBack`); the right icon opens the detail pane.",
      },
    },
  },
};

export const ThreadWithDetail: Story = {
  args: { mobileView: "thread", detailOpen: true },
  parameters: {
    viewport: mobileViewport,
    docs: {
      description: {
        story:
          "Mobile, detail open — the detail pane replaces the body full-bleed while the header persists above it. The header's left icon now steps back to the messages (`toggleDetail(false)`).",
      },
    },
  },
};

// ----- Integration story: real features wired through MSW -----

const PARTICIPANT: InboxParticipantSummary = {
  memberId: mockMemberDetail.id,
  fullName: mockMemberDetail.name,
  initials: "AS",
};

export const Integration: StoryObj<typeof InboxLayout> = {
  render: () => (
    <InboxLayout defaultDetailOpen>
      <InboxLayout.ListPane>
        <ThreadList />
      </InboxLayout.ListPane>

      <InboxLayout.Content>
        <InboxLayout.Header onBack={() => undefined}>
          <ThreadMessagesHeader title={PARTICIPANT.fullName} />
        </InboxLayout.Header>

        <ThreadMessages
          conversationId="conv-0001"
          participant={PARTICIPANT}
          className="min-h-0 flex-1"
        />
        <MessageComposerForm onSubmit={() => undefined} />

        <InboxLayout.DetailPane>
          {/* The real `MemberDetail` wraps this in sm-backbone's `QueryBoundary`,
              whose error boundary needs an `ApplicationScopeProvider` the app
              supplies at its root but Storybook does not. Mirror the
              `MemberDetail` story and render the content under a plain
              `Suspense` so the integration story stays provider-free. */}
          <Suspense
            fallback={
              <div className="flex h-full items-center justify-center p-md">
                <Loader size="lg" />
              </div>
            }
          >
            <MemberDetailContent memberId={PARTICIPANT.memberId} />
          </Suspense>
        </InboxLayout.DetailPane>
      </InboxLayout.Content>
    </InboxLayout>
  ),
  parameters: {
    layout: "fullscreen",
    msw: {
      // The conversation-list pattern ends in `*`, so it also matches the
      // per-conversation messages URL. The more specific messages handlers
      // must be registered first (MSW resolves first-match-wins) or the list
      // handler hijacks the messages request and returns conversation rows.
      handlers: [
        ...makeInboxMessagesHandlers(),
        ...makeInboxHandlers(),
        ...makeMemberHandlers(),
        ...makeTagHandlers(),
        ...makeUnpaidInvoiceHandlers({ count: 19 }),
      ],
    },
    docs: {
      description: {
        story:
          "Real `ThreadList`, `ThreadMessages`, `MessageComposer`, and `MemberDetail` wired through the `@bsport/api-cdp` / `@bsport/api-financial-services` MSW mocks, slotted into the layout shell — the full 3-region Inbox with live data in every pane. The single thread header is owned by `InboxLayout.Header` (which provides the bar chrome and the layout toggles) and wraps the layout-agnostic `ThreadMessagesHeader` for the title and filter/more-actions controls.",
      },
    },
  },
};
