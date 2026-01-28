import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";

import Button from "#src/components/Button";

import Dialog, { DialogProps } from "./Dialog";

/**
 * Internal component used to handle dialog behavior including portal creation,
 * backdrop, focus management, and animation states.
 * This component is used by Modal and other dialog-like components.
 */
const meta: Meta<typeof Dialog> = {
  component: Dialog,
  title: "Components/Private/Dialog",
  parameters: {
    layout: "centered",
  },
  argTypes: {
    open: {
      control: "boolean",
      description: "Whether the dialog is open or not",
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
      description: "Size of the dialog",
    },
    position: {
      control: { type: "select" },
      options: ["centered", "bottom"],
      description: "Position of the dialog",
    },
    onClose: {
      description: "Function to call when the dialog is closed",
    },
    onClickOutside: {
      description: "Function to call when clicking outside the dialog",
    },
    className: {
      description: "Additional classes to apply to the dialog",
    },
    children: {
      description: "Content to display inside the dialog",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Dialog>;

const defaultArgs: DialogProps = {
  open: false,
  size: "md",
  position: "centered",
  onClose: () => console.log("dialog closed"),
  onClickOutside: () => console.log("clicked outside"),
};

/**
 * Basic Dialog component with default styling.
 */
export const Default: Story = {
  name: "Default Dialog",
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
          size="md"
          intent="default"
          color="main"
          onClick={handleOpen}
          label="Open Dialog"
        />
        <Dialog
          {...args}
          open={isOpen}
          onClose={handleClose}
          onClickOutside={handleClose}
        >
          <div className="p-md">
            <h2 className="text-lg font-semibold mb-md">Dialog Content</h2>
            <p className="mb-md">This is a sample dialog content.</p>
            <div className="flex justify-end gap-sm">
              <Button
                size="md"
                intent="flat"
                color="default"
                onClick={handleClose}
                label="Cancel"
              />
              <Button
                size="md"
                intent="default"
                color="main"
                onClick={handleClose}
                label="Confirm"
              />
            </div>
          </div>
        </Dialog>
      </>
    );
  },
  args: defaultArgs,
};

/**
 * Small size dialog variant.
 */
export const Small: Story = {
  name: "Small Dialog",
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
          size="md"
          intent="default"
          color="main"
          onClick={handleOpen}
          label="Open Dialog"
        />
        <Dialog
          {...args}
          open={isOpen}
          onClose={handleClose}
          onClickOutside={handleClose}
        >
          <div className="p-md">
            <h2 className="text-lg font-semibold mb-md">Small Dialog</h2>
            <p className="mb-md">This dialog uses the small size variant.</p>
            <div className="flex justify-end gap-sm">
              <Button
                size="md"
                intent="flat"
                color="default"
                onClick={handleClose}
                label="Close"
              />
            </div>
          </div>
        </Dialog>
      </>
    );
  },
  args: {
    ...defaultArgs,
    size: "sm",
  } as DialogProps,
};

/**
 * Large size dialog variant.
 */
export const Large: Story = {
  name: "Large Dialog",
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
          size="md"
          intent="default"
          color="main"
          onClick={handleOpen}
          label="Open Large Dialog"
        />
        <Dialog
          {...args}
          open={isOpen}
          onClose={handleClose}
          onClickOutside={handleClose}
        >
          <div className="p-md">
            <h2 className="text-lg font-semibold mb-md">Large Dialog</h2>
            <p className="mb-md">
              This dialog uses the large size variant, which provides more space
              for content.
            </p>
            <div className="flex justify-end gap-sm">
              <Button
                size="md"
                intent="flat"
                color="default"
                onClick={handleClose}
                label="Cancel"
              />
              <Button
                size="md"
                intent="default"
                color="main"
                onClick={handleClose}
                label="Confirm"
              />
            </div>
          </div>
        </Dialog>
      </>
    );
  },
  args: {
    ...defaultArgs,
    size: "lg",
  } as DialogProps,
};

