import type { Meta, StoryObj } from "@storybook/react";
import Tabs, { orientations } from "./Tabs";

/**
 * A component that renders a set of tabs.<br>
 * One tab is composed of a unique label and reprensented by an anchor tag that may be used to navigate to another page.<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=1186-12365" target="_blank">Figma</a><br>
 */
const meta: Meta<typeof Tabs> = {
  component: Tabs,
  argTypes: {
    tabs: {
      control: { type: "object" },
      table: {
        type: {
          summary: "array",
          detail:
            "[{label: string, href?: string, target?: string, disabled?: boolean, icon?: string}]",
        },
      },
    },
    orientation: {
      options: Object.keys(orientations),
      control: { type: "inline-radio" },
      table: { type: { summary: "string" } },
    },
    defaultValue: {
      control: { type: "text" },
    },
    value: {
      control: { type: "text" },
    },
    onValueChange: {
      table: { type: { summary: "function" } },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Tabs>;

export const Primary: Story = {
  name: "Tabs",
  args: {
    tabs: [
      {
        label: "Tab 1",
        href: "#",
        target: "_self",
        disabled: false,
        icon: "arrow-right",
      },
      {
        label: "Tab 2",
        disabled: false,
        icon: "message-question-square",
      },
      {
        label: "Tab 3",
        disabled: false,
        icon: "message-alert-square",
      },
      {
        label: "Tab 4",
        disabled: false,
      },
      {
        label: "Tab disabled",
        disabled: true,
      },
    ],
    orientation: "vertical",
    defaultValue: "Tab 2",
    value: "",
    onValueChange: undefined,
  },
};
