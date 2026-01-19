import { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";

import Body from "#src/components/Body";
import Button from "#src/components/Button";
import { IconName } from "#src/components/Icon";
import Select from "#src/components/Select";
import Title from "#src/components/Title";
import Toggle from "#src/components/Toggle";

import ModalStepper, { ModalStepperProps } from "./ModalStepper";
import { footerDirections, sizeOptions } from "./constants";
import type { StepConfig } from "./types";

/**
 * A stepper dialog that guides users through a multi-step process.
 * It appears on top of the main content and provides a structured way to complete complex tasks.
 */
const meta: Meta<ModalStepperProps> = {
  title: "Core/ModalStepper",
  component: ModalStepper,
  tags: ["autodocs"],
  argTypes: {
    open: {
      control: { type: "boolean" },
      type: { name: "boolean", required: true },
    },
    size: {
      options: sizeOptions,
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
    steps: {
      table: {
        type: { summary: "StepConfig[]" },
      },
    },
    initialStep: {
      control: { type: "number" },
      table: { defaultValue: { summary: "0" } },
    },
    onClose: {
      table: { type: { summary: "function", detail: "() => void" } },
    },
    onCloseButtonClick: {
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
    confirmButton: {
      table: {
        type: { summary: "DefaultPropsWithConstraints" },
      },
    },
    cancelButton: {
      table: {
        type: { summary: "DefaultPropsWithConstraints" },
      },
    },
  },
  parameters: {
    layout: "centered",
    docs: {
      source: {
        type: "code",
      },
    },
  },
};

export default meta;
type Story = StoryObj<ModalStepperProps>;

const steps: StepConfig[] = [
  {
    label: "Step 1",
    icon: "check-circle-solid",
    content: (
      <div className="flex flex-col gap-md">
        <Body htmlVariant="p" size="md">
          This is the content for step 1. You can add any React components here.
        </Body>
        <Body htmlVariant="p" size="md">
          The stepper will handle navigation between steps.
        </Body>
      </div>
    ),
  },
  {
    label: "Step 2",
    icon: "settings-03",
    content: (
      <div className="flex flex-col gap-md">
        <Body htmlVariant="p" size="md">
          This is the content for step 2. Each step can have different content.
        </Body>
        <Body htmlVariant="p" size="md">
          You can also add form validation logic to each step.
        </Body>
      </div>
    ),
  },
  {
    label: "Step 3",
    icon: "flag-uk",
    content: (
      <div className="flex flex-col gap-md">
        <Body htmlVariant="p" size="md">
          This is the final step. When you click the confirm button on this
          step, the modal will close.
        </Body>
      </div>
    ),
  },
  {
    label: "Step 4",
    icon: "flag-uk",
    content: (
      <div className="flex flex-col gap-md">
        <Body htmlVariant="p" size="md">
          This is the final step. When you click the confirm button on this
          step, the modal will close.
        </Body>
      </div>
    ),
  },
];

const defaultArgs: ModalStepperProps = {
  open: false,
  size: "md",
  title: "Modal Stepper",
  description: "A multi-step modal that guides users through a process.",
  footerDirection: "row",
  initialStep: 0,
  onClose: () => {},
  onCloseButtonClick: () => {},
  onClickOutside: () => {},
  confirmButton: {
    label: "Confirm",
    color: "main",
    onClick: () => {},
  },
  cancelButton: {
    label: "Cancel",
    onClick: () => {},
  },
  steps: steps,
};

// Example stories use direct args instead of example components

/**
 * This is the default state of the ModalStepper component.
 */
export const Basic: Story = {
  args: {
    ...defaultArgs,
    title: "Modal Stepper Example",
    description:
      "This is a multi-step modal that guides users through a process.",
    confirmButton: {
      label: "Complete",
      color: "main",
      onClick: () => {},
    },
    cancelButton: {
      label: "Cancel",
      onClick: () => {},
    },
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    return (
      <div>
        <Button
          intent="call-to-action"
          color="main"
          size="md"
          label="Open Modal Stepper"
          onClick={handleOpen}
        />
        <ModalStepper
          {...args}
          open={isOpen}
          onClose={handleClose}
          confirmButton={{
            ...args.confirmButton,
            label: args.confirmButton?.label || "Complete",
            color: "main",
          }}
          cancelButton={{
            ...args.cancelButton,
            label: args.cancelButton?.label || "Cancel",
          }}
        />
      </div>
    );
  },
};

const stepsWithValidation: StepConfig[] = [
  {
    label: "Step 1",
    icon: "check-circle-solid",
    content: (
      <div className="flex flex-col gap-md">
        <Body htmlVariant="p" size="md">
          This is the content for step 1 with validation.
        </Body>
        <Body htmlVariant="p" size="md">
          The Next button is always enabled for this step.
        </Body>
      </div>
    ),
    validate: () => true,
  },
  {
    label: "Step 2",
    icon: "settings-03",
    content: (
      <div className="flex flex-col gap-md">
        <Body htmlVariant="p" size="md">
          This is the content for step 2 with validation.
        </Body>
        <Body htmlVariant="p" size="md">
          The Next button is disabled for this step to demonstrate validation.
        </Body>
      </div>
    ),
    validate: () => false,
  },
  {
    label: "Step 3",
    icon: "flag-uk",
    content: (
      <div className="flex flex-col gap-md">
        <Body htmlVariant="p" size="md">
          This is the final step with validation.
        </Body>
        <Body htmlVariant="p" size="md">
          The Complete button is always enabled for this step.
        </Body>
      </div>
    ),
    validate: () => true,
  },
];

// ValidationExample removed - using direct args instead
/**
 * This example demonstrates step validation where certain steps can disable the next button.
 */
export const WithValidation: Story = {
  args: {
    ...defaultArgs,
    title: "Modal Stepper with Validation",
    description: "This example demonstrates step validation.",
    steps: stepsWithValidation,
    confirmButton: {
      label: "Complete",
      color: "main",
      onClick: () => {},
    },
    cancelButton: {
      label: "Cancel",
      onClick: () => {},
    },
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);
    const handleConfirm = () => {
      console.log("Confirmed with validation - modal stays open!");
      // Don't close the modal on confirm, as this would typically advance to the next step
    };

    return (
      <div>
        <Button
          intent="call-to-action"
          color="main"
          size="md"
          label="Open Modal Stepper with Validation"
          onClick={handleOpen}
        />
        <ModalStepper
          {...args}
          open={isOpen}
          onClose={handleClose}
          confirmButton={{
            ...args.confirmButton,
            label: args.confirmButton?.label || "Complete",
            onClick: handleConfirm,
            color: "main",
          }}
          cancelButton={{
            ...args.cancelButton,
            label: args.cancelButton?.label || "Cancel",
            onClick: handleClose,
          }}
        />
      </div>
    );
  },
};

// ColumnFooterExample removed - using direct args instead
/**
 * This example demonstrates a column footer layout where buttons are stacked vertically.
 */
export const WithColumnFooter: Story = {
  args: {
    ...defaultArgs,
    title: "Modal Stepper with Column Footer",
    description: "This example demonstrates a column footer layout.",
    footerDirection: "column",
    confirmButton: {
      label: "Complete",
      color: "main",
      onClick: () => {},
    },
    cancelButton: {
      label: "Cancel",
      onClick: () => {},
    },
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);
    const handleConfirm = () => {
      console.log("Confirmed with column footer - modal stays open!");
      // Don't close the modal on confirm, as this would typically advance to the next step
    };

    return (
      <div>
        <Button
          intent="call-to-action"
          color="main"
          size="md"
          label="Open Modal Stepper with Column Footer"
          onClick={handleOpen}
        />
        <ModalStepper
          {...args}
          open={isOpen}
          onClose={handleClose}
          confirmButton={{
            ...args.confirmButton,
            label: args.confirmButton?.label || "Complete",
            onClick: handleConfirm,
          }}
          cancelButton={{
            ...args.cancelButton,
            label: args.cancelButton?.label || "Cancel",
            onClick: handleClose,
          }}
        />
      </div>
    );
  },
};

// CriticalExample removed - using direct args instead

/**
 * This example demonstrates a critical action modal stepper with a red confirm button.
 */
export const CriticalAction: Story = {
  args: {
    ...defaultArgs,
    title: "Critical Modal Stepper",
    description: "This example demonstrates a critical action modal stepper.",
    confirmButton: {
      label: "Delete",
      color: "critical",
      onClick: () => {},
    },
    cancelButton: {
      label: "Cancel",
      onClick: () => {},
    },
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);
    const handleConfirm = () => {
      console.log("Confirmed critical action - modal stays open!");
      // Don't close the modal on confirm, as this would typically advance to the next step
    };

    return (
      <div>
        <Button
          intent="call-to-action"
          color="critical"
          size="md"
          label="Open Critical Modal Stepper"
          onClick={handleOpen}
        />
        <ModalStepper
          {...args}
          open={isOpen}
          onClose={handleClose}
          confirmButton={{
            ...args.confirmButton,
            label: args.confirmButton?.label || "Delete",
            onClick: handleConfirm,
            color: "critical",
          }}
          cancelButton={{
            ...args.cancelButton,
            label: args.cancelButton?.label || "Cancel",
            onClick: handleClose,
          }}
        />
      </div>
    );
  },
};

