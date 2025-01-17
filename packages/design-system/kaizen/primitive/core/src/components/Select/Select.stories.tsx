import type { Meta, StoryObj } from "@storybook/react";
import Select, { statuses } from "./Select";
import { icons } from "#src/components/Icon";

/**
 * A custom select component that displays a button which, when clicked or activated via a keyboard,<br>
 * reveals a popover with selectable options. This component supports various visual states and integrates<br>
 * well with forms by allowing submission of the selected value.<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=331-23641" target="_blank">Figma</a><br>
 */
const meta: Meta<typeof Select> = {
  component: Select,
  argTypes: {
    label: {
      control: { type: "text" },
    },
    status: {
      options: Object.keys(statuses),
      control: { type: "select" },
      table: { defaultValue: { summary: "default" } },
    },
    items: {
      table: {
        type: {
          summary: "(TitleItem | DividerItem | MenuOption)[]",
        },
      },
    },
    iconLeft: {
      options: [undefined, ...Object.keys(icons)],
      control: { type: "select" },
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "undefined" },
      },
    },
    disabled: {
      control: { type: "boolean" },
    },
    onSelect: {
      table: { type: { summary: "function" } },
    },
  },
  parameters: {
    docs: {
      story: {
        height: "30vh",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Primary: Story = {
  name: "Select",
  args: {
    id: "select-1",
    name: "select-1",
    status: "default",
    label: "Select an option",
    items: [
      { id: "option-1", label: "Option 1" },
      { id: "option-2", label: "Option 2" },
      { id: "option-3", label: "Option 3" },
    ],
    iconLeft: "arrow-right",
    disabled: false,
    onSelect: (option) => console.log(`Selected option: ${option}`),
  },
};
