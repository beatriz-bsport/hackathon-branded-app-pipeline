import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import type { RawInboxConversation } from "@bsport/api-cdp/inbox";
import {
  makeInboxHandlers,
  makeInboxSearchHandlers,
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

/** Types a query into the (now enabled) thread-list search field. */
const typeSearch = async (canvasElement: HTMLElement, query: string) => {
  const canvas = within(canvasElement);
  const field = await canvas.findByRole("searchbox", { name: "Search" });
  await userEvent.type(field, query);
};

/**
 * Builds raw conversations with given participant names, so a search story can
 * register a dataset whose names are distinct from the default list feed — the
 * substitute the mock matches on (the real backend also matches email/phone).
 */
const makeNamedConversations = (names: string[]): RawInboxConversation[] =>
  names.map((name, index) => ({
    uuid: `search-conv-${index.toString().padStart(4, "0")}`,
    participants: [{ name, photo: "" }],
    last_message_preview: "Searching…",
    last_message_channel: 0,
    date_created: "2026-05-05T09:00:00.000Z",
    last_inbox_activity_at: "2026-05-05T09:00:00.000Z",
    studio_unread_count: 0,
    has_unresolved_escalation: false,
    ai_enabled: false,
  }));

/**
 * Repeatedly scrolls the virtual list to the bottom until `findRow` resolves —
 * each pass lets the next page load and grow the list. Used to drive search
 * load-more without depending on exact row pixel math.
 */
const scrollUntilVisible = async (
  canvasElement: HTMLElement,
  findRow: () => Promise<HTMLElement>,
): Promise<HTMLElement> => {
  const scroller = canvasElement.querySelector<HTMLElement>(".hide-scrollbar");

  for (let attempt = 0; attempt < 12; attempt += 1) {
    if (scroller) {
      scroller.scrollTop = scroller.scrollHeight;
      scroller.dispatchEvent(new Event("scroll"));
    }
    try {
      return await findRow();
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }

  return findRow();
};

const FIND_TIMEOUT = 5000;

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

// A handful of members whose names are absent from the default list feed, so
// the story can prove the feed was actually replaced by search results.
const SEARCH_RESULT_NAMES = [
  "Bertie Wooster",
  "Reginald Jeeves",
  "Wooster Cousin",
];

export const SearchResults: Story = {
  parameters: {
    msw: {
      handlers: [
        ...makeInboxHandlers(),
        ...makeInboxSearchHandlers({
          dataset: makeNamedConversations(SEARCH_RESULT_NAMES),
        }),
      ],
    },
    docs: {
      description: {
        story:
          "Types a member name into the search field. After the debounce, the conversation feed is replaced by matches from the dedicated search endpoint (matched here by a minimal name-substring mock). Clearing the field returns to the normal feed.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await typeSearch(canvasElement, "Wooster");

    // The search results (absent from the default feed) replace the list.
    expect(
      await canvas.findByText("Bertie Wooster", {}, { timeout: FIND_TIMEOUT }),
    ).toBeInTheDocument();
    expect(await canvas.findByText("Wooster Cousin")).toBeInTheDocument();
  },
};

// 45 matches → 3 pages at the backend default page size of 20, so the story
// exercises page-number load-more across more than one page.
const SEARCH_LOAD_MORE_NAMES = Array.from(
  { length: 45 },
  (_, index) => `Searchmatch ${(index + 1).toString().padStart(2, "0")}`,
);

export const SearchLoadMore: Story = {
  parameters: {
    msw: {
      handlers: [
        ...makeInboxHandlers(),
        ...makeInboxSearchHandlers({
          dataset: makeNamedConversations(SEARCH_LOAD_MORE_NAMES),
          delayMs: 0,
        }),
      ],
    },
    docs: {
      description: {
        story:
          "A search that matches more results than fit on one page. Scrolling to the bottom loads the next page; here the play function scrolls until a third-page match (`Searchmatch 45`) renders, proving page-number load-more works for search.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await typeSearch(canvasElement, "Searchmatch");

    // First page renders.
    expect(
      await canvas.findByText("Searchmatch 01", {}, { timeout: FIND_TIMEOUT }),
    ).toBeInTheDocument();

    // Scrolling pulls later pages until the last match shows up.
    const lastMatch = await scrollUntilVisible(canvasElement, () =>
      canvas.findByText("Searchmatch 45", {}, { timeout: 500 }),
    );
    expect(lastMatch).toBeInTheDocument();
  },
};

export const SearchNoResults: Story = {
  parameters: {
    // Default list dataset + default search dataset; the query below matches no
    // participant name, so the search endpoint returns zero results.
    msw: {
      handlers: [...makeInboxHandlers(), ...makeInboxSearchHandlers()],
    },
    docs: {
      description: {
        story:
          "A search that matches nothing shows the search-specific empty state (\"No conversations match your search\") — distinct from the generic 'No conversations' placeholder shown when the studio has no conversations and no active search.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await typeSearch(canvasElement, "Zzzzznomatch");

    expect(
      await canvas.findByText(
        "No conversations match your search",
        {},
        { timeout: FIND_TIMEOUT },
      ),
    ).toBeInTheDocument();
  },
};
