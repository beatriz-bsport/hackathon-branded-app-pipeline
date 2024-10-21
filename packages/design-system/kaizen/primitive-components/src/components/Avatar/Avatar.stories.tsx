import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Avatar, { sizes } from "./Avatar";
import AvatarImage from "./assets/avatar.jpeg";
import Icon from "../Icon";

const meta: Meta<typeof Avatar> = {
  component: Avatar,
  argTypes: {
    src: {
      control: { type: "text" },
    },
    size: {
      options: Object.keys(sizes),
      control: { type: "inline-radio" },
    },
    shape: {
      options: ["squared", "round"],
      control: { type: "select" },
    },
    children: {
      options: ["empty", "icon", "initials"],
      control: { type: "select" },
      mapping: {
        empty: [],
        icon: <Icon icon="save" />,
        initials: "FR",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Avatar>;

export const Primary: Story = {
  name: "Avatar",
  args: {
    src: AvatarImage,
    alt: "Avatar default image",
    size: "md",
    shape: "squared",
    children: "empty",
  },
};