/**
 * Instead of children, you can render a step form thanks to the `steps` prop.<br>
 * There is a different content rendered for each step, and the initial step can be specified.
 * This example shows form validation across multiple steps.
 */
export const ModalStepForm: Story = {
  name: "With Validation Flow",
  args: {
    ...defaultArgs,
    title: "Step Form Example",
    description:
      "This example shows a form with validation across multiple steps.",
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedOption, setSelectedOption] = useState("");
    const [checked, setChecked] = useState(false);

    const modalSteps: StepConfig[] = [
      {
        label: "Account Setup",
        content: (
          <div className="space-y-md">
            <Title htmlVariant="h4">Step 1: Select your option</Title>
            <Select
              id="select-example"
              size="md"
              status="default"
              defaultValue="Next step is blocked now!"
              items={[{ id: "option-1", label: "Pass to next step" }]}
              iconLeft="arrow-right"
              onSelect={(opt) => setSelectedOption(opt)}
            />
          </div>
        ),
        validate: () => selectedOption.length > 0,
        icon: (currentStep === 0 ? "circle" : "check-circle-solid") as IconName,
      },
      {
        label: "Confirmation",
        content: (
          <div className="space-y-md">
            <Title htmlVariant="h4">Step 2: Review your info</Title>
            <Toggle
              id="toggle-example"
              label="All good?"
              checked={checked}
              onToggleChange={() => setChecked(!checked)}
            />
          </div>
        ),
        validate: () => checked,
        icon: (currentStep <= 1 ? "circle" : "check-circle-solid") as IconName,
      },
      {
        label: "Finish the flow",
        content: (
          <div className="space-y-md">
            <Title htmlVariant="h4">
              Step 3: Just see the confirm label changing here
            </Title>
          </div>
        ),
        icon: "alert-triangle",
      },
    ];

    const handleClose = () => {
      setCurrentStep(0);
      setSelectedOption("");
      setChecked(false);
      setIsOpen(false);
    };

    const handleNext = () => {
      if (currentStep === modalSteps.length - 1) return;
      setCurrentStep((prev) => prev + 1);
    };

    const handleBack = () => {
      if (currentStep === 0) return;
      setCurrentStep((prev) => prev - 1);
    };

    return (
      <>
        <Button
          label="Open Modal"
          size="md"
          intent="default"
          color="main"
          onClick={() => setIsOpen(true)}
        />
        <ModalStepper
          {...args}
          open={isOpen}
          steps={modalSteps}
          initialStep={0}
          onClose={handleClose}
          onCloseButtonClick={handleClose}
          confirmButton={{
            ...args.confirmButton,
            label: args.confirmButton?.label || "Next",
            onClick: handleNext,
          }}
          cancelButton={{
            ...args.cancelButton,
            label: args.cancelButton?.label || "Back",
            onClick: handleBack,
          }}
        />
      </>
    );
  },
};
