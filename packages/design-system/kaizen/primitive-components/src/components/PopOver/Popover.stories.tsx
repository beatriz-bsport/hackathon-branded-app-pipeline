import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import PopOver from "./Popover";
import Button from "../Button";
import Body from "../Body";
import { AnchorTypeValues } from "../../hooks/useContainerPosition";

const meta: Meta<typeof PopOver> = {
  component: PopOver,
  argTypes: {
    open: {
      control: { type: "boolean" },
      type: { name: "boolean", required: true },
    },
    popoverId: {
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
  },
};

export default meta;

type Story = StoryObj<typeof PopOver>;

export const Primary: Story = {
  name: "PopOver",
  render: (args) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const handleClick = () => setIsOpen(!isOpen);

    React.useEffect(() => {
      setIsOpen(args.open);
    }, [args.open]);

    return (
      <>
        <div
          className="mt-[300px] ml-[240px] w-[10px] h-[10px] border-stroke-thin border-luna-grey-300 m-[20px] flex"
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
        <PopOver
          popoverId={args.popoverId}
          parentId={args.parentId}
          anchor={args.anchor}
          open={isOpen}
        >
          <Body htmlVariant="p" size="sm">
            Lorem ipsum odor amet, consectetuer adipiscing elit. Iaculis tempus
            libero habitant ex potenti; aptent vel fringilla. Commodo himenaeos
            vitae ullamcorper commodo enim lacus leo finibus.
          </Body>
          <Button
            label="Close popover"
            size="md"
            intent="default"
            color="main"
            onClick={handleClick}
            loading={false}
          />
        </PopOver>
      </>
    );
  },
  args: {
    open: false,
    popoverId: "popover-test-kaizen",
    parentId: "parent-element",
    anchor: "bottom-right",
  },
};
