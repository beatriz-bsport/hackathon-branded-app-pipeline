import type { Meta, StoryObj } from "@storybook/react";
import { icons } from "../Icon";
import Button, { intents, colorsByIntent, sizes } from "./Button";
import { removeStorybookDocgens } from "./utils";

const meta: Meta<typeof Button> = {
  component: Button,
  argTypes: {
    label: {
      control: { type: "text" },
      table: { defaultValue: { summary: '""' } },
    },
    intent: {
      options: Object.keys(intents),
      control: { type: "inline-radio" },
      table: { requide: true },
    },
    size: {
      options: Object.keys(sizes),
      control: { type: "inline-radio" },
      table: { defaultValue: { summary: "md" } },
    },
    iconLeft: {
      options: [undefined, ...removeStorybookDocgens(Object.keys(icons))],
      control: { type: "select" },
      table: { defaultValue: { summary: "undefined" } },
    },
    iconRight: {
      options: [undefined, ...removeStorybookDocgens(Object.keys(icons))],
      control: { type: "select" },
      table: { defaultValue: { summary: "undefined" } },
    },
    color: {
      options: removeStorybookDocgens(Object.values(colorsByIntent).flat()),
      control: { type: "select" },
    },
    disabled: {
      control: { type: "boolean" },
      table: { defaultValue: { summary: "false" } },
    },
    loading: {
      control: { type: "boolean" },
      table: { defaultValue: { summary: "false" } },
    },
    fullWidth: {
      control: { type: "boolean" },
      table: { defaultValue: { summary: "false" } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  name: "Button",
  args: {
    label: "Add something",
    intent: "call-to-action",
    color: "main",
    size: "md",
    disabled: false,
    loading: false,
    iconLeft: "arrow-right",
    iconRight: undefined,
    fullWidth: false,
  },
};
