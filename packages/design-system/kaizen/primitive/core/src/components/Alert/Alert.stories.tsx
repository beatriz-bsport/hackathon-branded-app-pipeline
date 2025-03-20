import type { Meta, StoryObj } from "@storybook/react";
import Alert, { statuses, types } from "./Alert";

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
  },
};