/**
 * Dialog with custom styling and content.
 */
export const CustomContent: Story = {
  name: "Custom Dialog",
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
          size="md"
          intent="default"
          color="main"
          onClick={handleOpen}
          label="Open Custom Dialog"
        />
        <Dialog
          {...args}
          open={isOpen}
          onClose={handleClose}
          onClickOutside={handleClose}
        >
          <div className="p-md flex flex-col gap-md">
            <div className="bg-surface-info-weak p-md rounded-md">
              <h2 className="text-lg font-semibold">Custom Dialog</h2>
              <p>This dialog has custom styling and content.</p>
            </div>
            <div className="flex flex-col gap-sm">
              <Button
                size="md"
                intent="flat"
                color="main"
                label="Main Action"
              />
              <Button
                size="md"
                intent="flat"
                color="critical"
                label="Critical Action"
              />
              <Button
                size="md"
                intent="default"
                color="main"
                onClick={handleClose}
                label="Close Dialog"
              />
            </div>
          </div>
        </Dialog>
      </>
    );
  },
  args: {
    ...defaultArgs,
    className: "max-w-[500px]",
  } as DialogProps,
};

/**
 * Dialog positioned at the bottom of the screen.
 */
export const BottomPosition: Story = {
  name: "Bottom Position",
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
          size="md"
          intent="default"
          color="main"
          onClick={handleOpen}
          label="Open Bottom Dialog"
        />
        <Dialog
          {...args}
          open={isOpen}
          onClose={handleClose}
          onClickOutside={handleClose}
        >
          <div className="p-md">
            <h2 className="text-lg font-semibold mb-md">Bottom Dialog</h2>
            <p className="mb-md">
              This dialog is positioned at the bottom of the screen, 6px from
              the edge.
            </p>
            <div className="flex justify-end gap-sm">
              <Button
                size="md"
                intent="flat"
                color="default"
                onClick={handleClose}
                label="Cancel"
              />
              <Button
                size="md"
                intent="default"
                color="main"
                onClick={handleClose}
                label="Confirm"
              />
            </div>
          </div>
        </Dialog>
      </>
    );
  },
  args: {
    ...defaultArgs,
    position: "bottom",
  } as DialogProps,
};

/**
 * Bottom positioned dialog with long content to demonstrate max-height behavior.
 */
export const BottomPositionLongContent: Story = {
  name: "Bottom Position - Long Content",
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
          size="md"
          intent="default"
          color="main"
          onClick={handleOpen}
          label="Open Bottom Dialog with Long Content"
        />
        <Dialog
          {...args}
          open={isOpen}
          onClose={handleClose}
          onClickOutside={handleClose}
        >
          <div className="p-md flex flex-col gap-md overflow-y-auto">
            <h2 className="text-lg font-semibold">
              Bottom Dialog with Scrollable Content
            </h2>
            <p>
              This dialog demonstrates the max-height behavior. The dialog can
              grow up to 50% of the screen height with content, then becomes
              scrollable.
            </p>
            <div className="flex flex-col gap-sm">
              {Array.from({ length: 20 }, (_, i) => (
                <div key={i} className="p-sm bg-surface-default rounded-md">
                  <p className="text-sm">Content item {i + 1}</p>
                  <p className="text-xs text-content-weak">
                    This is additional content to demonstrate scrolling behavior
                    when the dialog exceeds 50% of the screen height.
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-sm sticky bottom-0 bg-surface-default-elevated pt-md">
              <Button
                size="md"
                intent="flat"
                color="default"
                onClick={handleClose}
                label="Cancel"
              />
              <Button
                size="md"
                intent="default"
                color="main"
                onClick={handleClose}
                label="Confirm"
              />
            </div>
          </div>
        </Dialog>
      </>
    );
  },
  args: {
    ...defaultArgs,
    position: "bottom",
    size: "lg",
  } as DialogProps,
};
