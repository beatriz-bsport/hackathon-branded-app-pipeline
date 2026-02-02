import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

import Body from "#src/components/Body";
import Button from "#src/components/Button";
import { Placements } from "#src/hooks/placement-classes.hook";

import Popover from "./Popover";

// Since placement is an argument of Popover.Content, we customize args in Storybook
type CustomProps = React.ComponentProps<typeof Popover> & {
  placement: (typeof Placements)[number];
  fullWidth?: boolean;
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
    fullWidth: {
      table: { type: { summary: "boolean" } },
      control: { type: "boolean" },
      description: "Makes the popover take full width of its container",
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

/**
 * This can test the behavior of the Popover component when it is placed inside a scrollable container.
 * It's possible to test the resizing aswell.
 *
 * TODO: Move automatically the Popover when it's about to be hidden by the scroll or resize.<br>
 * To be defined, could just shift (https://ant.design/components/popover#popover-demo-shift) or move even when scrolling if the anchor is not visible.
 */
export const PopoverInAScrollableContainer: Story = {
  name: "Popover in a scrollable container",
  render: (args) => {
    return (
      <div className="relative h-[200vh]">
        <div className="absolute flex flex-col gap-lg top-[20vh] left-0">
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

/**
 * This story demonstrates the fullWidth property.
 * When enabled, the popover takes the full width of its container.
 */
export const PopoverFullWidth: Story = {
  name: "Popover with full width",
  render: (args) => {
    return (
      <div className="relative h-[30vh] w-full px-lg">
        <div className="flex flex-col gap-lg">
          <Popover fullWidth={args.fullWidth}>
            <Popover.Anchor>
              {({ setIsPopoverOpened }) => (
                <Button
                  label="Open full width popover"
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
                    This popover takes the full width of its container when
                    fullWidth is true. Toggle the control to see the difference.
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
    fullWidth: true,
  },
};
