import type { Meta, StoryObj } from "@storybook/react-vite";

import { icons } from "#src/components/Icon";

import Button, { colorsByIntent, intents, sizes } from "./Button";

/**
 * React component implementing all the types of buttons used in Kaizen.<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Proto-designSystem?node-id=218-12159" target="_blank">Figma</a><br>
 * <a href="https://docs.infra.bsport.io/docs/kaizen/dev/components/button" target="_blank">Kaizen docs</a>
 */
const meta: Meta<typeof Button> = {
  component: Button,
  argTypes: {
    label: {
      control: { type: "text" },
      type: { name: "string", required: true },
    },
    kind: {
      options: ["default", "icon-button"],
      control: { type: "inline-radio" },
      table: { defaultValue: { summary: "default" } },
    },
    intent: {
      options: Object.keys(intents),
      control: { type: "inline-radio" },
      type: { name: "string", required: true },
    },
    color: {
      options: Object.values(colorsByIntent).flat(),
      control: { type: "select" },
      type: { name: "string", required: true },
    },
    size: {
      options: Object.keys(sizes),
      control: { type: "inline-radio" },
      table: { type: { summary: "string" }, defaultValue: { summary: "md" } },
      type: { name: "string", required: true },
    },
    disabled: {
      control: { type: "boolean" },
      table: { defaultValue: { summary: "false" } },
    },
    loading: {
      control: { type: "boolean" },
      table: { defaultValue: { summary: "false" } },
    },
    icon: {
      options: [undefined, ...Object.keys(icons)],
      control: { type: "select" },
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "undefined" },
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
    iconRight: {
      options: [undefined, ...Object.keys(icons)],
      control: { type: "select" },
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "undefined" },
      },
    },
    fullWidth: {
      control: { type: "boolean" },
      table: { defaultValue: { summary: "false" } },
    },
    href: {
      control: { type: "text" },
      description:
        "When set, renders an `<a>` element instead of `<button>`. `disabled`, and `loading` are ignored on link buttons.",
      table: { defaultValue: { summary: "undefined" } },
      type: { name: "string", required: false },
    },
    target: {
      control: { type: "text" },
      description:
        'HTML `target` attribute for the `<a>` element. `rel="noopener noreferrer"` is injected automatically when set to `"_blank"`.',
      table: { defaultValue: { summary: "undefined" } },
      type: { name: "string", required: false },
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

export const IconButton: Story = {
  name: "Icon Button",
  args: {
    kind: "icon-button",
    label: "Close dialog",
    icon: "x-close",
    intent: "flat",
    color: "default",
    size: "md",
    disabled: false,
    loading: false,
    fullWidth: false,
  },
};

export const LinkButton: Story = {
  name: "Link Button",
  args: {
    label: "Open documentation",
    href: "https://example.com",
    target: "_blank",
    intent: "default",
    color: "main",
    size: "md",
    iconRight: "arrow-right",
    fullWidth: false,
  },
};
