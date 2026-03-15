import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useState } from "react";
import { Result } from "typescript-result";

import type { MenuOptionWithColor } from "@bsport/kaizen-primitive-core";

import { BackendSelector } from "./backend-selector.component";
import type { BackendSelectorProps } from "./backend-selector.component";

type BackendSelectorComponent = typeof BackendSelector;

/** Props for the mock wrapper: all BackendSelector props except storeConfig */
type BackendSelectorStoryProps = Omit<
  BackendSelectorProps<Record<string, unknown>, MockItem>,
  "storeConfig"
>;

/** Mock item shape matching SearchResultItem for story data */
type MockItem = {
  id: number;
  title: string;
  subject?: string;
};

const MOCK_ITEMS: MockItem[] = [
  { id: 1, title: "Yoga Basics", subject: "Introduction to yoga" },
  { id: 2, title: "Pilates Core", subject: "Core strengthening" },
  { id: 3, title: "HIIT Training", subject: "High intensity workout" },
  { id: 4, title: "Swimming Lessons", subject: "Beginner to advanced" },
  { id: 5, title: "Boxing Fundamentals", subject: "Boxing techniques" },
  { id: 6, title: "Meditation & Mindfulness", subject: "Relaxation" },
  { id: 7, title: "CrossFit Intro", subject: "CrossFit basics" },
  { id: 8, title: "Running Club", subject: "Endurance training" },
];

const MOCK_SEARCH_DELAY_MS = 400;

function createMockSearchFn(
  setData: (items: MockItem[]) => void,
): BackendSelectorProps<
  Record<string, unknown>,
  MockItem
>["storeConfig"]["searchFn"] {
  return (query: string, params?: { id__in?: string }) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let items: MockItem[];
        if (params?.id__in) {
          const ids = params.id__in
            .split(",")
            .map((id) => parseInt(id.trim(), 10));
          items = MOCK_ITEMS.filter((item) => ids.includes(item.id));
        } else if (query.trim()) {
          const lower = query.toLowerCase();
          items = MOCK_ITEMS.filter((item) =>
            item.title.toLowerCase().includes(lower),
          );
        } else {
          items = [...MOCK_ITEMS];
        }
        setData(items);
        resolve(Result.ok(items));
      }, MOCK_SEARCH_DELAY_MS);
    });
  };
}

/** Wrapper that holds mock "store" state and provides storeConfig for BackendSelector */
function BackendSelectorWithMockData(props: BackendSelectorStoryProps) {
  const [data, setData] = useState<MockItem[]>([]);
  const searchFn = useCallback(createMockSearchFn(setData), []);
  const storeConfig = {
    searchFn,
    data,
  };
  return (
    <BackendSelector<Record<string, unknown>, MockItem>
      {...props}
      storeConfig={storeConfig}
    />
  );
}

const metaComponentDescription = `
**BackendSelector** is a generic backend-driven autocomplete that displays options from a store and triggers search via a configurable \`searchFn\`.

The host app is responsible for:
- Providing \`storeConfig.data\` (e.g. from a Zustand store or React state)
- Providing \`storeConfig.searchFn\` that performs the API/search and updates the data source
- Optionally formatting results with \`optionsFormatter\`, pre-selecting with \`defaultValues\`, and using single or multi select

### When to use

- Use when you need a searchable selector whose options come from an API or store
- The component handles debounced search, loading state, and optional hydration of default values via \`id__in\`
`;

const metaSourceCode = `
import { BackendSelector } from "@bsport/kaizen-business-components/form/backend-selector";

// In your app: wire storeConfig to your store and search API
<BackendSelector<YourParams, YourResult>
  storeConfig={{
    searchFn: (query, params) => yourSearchApi(query, params),
    data: yourStoreData,
  }}
  textfieldProps={{ label: "Select item", placeholder: "Search..." }}
  onSelect={(id) => console.log("Selected", id)}
/>
`;

const meta: Meta<BackendSelectorComponent> = {
  component: BackendSelector,
  title: "Form/BackendSelector",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: metaComponentDescription,
      },
      source: {
        code: metaSourceCode,
      },
    },
  },
  render: (args) => {
    const { storeConfig: _storeConfig, ...rest } = args as BackendSelectorProps<
      Record<string, unknown>,
      MockItem
    >;
    return (
      <BackendSelectorWithMockData
        {...rest}
        textfieldProps={{
          id: "backend-selector-story",
          label: "Select an item",
          placeholder: "Search by name...",
          ...rest.textfieldProps,
        }}
        onSelect={(value) => {
          args.onSelect?.(value);
          console.log("Selected", value);
        }}
      />
    );
  },
  tags: ["autodocs"],
};

