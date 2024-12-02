import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Popover from "./Popover";
import Button from "#src/components/Button";
import Body from "#src/components/Body";
import {
  AnchorTypeValues,
  TransitionStyleValues,
} from "#src/hooks/useContainerPosition";

/**
 * A Popover Container is a UI component that displays temporary content in a floating
 * overlay, triggered by user actions (e.g., click or hover). It provides additional
 * information or actions without navigating away from the current view. The goal is
 * also to not break the DOM Tree and use a portal to render it outside of the actual
 * tree while linking it to its parent component<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=5697-18089&node-type=canvas&t=obgdPQCjAySQE353-0" target="_blank">Figma</a><br>
 * <a href="https://bsport.supernova-docs.io/latest/components/modal/component-overview-md8WHQHD" target="_blank">Supernova docs</a>
 */
const meta: Meta<typeof Popover> = {
  component: Popover,
  argTypes: {
    open: {
      control: { type: "boolean" },
      type: { name: "boolean", required: true },
    },
    containerId: {
      control: { type: "text" },
      type: { name: "string", required: true },
    },
    parentId: {
      control: { type: "text" },
      type: { name: "string", required: true },
    },
    anchor: {
      table: {
        type: {
          summary: "string",
          detail:
            "top | top-left | top-right | bottom | bottom-left | bottom-right | right | left",
        },
      },
      options: AnchorTypeValues,
      control: { type: "select" },
      type: { name: "string", required: true },
    },
    transitionStyle: {
      table: {
        type: {
          summary: "string",
          detail: "slide | appear | default",
        },
      },
      options: TransitionStyleValues,
      control: { type: "select" },
      type: { name: "string", required: true },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Popover>;

export const Primary: Story = {
  name: "Popover",
  render: (args) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const handleClick = React.useCallback(() => {
      setIsOpen(!isOpen);
    }, [setIsOpen, isOpen]);

    React.useEffect(() => {
      setIsOpen(args.open);
    }, [args.open]);

    const onClose = React.useCallback(() => {
      setIsOpen(false);
    }, [setIsOpen]);

    return (
      <>
        <div
          className="mt-[150px] ml-[240px] w-[10px] h-[10px] border-stroke-thin border-luna-grey-300 m-[20px] flex"
          id={args.parentId}
        ></div>
        <Button
          label="Open popover"
          size="md"
          intent="default"
          color="main"
          onClick={handleClick}
          loading={false}
        />
        <Popover
          containerId={args.containerId}
          parentId={args.parentId}
          anchor={args.anchor}
          open={isOpen}
          transitionStyle={args.transitionStyle}
          onClose={onClose}
        >
          <Body htmlVariant="p" size="sm">
            Lorem ipsum odor amet, consectetuer adipiscing elit. Iaculis tempus
            libero habitant ex potenti; aptent vel fringilla. Commodo himenaeos
          </Body>
          <Button
            label="Close popover"
            size="md"
            intent="default"
            color="main"
            onClick={handleClick}
            loading={false}
          />
        </Popover>
      </>
    );
  },
  args: {
    open: false,
    containerId: "popover-test-kaizen",
    parentId: "parent-element",
    anchor: "bottom",
    transitionStyle: "appear",
  },
};
