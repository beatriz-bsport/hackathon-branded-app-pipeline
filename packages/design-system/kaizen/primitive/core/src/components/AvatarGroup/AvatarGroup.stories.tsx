import type { Meta, StoryObj } from "@storybook/react-vite";

import { sizes } from "#src/components/Avatar";
import AvatarImage from "#src/components/Avatar/assets/avatar.jpeg";

import AvatarGroup from "./AvatarGroup";

const data = [
  {
    id: "avatar-1",
    alt: "avatar",
    initials: "AB",
    src: AvatarImage,
    name: "Alice Brown",
  },
  {
    id: "avatar-2",
    alt: "avatar",
    initials: "CD",
    src: AvatarImage,
    name: "Charles Davis",
  },
  {
    id: "avatar-3",
    alt: "avatar",
    initials: "EF",
    src: AvatarImage,
    name: "Ella Fisher",
  },
  {
    id: "avatar-4",
    alt: "avatar",
    initials: "GH",
    src: AvatarImage,
    name: "George Harris",
  },
  {
    id: "avatar-5",
    alt: "avatar",
    initials: "IJ",
    src: AvatarImage,
    name: "Isla Johnson",
  },
  {
    id: "avatar-6",
    alt: "avatar",
    initials: "KL",
    src: AvatarImage,
    name: "Kevin Lee",
  },
  {
    id: "avatar-7",
    alt: "avatar",
    initials: "MN",
    src: AvatarImage,
    name: "Mia Nelson",
  },
  {
    id: "avatar-8",
    alt: "avatar",
    initials: "OP",
    src: AvatarImage,
    name: "Oliver Parker",
  },
  {
    id: "avatar-9",
    alt: "avatar",
    initials: "QR",
    src: AvatarImage,
    name: "Quinn Rivera",
  },
  {
    id: "avatar-10",
    alt: "avatar",
    initials: "ST",
    src: AvatarImage,
    name: "Sophia Thompson",
  },
  {
    id: "avatar-11",
    alt: "avatar",
    initials: "UV",
    src: AvatarImage,
    name: "Uma Valentine",
  },
  {
    id: "avatar-12",
    alt: "avatar",
    initials: "WX",
    src: AvatarImage,
    name: "William Xavier",
  },
  {
    id: "avatar-13",
    alt: "avatar",
    initials: "YZ",
    src: AvatarImage,
    name: "Yara Zane",
  },
  {
    id: "avatar-14",
    alt: "avatar",
    initials: "AA",
    src: AvatarImage,
    name: "Ava Adams",
  },
  {
    id: "avatar-15",
    alt: "avatar",
    initials: "BB",
    src: AvatarImage,
    name: "Benjamin Bell",
  },
];

/**
 * Renders a group of avatars with a placeholder avatar indicating the number
 * of additional avatars not displayed. Supports custom shapes, sizes, and styles.
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=781-10907&t=2dJPMKNKpbmP1rmv-4">Figma</a><br>

*/
const meta: Meta<typeof AvatarGroup> = {
  component: AvatarGroup,
  argTypes: {
    shape: {
      options: ["squared", "round"],
      control: { type: "select" },
      table: { type: { summary: "string" } },
    },
    size: {
      options: Object.keys(sizes),
      control: { type: "inline-radio" },
      table: { type: { summary: "string" } },
    },
  },
};

export default meta;

type Story = StoryObj<typeof AvatarGroup>;

export const Primary: Story = {
  name: "AvatarGroup",
  args: {
    data,
    size: "md",
    shape: "round",
  },
};
