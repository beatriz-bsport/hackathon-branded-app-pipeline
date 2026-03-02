import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";

import {
  INVOICE_ITEMS_KINDS,
  type InvoiceItemKind,
  ItemTypeSelector,
} from "./item-type-selector.component";

type ItemTypeSelectorComponent = typeof ItemTypeSelector;

const metaComponentDescription = `
**ItemTypeSelector** lets users choose the type of buyable item (Pass, Appointment Pass, Products, Pack, Gift Card, Subscription)
when that type is required by the flow.

### Business Context

Use it wherever you need to **pick an item type** before searching or adding items (e.g. when adding items to an invoice in \`Core/CheckoutFlowModal\`).<br/>
No API calls are required; it is a presentational component that manages selection state.

### How to import?

\`\`\`tsx
import {
  INVOICE_ITEMS_KINDS,
  ItemTypeSelector,
} from "@bsport/kaizen-business-components/buyables/item-type-selector";
\`\`\`
`;

const metaSourceCode = `
import {
  INVOICE_ITEMS_KINDS,
  ItemTypeSelector,
} from "@bsport/kaizen-business-components/buyables/item-type-selector";

// Controlled
<ItemTypeSelector
  label="Item Type"
  value={selectedType}
  onSelect={setSelectedType}
/>

// Uncontrolled
<ItemTypeSelector
  defaultValue={INVOICE_ITEMS_KINDS.pass}
  onSelect={(type) => console.log(type)}
/>
`;

const meta: Meta<ItemTypeSelectorComponent> = {
  component: ItemTypeSelector,
  title: "Buyables/ItemTypeSelector",
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
  decorators: [
    (Story) => (
      <div style={{ width: "500px" }}>
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    value: {
      control: "select",
      options: [undefined, ...Object.keys(INVOICE_ITEMS_KINDS)],
    },
    defaultValue: {
      control: "select",
      options: Object.keys(INVOICE_ITEMS_KINDS),
    },
    onSelect: { table: { type: { summary: "function" } } },
  },
  args: {
    label: "Item Type",
    value: undefined,
    defaultValue: INVOICE_ITEMS_KINDS.pass,
  },
  render: (args) => {
    const initialValue =
      args.value ?? args.defaultValue ?? INVOICE_ITEMS_KINDS.pass;
    const [selectedType, setSelectedType] =
      useState<InvoiceItemKind>(initialValue);

    useEffect(() => {
      const newValue =
        args.value ?? args.defaultValue ?? INVOICE_ITEMS_KINDS.pass;
      setSelectedType(newValue);
    }, [args.value, args.defaultValue]);

    return (
      <ItemTypeSelector
        {...args}
        value={selectedType}
        onSelect={setSelectedType}
      />
    );
  },
};

export default meta;

// Default - Inherit configuration from the meta object.
// Goal: Manipulate the story.
export const Default: StoryObj<ItemTypeSelectorComponent> = {};

// Documentation - Inherit configuration from the meta object.
// Goal: Add story description to dive into implementation details.
export const Documentation: StoryObj<ItemTypeSelectorComponent> = {
  parameters: {
    docs: {
      description: {
        story: `
### Requirements

- No API calls. Presentational component only.

---

### Controlled vs uncontrolled

- **Controlled**: Pass \`value\` and \`onSelect\` to control the selected type from the parent.
- **Uncontrolled**: Omit \`value\` and use \`defaultValue\` to set the initial selection; \`onSelect\` still receives changes.

---

### Required props

None. \`onSelect\` is optional but typically used to react to selection.

### Optional props

| Prop | Description |
|------|-------------|
| \`label\` | Label shown above the button group |
| \`value\` | Controlled selected type (\`InvoiceItemKind\`) |
| \`defaultValue\` | Initial type when uncontrolled |
| \`onSelect\` | Callback when a type is selected |
        `,
      },
    },
  },
};
