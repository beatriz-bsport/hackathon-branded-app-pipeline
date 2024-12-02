import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Card, { CardTypeValues } from "./Card";
import Body from "#src/components/Body";
import Button from "#src/components/Button";
import Title from "#src/components/Title";

/**
 * A card container that can be displayed with children in it so that you can show
 * important informations to user easily and efficiently within a container component.<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=438-4638&node-type=canvas&t=NEPFgvjz71Ga8Syo-0" target="_blank">Figma</a><br>
 * <a href="https://bsport.supernova-docs.io/latest/components/card/component-overview-VMl5jQE3" target="_blank">Supernova docs</a>
 */
const meta: Meta<typeof Card> = {
  component: Card,
  argTypes: {
    children: {
      table: { type: { summary: "ReactNode" } },
    },
    elevated: {
      table: {
        type: {
          summary: "boolean",
          detail: "give border and background to a card if true",
        },
        defaultValue: { summary: "true" },
      },
    },
    onClick: {
      table: {
        type: {
          summary: "function",
          detail: "only usable with item and action type",
        },
      },
    },
    selected: {
      table: {
        type: { summary: "boolean", detail: "only usable with item type" },
      },
      type: { name: "boolean" },
    },
    type: {
      table: { type: { summary: "string", detail: "action | item | info" } },
      options: CardTypeValues,
      control: { type: "inline-radio" },
      type: { name: "string", required: true },
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
      <Card
        elevated={args.elevated}
        onClick={handleClick}
        selected={args.selected}
        type={args.type}
      >
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
    type: "info",
    onClick: () => console.log("clicken on card"),
    elevated: true,
    selected: false,
  },
};

export const CompleteCardWithChildren: Story = {
  name: "Card with several children",
  render: (args) => {
    return (
      <Card elevated={args.elevated} selected={args.selected} type={args.type}>
        <Title htmlVariant="h2" weight="strong">
          This is the title of the card
        </Title>
        <Body htmlVariant="p" size="sm">
          What about clicking on that sweet and delicously looking button ?
        </Body>
        <Button intent="default" color="main" size="md" label="Click me pls" />
      </Card>
    );
  },
  args: {
    type: "info",
    elevated: true,
    selected: false,
  },
};

export const ActionCard: Story = {
  name: "Action Card with Text",
  render: (args) => {
    return (
      <Card elevated={args.elevated} selected={args.selected} type={args.type}>
        <Body htmlVariant="p" size="sm" color="default" weight="weak">
          You can interact with me, I like action !
        </Body>
      </Card>
    );
  },
  args: {
    type: "action",
    elevated: true,
    selected: false,
  },
};

export const ShortText: Story = {
  name: "Short Text",
  render: (args) => {
    return (
      <Card elevated={args.elevated} selected={args.selected} type={args.type}>
        <Body htmlVariant="p" size="sm">
          Test
        </Body>
      </Card>
    );
  },
  args: {
    type: "info",
    elevated: true,
    selected: false,
  },
};

export const LongText: Story = {
  name: "Long Text",
  render: (args) => {
    return (
      <Card elevated={args.elevated} selected={args.selected} type={args.type}>
        <Body htmlVariant="p" size="sm">
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
    type: "info",
    elevated: true,
    selected: false,
  },
};