export default meta;

export const Default: StoryObj<BackendSelectorComponent> = {};

export const MultiSelect: StoryObj<BackendSelectorComponent> = {
  render: (args) => {
    const { storeConfig: _storeConfig, ...rest } = args as BackendSelectorProps<
      Record<string, unknown>,
      MockItem
    >;
    return (
      <BackendSelectorWithMockData
        {...rest}
        multiSelect
        textfieldProps={{
          id: "backend-selector-multi",
          label: "Select items",
          placeholder: "Search and select multiple...",
          ...rest.textfieldProps,
        }}
        onSelect={(value) => {
          args.onSelect?.(value);
          console.log("Selected", value);
        }}
      />
    );
  },
};

export const WithDefaultValues: StoryObj<BackendSelectorComponent> = {
  render: (args) => {
    const { storeConfig: _storeConfig, ...rest } = args as BackendSelectorProps<
      Record<string, unknown>,
      MockItem
    >;
    return (
      <BackendSelectorWithMockData
        {...rest}
        defaultValues={["1", "3"]}
        textfieldProps={{
          id: "backend-selector-defaults",
          label: "Item (pre-selected)",
          placeholder: "Search...",
          ...rest.textfieldProps,
        }}
        onSelect={(value) => {
          args.onSelect?.(value);
          console.log("Selected", value);
        }}
      />
    );
  },
};

export const WithOptionFormatter: StoryObj<BackendSelectorComponent> = {
  render: (args) => {
    const optionsFormatter = (
      results: MockItem[],
    ): { title: string; options: MenuOptionWithColor[] }[] => {
      const byCategory = results.reduce<
        Array<{ title: string; options: MenuOptionWithColor[] }>
      >((acc, item) => {
        const category = item.id <= 4 ? "Fitness" : "Wellness";
        let group = acc.find((g) => g.title === category);
        if (!group) {
          group = { title: category, options: [] };
          acc.push(group);
        }
        group.options.push({
          id: item.id.toString(),
          label: item.title,
          description: item.subject,
        });
        return acc;
      }, []);
      return byCategory.map((g) => ({
        ...g,
        title: `${g.title} (${g.options.length})`,
      }));
    };
    const { storeConfig: _storeConfig, ...rest } = args as BackendSelectorProps<
      Record<string, unknown>,
      MockItem
    >;
    return (
      <BackendSelectorWithMockData
        {...rest}
        optionsFormatter={optionsFormatter}
        textfieldProps={{
          id: "backend-selector-formatter",
          label: "Select (grouped)",
          placeholder: "Search...",
          ...rest.textfieldProps,
        }}
        onSelect={(value) => {
          args.onSelect?.(value);
          console.log("Selected", value);
        }}
      />
    );
  },
};

export const Documentation: StoryObj<BackendSelectorComponent> = {
  parameters: {
    docs: {
      description: {
        story: `
### Usage contract

**Required**

| Prop | Description |
|------|-------------|
| \`storeConfig\` | Configuration for data and search |
| \`storeConfig.searchFn\` | \`(query, params?) => Promise<Result<unknown, unknown>>\`. Called on mount and when the user types. The host app must update the data source (e.g. store) when the promise resolves; the component reads from \`storeConfig.data\`. For default values hydration, \`params.id__in\` may be provided (comma-separated IDs). |
| \`storeConfig.data\` | Array of results from your store/state. Displayed and filtered (if \`filterFn\` is provided) by the component. |

**Optional**

| Prop | Description |
|------|-------------|
| \`optionsFormatter\` | \`(results) => AutocompleteItems\`. Transform results into flat or grouped autocomplete items (id, label, description). If omitted, a default formatter uses \`id\`, \`title\`/\`name\`, \`subject\`/\`description\`. |
| \`textfieldProps\` | Props for the underlying text field (label, placeholder, iconLeft, etc.). |
| \`loadingMessage\` | Message shown while \`searchFn\` is in progress. |
| \`defaultValues\` | Pre-selected item IDs (e.g. \`["1", "2"]\`). Triggers an initial \`searchFn("", { id__in: "1,2" })\` so the component can resolve labels. |
| \`disabled\` | Disables the input. |
| \`className\` | CSS class for the root. |
| \`onSelect\` | \`(selectedId: string \\| string[]) => void\`. Fired when selection changes. |
| \`onClear\` | Fired when the clear action is used. |
| \`multiSelect\` | If \`true\`, allows selecting multiple items. |
        `,
      },
    },
  },
};
