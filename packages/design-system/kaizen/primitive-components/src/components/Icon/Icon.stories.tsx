import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Icon, { icons, sizes, type IconName } from "./Icon";

/**
 * Generic Icon React component allowing to render any<br>
 * Tutorial <a href="https://medium.com/@mateuszpalka/creating-your-custom-svg-icon-library-in-react-a5ff1c4c704a" target="_blank">here</a>
 */
const meta: Meta<typeof Icon> = {
  component: Icon,
  argTypes: {
    icon: {
      options: Object.keys(icons),
      control: { type: "select" },
      table: { type: { summary: "string" } },
    },
    size: {
      options: Object.keys(sizes),
      control: { type: "select" },
      type: { name: "string", required: true },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Icon>;

export const Primary: Story = {
  name: "Icon",
  args: {
    icon: "arrow-right",
    size: "xl",
    className: "onsurface-default",
  },
};

export const AllIcons: Story = {
  name: "All icons",
  args: {
    size: "md",
  },
  render: (args) => {
    const iconNameList = Object.keys(icons) as IconName[];

    const copyToClipboard = (name: string) => {
      navigator.clipboard
        .writeText(name)
        .then(() => {
          alert(`Icon name "${name}" copied to clipboard`);
        })
        .catch((err) => {
          console.error("Failed to copy to clipboard", err);
        });
    };

    return (
      <div className="flex flex-row items-start flex-wrap gap-md">
        {iconNameList.map((name) => (
          <button
            key={name}
            className="flex flex-col items-center gap-sm max-w-element-2xl \
            hover:shadow-border-thin-default p-sm rounded-md"
            onClick={() => copyToClipboard(name)}
          >
            <Icon size={args.size} icon={name} />
            <span className="text-xs text-center">{name}</span>
          </button>
        ))}
      </div>
    );
  },
};
