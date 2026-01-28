import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useEffect, useState } from "react";

import ProgressBar, { sizes, statuses } from "./ProgressBar";

/**
 * A React component representing a progress bar used in Kaizen, which visually indicates the
 * advancement of a work in progress. The progress bar can be customized in terms of size,
 * color (status), and an optional label, and supports dynamic progression from 0 to 100.<br>
 * The progress bar supports the following statuses (colors): `main
 * - `main`: Default state.<br>
 * - `positive`: Indicates a positive or successful progress.<br>
 * - `critical`: Indicates a critical or failure state.<br>
 *
 * The component can display an optional label above the progress bar to indicate which work
 * is in progress.<br>
 * The progression rate (value) should be between 0 and 100. If the value is outside this range,
 * it will be automatically rounded to the nearest bound (0 or 100).<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=807-3060&node-type=canvas&t=3UciOkPMOtsr2hV4-0" target="_blank">Figma</a><br>
 */
const meta: Meta<typeof ProgressBar> = {
  component: ProgressBar,
  argTypes: {
    size: {
      options: Object.keys(sizes),
      control: { type: "inline-radio" },
      table: { type: { summary: "string" } },
    },
    status: {
      options: Object.keys(statuses),
      control: { type: "select" },
      table: { type: { summary: "string" } },
    },
    value: {
      control: { type: "number" },
    },
    label: {
      control: { type: "text" },
    },
    message: {
      control: { type: "text" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ProgressBar>;

export const ProgressBarTransition: Story = {
  name: "ProgressBar transition",
  args: {
    size: "md",
    status: "main",
    label: "Loading your data",
  },
  render: (args) => {
    const [animatedValue, setAnimatedValue] = useState(0);

    useEffect(() => {
      const timeouts = [
        { delay: 750, value: 30 },
        { delay: 2000, value: 55 },
        { delay: 3500, value: 77 },
        { delay: 5500, value: 100 },
      ];

      timeouts.forEach((timeout) => {
        setTimeout(() => {
          setAnimatedValue(timeout.value);
        }, timeout.delay);
      });

      // Cleanup timeouts if the component unmounts
      return () => {
        timeouts.forEach((timeout) => {
          clearTimeout(timeout.delay);
        });
      };
    }, []);

    return (
      <ProgressBar
        value={args.value || animatedValue}
        size={args.size}
        label={args.label}
        status={animatedValue === 100 ? "positive" : args.status}
        message={
          args?.message ||
          (animatedValue === 100 && "Uploaded successfully !") ||
          ""
        }
      />
    );
  },
};

export const ProgressBarSmMain: Story = {
  name: "ProgressBar Sm & Main status",
  args: {
    size: "sm",
    status: "main",
    value: 30,
  },
};

export const ProgressBarMdPositive: Story = {
  name: "ProgressBar Md & Positive status",
  args: {
    size: "md",
    status: "positive",
    value: 50,
  },
};

export const ProgressBarLgCritical: Story = {
  name: "ProgressBar Lg & Critical status",
  args: {
    size: "lg",
    status: "critical",
    value: 70,
  },
};

export const ProgressBarWithLabel: Story = {
  name: "ProgressBar With Label",
  args: {
    size: "md",
    status: "positive",
    value: 50,
    label: "Hello world",
  },
};
