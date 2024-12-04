import React, { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Modal, { confirmColors, footerDirections, sizes } from "./Modal";
import Body from "#src/components/Body";
import Button from "#src/components/Button";

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

/**
 * This is the default state of the Modal component.
 */
export const ModalShort: Story = {
  name: "Modal short",
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
          <Body htmlVariant="p" size="sm" color="default">
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

/**
 * The default behaviour doesn't close the modal when a confirm button is clicked,
 * because you may need to open another one, replace the current one and trigger
 * a new flow, ...<br>
 * This is a Modal component with a confirm button that closes it.
 */
export const ModalConfirmClosing: Story = {
  name: "Modal confirm closing",
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);
    const handleConfirmClose = () => {
      console.log("confirm clicked");
      handleClose();
    };

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
        <Modal
          {...args}
          open={isOpen}
          onClose={handleClose}
          onConfirmClick={handleConfirmClose}
        >
          <Body htmlVariant="p" size="sm" color="default">
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

/**
 * This Modal has a scrollable content.<br>
 * It shows that only children are scrollable, the buttons below remoin visible.
 */
export const ModalOverflow: Story = {
  name: "Modal overflow",
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
          <Body htmlVariant="p" size="md" color="default">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ac
            odio molestie, rhoncus lacus eget, placerat libero. Phasellus nec
            tristique velit, cursus mollis felis. Sed egestas sagittis metus, et
            suscipit lacus consequat id. In auctor, leo id lacinia euismod,
            tortor nulla imperdiet quam, ac venenatis mauris lorem a quam.
            Mauris vel sagittis turpis, nec molestie nisl. Nullam eget massa
            ullamcorper, fringilla diam sed, lacinia felis. Ut non urna eu velit
            blandit ultrices. Ut vitae libero vitae risus venenatis varius.
            Donec eleifend elementum ante, ac malesuada ipsum bibendum non. Ut
            tellus turpis, commodo non felis sed, elementum molestie mi.
            Maecenas tempor purus mattis augue auctor sollicitudin. Cras nec
            neque urna. Nulla ac felis quam. Vestibulum sagittis scelerisque
            ipsum ut lobortis. Sed ut enim vestibulum, imperdiet lacus in,
            pretium erat. Quisque scelerisque velit mi, a ornare arcu
            scelerisque at. Praesent nec tellus vitae nulla tempor gravida. Nam
            augue metus, sollicitudin commodo congue a, porttitor at est. Aenean
            viverra, orci id dapibus imperdiet, odio tellus dapibus eros, vel
            dapibus nisi libero ac libero. Suspendisse eget urna molestie ipsum
            sollicitudin consectetur. Aliquam a maximus libero, ut auctor enim.
            Aliquam in lobortis sem. Sed vitae velit porttitor, congue lorem id,
            cursus sem. Aenean bibendum aliquet ex a imperdiet. Sed eget
            efficitur tortor, egestas molestie nunc. Nunc et purus blandit,
            hendrerit turpis eget, vestibulum urna. Nulla facilisi. Etiam
            consectetur lorem sagittis, egestas urna non, consectetur tortor.
            Cras vel imperdiet nibh. Praesent eget pulvinar lacus. Ut arcu
            lectus, consectetur quis purus vel, luctus egestas dolor. Curabitur
            ac diam sed tellus viverra consectetur. Nullam sed varius nulla. In
            hac habitasse platea dictumst. Suspendisse vel sollicitudin risus.
            Aenean urna dui, ultricies a posuere ut, vestibulum at odio. Duis
            tristique magna lacinia felis aliquet ornare in et tellus.
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
