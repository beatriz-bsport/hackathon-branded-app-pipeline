import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Popover from "./Popover";
import Button from "#src/components/Button";
import Body from "#src/components/Body";
import { Placements } from "#src/hooks/placement-classes.hook";

// Since placement is an argument of Popover.Content, we customize args in Storybook
type CustomProps = React.ComponentProps<typeof Popover> & {
  placement: (typeof Placements)[number];
};

/**
 * The Popover component is a compound component that consists of an Anchor and Content.<br>
 * It displays temporary content in a floating overlay, triggered by user actions such as click or hover.<br>
 * The Popover is always positioned relative to a target element, which is specified by the Anchor subcomponent.<br>
 * The Content subcomponent holds the additional information or actions that the Popover provides.<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=5697-18089&node-type=canvas&t=obgdPQCjAySQE353-0" target="_blank">Figma</a><br>
 * <a href="https://bsport.supernova-docs.io/latest/components/modal/component-overview-md8WHQHD" target="_blank">Supernova docs</a>
 */
const meta: Meta<CustomProps> = {
  component: Popover,
  argTypes: {
    children: {
      table: { type: { summary: "ReactNode" } },
    },
    placement: {
      table: { type: { summary: "string" } },
      options: [undefined, ...Object.values(Placements)],
      control: { type: "select" },
    },
  },
};

export default meta;

type Story = StoryObj<CustomProps>;

export const PopoverOpeningOnClick: Story = {
  name: "Popover opening on click",
  render: (args) => {
    return (
      <div className="relative h-[30vh]">
        <div className="absolute flex flex-col gap-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Popover>
            <Popover.Anchor>
              {({ setIsPopoverOpened }) => (
                <Button
                  label="Open popover"
                  intent="default"
                  color="main"
                  size="md"
                  onClick={() => setIsPopoverOpened((prev) => !prev)}
                />
              )}
            </Popover.Anchor>
            <Popover.Content placement={args.placement}>
              {({ setIsPopoverOpened }) => (
                <div className="flex flex-col gap-sm">
                  <Body htmlVariant="p" size="sm" color="default">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </Body>
                  <Button
                    label="Close popover"
                    intent="default"
                    color="main"
                    size="md"
                    onClick={() => setIsPopoverOpened(false)}
                  />
                </div>
              )}
            </Popover.Content>
          </Popover>
        </div>
      </div>
    );
  },
  args: {
    placement: "bottom-left",
  },
};

export const PopoverOpeningOnHover: Story = {
  name: "Popover opening on hover",
  render: (args) => {
    return (
      <div className="relative h-[30vh]">
        <div className="absolute flex flex-col gap-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Popover>
            <Popover.Anchor>
              {({ setIsPopoverOpened }) => (
                <Button
                  label="Open popover"
                  intent="default"
                  color="main"
                  size="md"
                  onMouseEnter={() => setIsPopoverOpened(true)}
                  onMouseLeave={() => setIsPopoverOpened(false)}
                />
              )}
            </Popover.Anchor>
            <Popover.Content placement={args.placement}>
              {() => (
                <div className="flex flex-col gap-sm">
                  <Body htmlVariant="p" size="sm" color="default">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </Body>
                </div>
              )}
            </Popover.Content>
          </Popover>
        </div>
      </div>
    );
  },
  args: {
    placement: "bottom-left",
  },
};
