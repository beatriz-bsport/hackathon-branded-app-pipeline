import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

import Title from "#src/components/Title";

import Icon, { type IconName, icons, sizes } from "./Icon";

/**
 * Generic Icon React component allowing to render any<br>
 * The Icon inherit the color from its parent component, but it can also be defined directly inside the Icon classname. <a href="https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-icon--docs#custom%20color%20icons">Example</a><br>
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
    color: {
      control: { type: "color" },
      description: "Setting to test different colors. This is not a props.",
      type: { name: "string", required: false },
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
  },
  render: (args) => {
    return <Icon {...args} style={{ color: args.color }} />;
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
            <Icon style={{ color: args.color }} size={args.size} icon={name} />
            <span className="text-xs text-center">{name}</span>
          </button>
        ))}
      </div>
    );
  },
};

export const CustomColorIcons: Story = {
  name: "Custom color icons",
  args: {
    size: "lg",
    color: "#000000",
    icon: "image-03",
  },
  parameters: {
    docs: {
      source: {
        code: `
      <div className="flex flex-row items-start flex-wrap gap-md">
        <Icon
          size={args.size}
          icon="image-03"
          className="text-neptune-blue-400"
        />
        <div className="text-cupid-red-400">
          <Icon size={args.size} icon="announcement-01" />
        </div>
      </div>`,
      },
    },
  },

  render: (args) => {
    return (
      <div className="flex flex-col gap-sm items-start self-align align-center align-items flex-wrap gap-md">
        <div>
          <Title htmlVariant="h5">Adding style directly to the Icon</Title>
          <Icon
            size={args.size}
            icon={args.icon}
            style={{ color: args.color }}
          />
        </div>

        <div
          className={"p-y-[20px] flex flex-col items-start flex-wrap gap-md"}
        >
          <Title htmlVariant="h5">Adding style directly to the Icon</Title>
          <div style={{ color: args.color }}>
            <Icon size={args.size} icon={args.icon} />
          </div>
        </div>
      </div>
    );
  },
};
