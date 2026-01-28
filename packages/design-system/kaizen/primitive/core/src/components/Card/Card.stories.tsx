import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

import Body from "#src/components/Body";
import Button from "#src/components/Button";
import Title from "#src/components/Title";

import Card from "./Card";

/**
 * A card container that can be displayed with children in it so that you can show
 * important information to user easily and efficiently within a container component.<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=438-4638&node-type=canvas&t=NEPFgvjz71Ga8Syo-0" target="_blank">Figma</a><br>
 * <a href="https://bsport.supernova-docs.io/latest/components/card/component-overview-VMl5jQE3" target="_blank">Supernova docs</a>
 */
const meta: Meta<typeof Card> = {
  component: Card,
  argTypes: {
    actionable: {
      type: { name: "boolean" },
    },
    children: {
      table: { type: { summary: "ReactNode" } },
    },
    elevated: {
      table: {
        type: {
          summary: "boolean",
          detail: "give border and background to an actionable card if true",
        },
        defaultValue: { summary: "true" },
      },
    },
    padding: {
      options: ["default", "sm", "none"],
      control: { type: "inline-radio" },
      table: { type: { summary: "string" } },
      type: { name: "string" },
    },
    onClick: {
      table: {
        type: {
          summary: "function",
          detail: "only usable with an actionable card",
        },
      },
    },
    selected: {
      table: {
        type: {
          summary: "boolean",
          detail: "only usable with an actionable card",
        },
      },
      type: { name: "boolean" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Primary: Story = {
  name: "Basic Text",
  render: (args) => {
    const handleClick = React.useCallback(() => {
      if (args.onClick) args.onClick();
    }, [args]);

    return (
      <Card {...args} onClick={handleClick}>
        <Body htmlVariant="p" size="sm" color="default" weight="weak">
          Lorem ipsum odor amet, consectetuer adipiscing elit. Iaculis tempus
          libero habitant ex potenti; aptent vel fringilla. Commodo himenaeos
          vitae ullamcorper commodo enim lacus leo finibus. Ultricies urna
          litora suscipit curabitur viverra laoreet purus ante sit.
        </Body>
      </Card>
    );
  },
  args: {
    actionable: true,
    elevated: false,
    onClick: () => console.log("clicked on card"),
    padding: "default",
    selected: false,
  },
};

export const CompleteCardWithChildren: Story = {
  name: "Card with several children",
  render: (args) => {
    return (
      <Card {...args}>
        <Title htmlVariant="h2" weight="strong" color="default">
          This is the title of the card
        </Title>
        <Body htmlVariant="p" size="sm" color="default">
          What about clicking on that sweet and delicously looking button ?
        </Body>
        <Button intent="default" color="main" size="md" label="Click me pls" />
      </Card>
    );
  },
  args: {
    actionable: false,
    elevated: false,
    padding: "default",
    selected: false,
  },
};

export const ActionCard: Story = {
  name: "Action Card with Text",
  render: (args) => {
    return (
      <Card {...args}>
        <Body htmlVariant="p" size="sm" color="default" weight="weak">
          You can interact with me, I like action !
        </Body>
      </Card>
    );
  },
  args: {
    actionable: true,
    elevated: false,
    padding: "default",
    selected: false,
  },
};

export const ShortText: Story = {
  name: "Short Text",
  render: (args) => {
    return (
      <Card {...args}>
        <Body htmlVariant="p" size="sm" color="default">
          Test
        </Body>
      </Card>
    );
  },
  args: {
    actionable: false,
    elevated: false,
    padding: "default",
    selected: false,
  },
};

export const LongText: Story = {
  name: "Long Text",
  render: (args) => {
    return (
      <Card {...args}>
        <Body htmlVariant="p" size="sm" color="default">
          Lorem ipsum odor amet, consectetuer adipiscing elit. Iaculis tempus
          libero habitant ex potenti; aptent vel fringilla. Commodo himenaeos
          vitae ullamcorper commodo enim lacus leo finibus. Ultricies urna
          litora suscipit curabitur viverra laoreet purus ante sit. Lorem ipsum
          odor amet, consectetuer adipiscing elit. Iaculis tempus libero
          habitant ex potenti; aptent vel fringilla. Commodo himenaeos vitae
          ullamcorper commodo enim lacus leo finibus. Ultricies urna litora
          suscipit curabitur viverra laoreet purus ante sit. Lorem ipsum odor
          amet, consectetuer adipiscing elit. Iaculis tempus libero habitant ex
          potenti; aptent vel fringilla. Commodo himenaeos vitae ullamcorper
          commodo enim lacus leo finibus. Ultricies urna litora suscipit
          curabitur viverra laoreet purus ante sit. Lorem ipsum odor amet,
          consectetuer adipiscing elit. Iaculis tempus libero habitant ex
          potenti; aptent vel fringilla. Commodo himenaeos vitae ullamcorper
          commodo enim lacus leo finibus. Ultricies urna litora suscipit
          curabitur viverra laoreet purus ante sit. Lorem ipsum odor amet,
          consectetuer adipiscing elit. Iaculis tempus libero habitant ex
          potenti; aptent vel fringilla. Commodo himenaeos vitae ullamcorper
          commodo enim lacus leo finibus. Ultricies urna litora suscipit
          curabitur viverra laoreet purus ante sit.
        </Body>
      </Card>
    );
  },
  args: {
    actionable: false,
    elevated: false,
    padding: "default",
    selected: false,
  },
};
