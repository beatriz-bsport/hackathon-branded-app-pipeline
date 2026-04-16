import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import type { DropdownMenuItemProps } from "#src/components/DropdownMenu";

import type { ChipItem } from "../chip-list";
import { DropdownMultiSelect } from "./dropdown-multi-select";

/**
 * A multi-select dropdown component with support for chips, search, and select-all functionality.
 */
const meta: Meta<typeof DropdownMultiSelect> = {
  component: DropdownMultiSelect,
  argTypes: {
    label: { control: "text" },
    anchorLabel: { control: "text" },
    withSearch: { control: "boolean" },
    withChips: { control: "boolean" },
    withSelectAll: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    status: {
      options: ["default", "error", "positive"],
      control: { type: "inline-radio" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof DropdownMultiSelect>;

const basicOptions: DropdownMenuItemProps[] = [
  { id: "design", children: "Design" },
  { id: "development", children: "Development" },
  { id: "product", children: "Product" },
  { id: "marketing", children: "Marketing" },
  { id: "sales", children: "Sales" },
];

const mapOptionToChip = (option: DropdownMenuItemProps): ChipItem => ({
  id: option.id,
  label: option.children?.toString() || "",
  color: "main",
  size: "lg",
  type: "weak",
});

export const Primary: Story = {
  name: "DropdownMultiSelect",
  render: (args) => {
    const [value, setValue] = useState<string[]>(["design", "product"]);
    return (
      <div style={{ maxWidth: "400px" }}>
        <DropdownMultiSelect
          {...args}
          value={value}
          onChange={setValue}
          options={basicOptions}
          mapOptionToChip={mapOptionToChip}
        />
      </div>
    );
  },
  args: {
    label: "Select Departments",
    anchorLabel: "Select...",
    withSearch: true,
    withChips: true,
    withSelectAll: true,
    disabled: false,
    required: false,
    status: "default",
    statusText: "",
  },
};
