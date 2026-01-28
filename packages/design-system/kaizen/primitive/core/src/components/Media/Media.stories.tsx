import type { Meta, StoryObj } from "@storybook/react-vite";

import Media, { ratios, sizes } from ".";
import MediaImage from "./assets/media.jpg";

/**
 * A Media component that renders an image with customizable size, aspect ratio,
 * and additional styling options.<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=7705-9452&p=f&t=es72UcPa8jfyYo9O-0" target="_blank">Figma</a><br>
 */
const meta: Meta<typeof Media> = {
  component: Media,
  argTypes: {
    size: {
      options: [undefined, ...Object.keys(sizes)],
      control: { type: "inline-radio" },
      table: { type: { summary: "string" } },
    },
    ratio: {
      options: [undefined, ...Object.keys(ratios)],
      control: { type: "inline-radio" },
      table: { type: { summary: "string" } },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Media>;

export const Primary: Story = {
  name: "Media",
  args: {
    src: MediaImage,
    size: "md",
    alt: "image",
  },
};

export const EmptySource: Story = {
  name: "Empty Source",
  args: {
    alt: "image",
    size: "md",
  },
};

export const BrokenSource: Story = {
  name: "Broken Source",
  args: {
    src: "broken/link",
    size: "md",
    alt: "image",
  },
};
