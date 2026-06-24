import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { type ChipItem, ChipList } from "./chip-list";

/**
 * React component for a list of chips. It is a flexible container for displaying multiple chips,
 * with support for overflow handling via a popover.
 * <br>
 * <a href="https://docs.infra.bsport.io/docs/kaizen/dev/components/chip-list" target="_blank">Kaizen docs</a>
 */
const meta: Meta<typeof ChipList> = {
  component: ChipList,
  argTypes: {
    maxDisplay: {
      control: { type: "number", min: 1, max: 20, step: 1 },
      table: { type: { summary: "number" }, defaultValue: { summary: "7" } },
    },
    disabled: {
      control: { type: "boolean" },
      table: { defaultValue: { summary: "false" } },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ChipList>;

const defaultChips: ChipItem[] = [
  { id: "1", type: "weak", label: "Design", color: "main", size: "lg" },
  { id: "2", type: "weak", label: "Development", color: "default", size: "lg" },
  { id: "3", type: "weak", label: "Product", color: "positive", size: "lg" },
  { id: "4", type: "weak", label: "Marketing", color: "warning", size: "lg" },
  { id: "5", type: "weak", label: "Sales", color: "critical", size: "lg" },
  { id: "6", type: "weak", label: "Support", color: "info", size: "lg" },
  { id: "7", type: "weak", label: "HR", color: "default", size: "lg" },
  { id: "8", type: "weak", label: "Finance", color: "main", size: "lg" },
  { id: "9", type: "weak", label: "Legal", color: "info", size: "lg" },
];

export const Primary: Story = {
  name: "ChipList",
  render: (args) => {
    const [chips, setChips] = useState<ChipItem[]>(defaultChips);
    const handleDismissChip = (chipId: number | string) => {
      setChips(chips.filter((chip) => chip.id !== chipId));
    };
    return (
      <ChipList {...args} chips={chips} handleDismissChip={handleDismissChip} />
    );
  },
  args: {
    maxDisplay: 5,
    disabled: false,
  },
};

export const Overflow: Story = {
  name: "ChipList - Overflow",
  render: (args) => {
    const [chips, setChips] = useState<ChipItem[]>([
      ...defaultChips,
      {
        id: "10",
        type: "weak",
        label: "Operations",
        color: "warning",
        size: "lg",
      },
      { id: "11", type: "weak", label: "Research", color: "info", size: "lg" },
      {
        id: "12",
        type: "weak",
        label: "Analytics",
        color: "critical",
        size: "lg",
      },
    ]);
    const handleDismissChip = (chipId: number | string) => {
      setChips(chips.filter((chip) => chip.id !== chipId));
    };
    return (
      <ChipList {...args} chips={chips} handleDismissChip={handleDismissChip} />
    );
  },
  args: {
    maxDisplay: 4,
    disabled: false,
  },
};

export const Disabled: Story = {
  name: "ChipList - Disabled",
  args: {
    chips: defaultChips,
    maxDisplay: 5,
    disabled: true,
  },
};
