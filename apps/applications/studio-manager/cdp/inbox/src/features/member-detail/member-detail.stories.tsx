import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import {
  Component,
  type PropsWithChildren,
  type ReactNode,
  Suspense,
} from "react";

import {
  makeMemberHandlers,
  mockMemberDetail,
  mockMemberDetailWithLongNotes,
  mockMemberDetailWithoutDebt,
  mockMemberDetailWithoutTagsOrNotes,
} from "@bsport/api-cdp/member/mocks";
import { makeTagHandlers } from "@bsport/api-cdp/tags/mocks";
import { makeUnpaidInvoiceHandlers } from "@bsport/api-financial-services/invoice/mocks";
import { setCurrencyCode, setCurrencyDisplay } from "@bsport/currency";
import { ErrorFallback, Loader } from "@bsport/kaizen-primitive-core";

import { storybookDecorator } from "#src/utils/storybook-decorator";

import { MemberDetail } from "./member-detail";
import { MemberDetailContent } from "./member-detail-content";

const withPanelFrame: Decorator = (Story) => (
  <div className="h-[720px] w-[320px] overflow-hidden border border-stroke-thin border-stroke-weak">
    <Story />
  </div>
);

const meta: Meta<typeof MemberDetail> = {
  title: "Inbox/MemberDetail",
  component: MemberDetail,
  args: { memberId: mockMemberDetail.id },
  render: ({ memberId }) => <MemberDetailStory memberId={memberId} />,
  parameters: {
    layout: "centered",
    msw: {
      handlers: [
        ...makeTagHandlers(),
        ...makeMemberHandlers(),
        ...makeUnpaidInvoiceHandlers({ count: 19 }),
      ],
    },
    docs: {
      description: {
        component:
          "The Inbox right-side member detail panel. Data is loaded through `@bsport/api-cdp/member` and backed by MSW mocks in Storybook.",
      },
    },
  },
  decorators: [withPanelFrame, ...storybookDecorator],
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof MemberDetail>;

export const Default: Story = {};

// Proves the credit account balance is formatted with the active currency
// (resolved by `@bsport/currency` from storage) and is no longer hardcoded to
// EUR. This story-level decorator runs innermost, so it overrides the EUR seed
// from `storybookDecorator` for this story only.
export const UsdCurrency: Story = {
  decorators: [
    (Story) => {
      setCurrencyCode("usd", "session");
      setCurrencyDisplay("$", "session");
      return <Story />;
    },
  ],
};

// Build a birthday whose month/day always equals today's, so the "Today!"
// chip renders deterministically regardless of when the story is viewed.
// (`isTodayMonthDay` compares month + day against `new Date()`.)
const pad = (value: number) => String(value).padStart(2, "0");
const now = new Date();
const todayBirthday = `1990-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

export const BirthdayToday: Story = {
  parameters: {
    msw: {
      handlers: [
        ...makeTagHandlers(),
        ...makeMemberHandlers({
          member: { ...mockMemberDetail, birthday: todayBirthday },
        }),
        ...makeUnpaidInvoiceHandlers({ count: 19 }),
      ],
    },
  },
};

export const NoUnpaidInvoices: Story = {
  args: { memberId: mockMemberDetailWithoutDebt.id },
  parameters: {
    msw: {
      handlers: [
        ...makeTagHandlers(),
        ...makeMemberHandlers({ member: mockMemberDetailWithoutDebt }),
        ...makeUnpaidInvoiceHandlers({ count: 0 }),
      ],
    },
  },
};

// Long, multi-line notes exercise the per-note `line-clamp-2` + "Show more" /
// "Show less" toggle; the private (`highlighted`) note is filtered out.
export const LongNotes: Story = {
  args: { memberId: mockMemberDetailWithLongNotes.id },
  parameters: {
    msw: {
      handlers: [
        ...makeTagHandlers(),
        ...makeMemberHandlers({ member: mockMemberDetailWithLongNotes }),
        ...makeUnpaidInvoiceHandlers({ count: 19 }),
      ],
    },
  },
};

export const NoTagsOrNotes: Story = {
  args: { memberId: mockMemberDetailWithoutTagsOrNotes.id },
  parameters: {
    msw: {
      handlers: [
        ...makeTagHandlers(),
        ...makeMemberHandlers({ member: mockMemberDetailWithoutTagsOrNotes }),
        ...makeUnpaidInvoiceHandlers({ count: 0 }),
      ],
    },
  },
};

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        ...makeTagHandlers(),
        ...makeMemberHandlers({ delayMs: "infinite" }),
        ...makeUnpaidInvoiceHandlers({ count: 19 }),
      ],
    },
  },
};

export const Error: Story = {
  parameters: {
    msw: {
      handlers: [
        ...makeTagHandlers(),
        ...makeMemberHandlers({ errorOnLoad: true }),
        ...makeUnpaidInvoiceHandlers({ count: 19 }),
      ],
    },
  },
};

type MemberDetailStoryProps = {
  memberId: number;
};

function MemberDetailStory({ memberId }: MemberDetailStoryProps) {
  return (
    <StoryErrorBoundary>
      <Suspense
        fallback={
          <div className="flex h-full min-h-[480px] items-center justify-center p-md">
            <Loader size="lg" />
          </div>
        }
      >
        <MemberDetailContent memberId={memberId} />
      </Suspense>
    </StoryErrorBoundary>
  );
}

type StoryErrorBoundaryState = {
  hasError: boolean;
};

class StoryErrorBoundary extends Component<
  PropsWithChildren,
  StoryErrorBoundaryState
> {
  state: StoryErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): StoryErrorBoundaryState {
    return { hasError: true };
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex h-full min-h-[480px] items-center justify-center p-md">
          <ErrorFallback
            title="Couldn't load member"
            subtitle=""
            description=""
          />
        </div>
      );
    }

    return this.props.children;
  }
}
