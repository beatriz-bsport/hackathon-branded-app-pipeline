import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";

import ItemTypeSelector, {
  INVOICE_ITEMS_KINDS,
  type InvoiceItemKind,
} from "./ItemTypeSelector";

/**
 * ItemTypeSelector allows users to select the type of item to add to an invoice in the billing flow.
 *
 * **Business Logic**: This component is used within the BillingFlowModal to let users choose between different invoice item types (Pass, Appointment Pass, Products, Pack, Gift Card, Subscription) before adding items to an invoice.
 *
 * **Business Context**: Used in the billing flow when creating or editing invoices, specifically within the BillingFlowModal component.
 *
 * **Requirements**: No API calls required. This is a presentational component that manages selection state.
 *
 * **Usage Example**:
 * ```
 * <ItemTypeSelector
 *   label="Item Type"
 *   value={selectedType}
 *   onSelect={setSelectedType}
 * />
 * ```
 *
 * **Related Components**: Used within `BillingFlowModal` business component.
 */
const meta: Meta<typeof ItemTypeSelector> = {
  component: ItemTypeSelector,
  title: "billing/ItemTypeSelector",
  parameters: { layout: "centered" },
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
};

export default meta;
type Story = StoryObj<typeof ItemTypeSelector>;

export const Default: Story = {
  name: "ItemTypeSelector",
  render: (args) => {
    // Use value if provided (controlled), otherwise use defaultValue as initial state
    const initialValue =
      args.value ?? args.defaultValue ?? INVOICE_ITEMS_KINDS.pass;
    const [selectedType, setSelectedType] =
      useState<InvoiceItemKind>(initialValue);

    // Sync state when value or defaultValue changes in Storybook controls
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
