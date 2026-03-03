import type { Meta, StoryObj } from "@storybook/react-vite";

import { getFetch } from "@bsport/fetch";

import {
  ITEM_AUTOCOMPLETE_ITEM_KINDS,
  ItemAutocomplete,
} from "./item-autocomplete";

const fetch = getFetch();

type ItemAutocompleteComponent = typeof ItemAutocomplete;

const metaComponentDescription = `
**ItemAutocomplete** is a business component that wraps a remote-search \`Autocomplete\` for searching and selecting buyable items
(passes, appointment passes, products, packs, gift cards) when you know the item type.

### Business Context

Use it wherever you need to **search items by type**, for example:
- Searching and selecting a pass, product, pack, or gift card (e.g. when adding items to an invoice in \`Core/CheckoutFlowModal\`).
- Displaying item type, title, price, and optional image in the dropdown.
- Opening the selected item in a new tab via the share button.

It requires a \`fetch\` function and \`itemType\` to know which buyable API to query. Results are loaded via React Query.

### How to import?

\`\`\`tsx
import { 
  ItemAutocomplete,
  ITEM_AUTOCOMPLETE_ITEM_KINDS,
} from "@bsport/kaizen-business-components/buyables/item-autocomplete";
\`\`\`
`;

const metaSourceCode = `
import {
  ItemAutocomplete,
  ITEM_AUTOCOMPLETE_ITEM_KINDS,
} from "@bsport/kaizen-business-components/buyables/item-autocomplete";

<ItemAutocomplete
  fetch={fetch}
  itemType={ITEM_AUTOCOMPLETE_ITEM_KINDS.pass}
  textfieldProps={{
    label: "Item",
    placeholder: "Search an item...",
  }}
  onSelect={(itemId) => console.log(itemId)}
/>
`;

const meta: Meta<ItemAutocompleteComponent> = {
  component: ItemAutocomplete,
  title: "Buyables/ItemAutocomplete",
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
  decorators: [(Story) => <Story />],
  argTypes: {
    itemType: {
      control: { type: "select" },
      options: Object.keys(ITEM_AUTOCOMPLETE_ITEM_KINDS),
    },
  },
  args: {
    fetch,
    itemType: ITEM_AUTOCOMPLETE_ITEM_KINDS.pass,
    textfieldProps: {
      label: "Item",
      placeholder: "Search an item...",
    },
  },
  tags: ["autodocs"],
};

export default meta;

// Default - Inherit configuration from the meta object.
// Goal: Manipulate the story.
export const Default: StoryObj<ItemAutocompleteComponent> = {};

// Documentation - Inherit configuration from the meta object.
// Goal: Add story description to dive into implementation details.
export const Documentation: StoryObj<ItemAutocompleteComponent> = {
  parameters: {
    docs: {
      description: {
        story: `
### Requirements

- \`fetch\` (injected from host app)
- \`@tanstack/react-query\` (QueryClientProvider must wrap the component)
- \`itemType\` must be one of \`ITEM_AUTOCOMPLETE_ITEM_KINDS\` (pass, appointment_pass, product, pack, giftcard)

---

### Required props

| Prop | Description |
|------|-------------|
| \`fetch\` | Fetch function for API calls |
| \`itemType\` | Kind of buyable to search (pass, appointment_pass, product, pack, giftcard) |

---

### Optional props

| Prop | Description |
|------|-------------|
| \`textfieldProps\` | Props passed to the inner Autocomplete text field (label, placeholder, etc.) |
| \`selectedItemId\` | Controlled selected item ID |
| \`onSelect\` | Callback when an item is selected |
| \`onValueChange\` | Callback when the search input value changes |
        `,
      },
    },
  },
};
