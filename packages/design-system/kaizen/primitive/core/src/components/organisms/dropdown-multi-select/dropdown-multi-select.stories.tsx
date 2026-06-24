import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps, type ReactNode, useState } from "react";

import type { ChipItem } from "../chip-list";
import { DropdownMultiSelect } from "./dropdown-multi-select";

/**
 * A multi-select dropdown component with support for chips, search, and select-all functionality.
 *
 * Options default to selectable `DropdownMenu.Item` rows. Set `type` to
 * `"divider"`, `"title"`, or `"text"` to mix in non-selectable layout helpers
 * for section headers, separators, or informational rows.
 * <br>
 * <a href="https://docs.infra.bsport.io/docs/kaizen/dev/components/dropdown-multi-select" target="_blank">Kaizen docs</a>
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

type DepartmentOptions = ComponentProps<typeof DropdownMultiSelect>["options"];

const departmentOptions: DepartmentOptions = [
  { type: "title", id: "title-tech", children: "Tech" },
  { id: "design", children: "Design", icon: "pencil-02" },
  { id: "development", children: "Development", icon: "monitor-04" },
  { type: "divider", id: "divider-tech" },
  { type: "title", id: "title-gtm", children: "Go-to-market" },
  { id: "product", children: "Product" },
  { id: "marketing", children: "Marketing" },
  { id: "sales", children: "Sales" },
  { type: "divider", id: "divider-gtm" },
  {
    type: "text",
    id: "info",
    children: "More departments coming soon",
    icon: "info-circle",
  },
];

const mapOptionToChip = (option: {
  id: string;
  children?: ReactNode;
}): ChipItem => ({
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
          options={departmentOptions}
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
