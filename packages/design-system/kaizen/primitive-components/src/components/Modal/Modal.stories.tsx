import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Modal, { confirmColors, footerDirections, sizes } from "./Modal";
import Body from "../Body";
import Button from "../Button";

const meta: Meta<typeof Modal> = {
  component: Modal,
  argTypes: {
    size: {
      options: Object.keys(sizes),
      control: { type: "inline-radio" },
    },
    title: {
      control: { type: "text" },
      required: true,
    },
    description: {
      control: { type: "text" },
    },
    footerDirection: {
      options: footerDirections,
      control: { type: "inline-radio" },
    },
    confirmLabel: {
      control: { type: "text" },
    },
    confirmColor: {
      options: confirmColors,
      control: { type: "inline-radio" },
    },
    cancelLabel: {
      control: { type: "text" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Modal>;

export const Primary: Story = {
  name: "Modal",
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

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
    size: "sm",
    title: "Modal title",
    description:
      "Ergonomic executive chair upholstered in bonded black leather and PVC padded seat and back for all-day comfort and support.",
    footerDirection: "row",
    confirmLabel: "Confirm",
    confirmColor: "main",
    cancelLabel: "Cancel",
  },
};
