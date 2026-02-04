import type { Meta, StoryObj } from "@storybook/react-vite";

import Alert, { layouts, statuses, types } from "./Alert";

/**
 * The Alert component is a visual element that is used to convey important information to users.
 * It can be used to display info, warnings, errors, or success messages.<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=382-8381" target="_blank">Figma</a><br>
 * <a href="https://bsport.supernova-docs.io/latest/components/button/component-overview-CR89OIn0" target="_blank">Supernova docs</a>
 */
const meta: Meta<typeof Alert> = {
  component: Alert,
  argTypes: {
    status: {
      options: statuses,
      control: { type: "select" },
      table: { type: { summary: "string" } },
    },
    type: {
      options: types,
      control: { type: "inline-radio" },
      table: { type: { summary: "string" } },
    },
    title: {
      control: { type: "text" },
    },
    buttonLabel: {
      control: { type: "text" },
    },
    children: {
      table: { type: { summary: "ReactNode" } },
    },
    layout: {
      options: layouts,
      control: { type: "inline-radio" },
      table: { type: { summary: "string" } },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Alert>;

export const Primary: Story = {
  name: "Alert",
  args: {
    status: "default",
    type: "weak",
    title: "Title of this alert",
    buttonLabel: "Assign",
    onClearClick: () => console.log("Click close"),
    onButtonClick: () => console.log("Click button"),
    children:
      "Lorem ipsum dolor sit amet consectetur. Elementum mauris eget donec adipiscing morbi orci. In cursus urna morbi platea ullamcorper hendrerit. Adipiscing dolor tincidunt purus velit mattis. Vulputate risus massa nascetur at id est vitae feugiat.",
    layout: "banner",
  },
};

export const NoTitleShortChildren: Story = {
  name: "Alert without title and short children",
  args: {
    status: "warning",
    type: "weak",
    children:
      "Lorem mattis. Vulputate risus massa nascetur at id est vitae feugiat.",
    layout: "banner",
  },
};

export const InlineLayout: Story = {
  name: "Alert with title and short children and inline layout",
  args: {
    status: "default",
    type: "weak",
    title: "Title of this alert",
    children:
      "Lorem mattis. Vulputate risus massa nascetur at id est vitae feugiat.",
    layout: "inline",
  },
};

export const NoTitleShortChildrenWithButtons: Story = {
  name: "Alert without title and short children and with buttons",
  args: {
    status: "default",
    type: "weak",
    children:
      "Lorem mattis. Vulputate risus massa nascetur at id est vitae feugiat.",
    buttonLabel: "Click me",
    onClearClick: () => console.log("Click close"),
    onButtonClick: () => console.log("Click button"),
    layout: "banner",
  },
};

export const NoTitleLongChildren: Story = {
  name: "Alert without title and long children",
  args: {
    status: "critical",
    type: "weak",
    children:
      "Lorem ipsum dolor sit amet consectetur. Elementum mauris eget donec adipiscing morbi orci. In cursus urna morbi platea ullamcorper hendrerit. Adipiscing dolor tincidunt purus velit mattis. Vulputate risus massa nascetur at id est vitae feugiat",
    layout: "banner",
  },
};

export const TitleNoChildren: Story = {
  name: "Alert with only a title",
  args: {
    status: "positive",
    type: "weak",
    title:
      "Lorem mattis. Vulputate risus massa nascetur at id est vitae feugiat.",
    layout: "banner",
  },
};
