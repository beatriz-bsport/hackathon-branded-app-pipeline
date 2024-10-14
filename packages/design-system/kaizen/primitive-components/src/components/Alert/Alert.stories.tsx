import type { Meta, StoryObj } from "@storybook/react";
import Alert, { statuses } from "./Alert";

const meta: Meta<typeof Alert> = {
  component: Alert,
  argTypes: {
    status: {
      options: Object.keys(statuses),
      control: { type: "select" },
      table: { required: true },
    },
    title: {
      control: { type: "text" },
    },
    buttonLabel: {
      control: { type: "text" },
    },
    isClearable: {
      control: { type: "boolean" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Alert>;

export const Primary: Story = {
  name: "Alert",
  args: {
    title: "Title of this alert",
    children:
      "Lorem ipsum dolor sit amet consectetur. Elementum mauris eget donec adipiscing morbi orci. In cursus urna morbi platea ullamcorper hendrerit. Adipiscing dolor tincidunt purus velit mattis. Vulputate risus massa nascetur at id est vitae feugiat.",
    onClearClick: () => {
      console.log("Click close");
    },
    isClearable: true,
    buttonLabel: "Assign",
    status: "default",
  },
};
