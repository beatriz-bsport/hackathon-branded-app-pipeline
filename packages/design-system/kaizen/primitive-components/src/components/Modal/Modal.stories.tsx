import React, { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Modal, { confirmColors, footerDirections, sizes } from "./Modal";
import Body from "../Body";
import Button from "../Button";

/**
 * A dialog box that appears on top of the main content, requiring the user to
 * interact with it before returning to the main flow, and can be used to
 * display important information or confirm an action.<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Proto-designSystem?node-id=528-3960" target="_blank">Figma</a><br>
 * <a href="https://bsport.supernova-docs.io/latest/components/modal/component-overview-md8WHQHD" target="_blank">Supernova docs</a>
 */
const meta: Meta<typeof Modal> = {
  component: Modal,
  argTypes: {
    open: {
      control: { type: "boolean" },
      type: { name: "boolean", required: true },
    },
    size: {
      options: Object.keys(sizes),
      control: { type: "inline-radio" },
      type: { name: "string", required: true },
    },
    title: {
      control: { type: "text" },
      required: true,
      type: { name: "string", required: true },
    },
    description: {
      control: { type: "text" },
    },
    footerDirection: {
      options: footerDirections,
      control: { type: "inline-radio" },
      table: { defaultValue: { summary: "row" } },
    },
    onClose: {
      table: { type: { summary: "function", detail: "() => void" } },
    },
    onCrossButtonClick: {
      table: {
        type: {
          summary: "function",
          detail: "(event: React.MouseEvent<HTMLButtonElement>) => void",
        },
      },
    },
    onClickOutside: {
      table: {
        type: {
          summary: "function",
          detail: "(event: React.MouseEvent<HTMLDivElement>) => void",
        },
      },
    },
    confirmLabel: {
      control: { type: "text" },
    },
    confirmColor: {
      options: confirmColors,
      control: { type: "inline-radio" },
    },
    onConfirmClick: {
      table: {
        type: {
          summary: "function",
          detail: "(event: React.MouseEvent<HTMLButtonElement>) => void",
        },
      },
    },
    cancelLabel: {
      control: { type: "text" },
    },
    onCancelClick: {
      table: {
        type: {
          summary: "function",
          detail: "(event: React.MouseEvent<HTMLButtonElement>) => void",
        },
      },
    },
    children: {
      table: { type: { summary: "ReactNode" } },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Modal>;

export const Primary: Story = {
  name: "Modal",
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    useEffect(() => {
      setIsOpen(args.open);
    }, [args.open]);

    return (
      <>
        <Button
          label="Open Modal"
          size="md"
          intent="default"
          color="main"
          onClick={handleOpen}
          loading={false}
        />
        <Modal {...args} open={isOpen} onClose={handleClose}>
          <Body htmlVariant="p" size="sm">
            Lorem ipsum odor amet, consectetuer adipiscing elit. Iaculis tempus
            libero habitant ex potenti; aptent vel fringilla. Commodo himenaeos
            vitae ullamcorper commodo enim lacus leo finibus. Ultricies urna
            litora suscipit curabitur viverra laoreet purus ante sit.
          </Body>
        </Modal>
      </>
    );
  },
  args: {
    open: false,
    size: "sm",
    title: "Modal title",
    description:
      "Ergonomic executive chair upholstered in bonded black leather and PVC padded seat and back for all-day comfort and support.",
    footerDirection: "row",
    onClose: () => console.log("modal closed"),
    onCrossButtonClick: () => console.log("cross button clicked"),
    onClickOutside: () => console.log("clicked outside"),
    confirmLabel: "Confirm",
    confirmColor: "main",
    onConfirmClick: () => console.log("confirm clicked"),
    cancelLabel: "Cancel",
    onCancelClick: () => console.log("cancel clicked"),
  },
};
