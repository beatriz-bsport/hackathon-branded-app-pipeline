import type { Meta, StoryObj } from "@storybook/react-vite";

import { icons } from "#src/components/Icon";

import Avatar, { sizes } from "./Avatar";
import AvatarImage from "./assets/avatar.jpeg";

/**
 * A component that displays an avatar, which can be an image or an icon.<br>
 * It allows to customize the size and shape of the avatar.<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=686-3148" target="_blank">Figma</a><br>
 * <a href="https://bsport.supernova-docs.io/latest/components/avatar/alert/component-overview-7HykSjhv" target="_blank">Supernova docs</a>
 */
const meta: Meta<typeof Avatar> = {
  component: Avatar,
  argTypes: {
    src: {
      options: ["none", "avatar image"],
      control: { type: "inline-radio" },
      mapping: {
        none: undefined,
        "avatar image": AvatarImage,
      },
    },
    size: {
      options: Object.keys(sizes),
      control: { type: "inline-radio" },
      table: { type: { summary: "string" } },
    },
    shape: {
      options: ["squared", "round"],
      control: { type: "select" },
      table: { type: { summary: "string" } },
    },
    onClick: {
      table: { type: { summary: "function" } },
    },
    iconName: {
      options: [undefined, ...Object.keys(icons)],
      control: { type: "select" },
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "undefined" },
      },
    },
    actionableIconName: {
      options: [undefined, ...Object.keys(icons)],
      control: { type: "select" },
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "undefined" },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Avatar>;

export const AvatarWithImage: Story = {
  name: "Avatar with image",
  args: {
    src: "avatar image",
    alt: "Avatar default image",
    initials: "BB",
    size: "md",
    shape: "squared",
    onClick: () => console.log("Avatar clicked"),
    children: "empty",
  },
};

export const AvatarWithIcon: Story = {
  name: "Avatar with icon from name",
  args: {
    size: "md",
    shape: "round",
    initials: "BB",
    iconName: "filter-lines",
    children: "empty",
  },
};

export const AvatarWithChildrenIcon: Story = {
  name: "Avatar with icon from children",
  args: {
    size: "md",
    shape: "squared",
    children: "icon",
  },
};

export const AvatarWithChildrenInitials: Story = {
  name: "Avatar with initials",
  args: {
    size: "md",
    shape: "squared",
    initials: "FR",
  },
};
