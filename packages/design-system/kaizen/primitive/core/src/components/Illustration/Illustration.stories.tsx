import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

import { ILLUSTRATION_NAMES } from "./constants";
import { Illustration } from "./index";
import { sizes } from "./variants";

/**
 * Generic Illustration React component allowing to render illustrations for empty states, warnings, errors, etc.
 * Illustrations are hidden from screen readers by default unless an alt text is provided.
 */
const meta: Meta<typeof Illustration> = {
  component: Illustration,
  argTypes: {
    name: {
      options: ILLUSTRATION_NAMES,
      control: { type: "select" },
      table: { type: { summary: "string" } },
    },
    size: {
      options: Object.keys(sizes),
      control: { type: "select" },
      type: { name: "string", required: true },
    },
    alt: {
      control: "text",
      description:
        "Accessibility label. If provided, the illustration will be announced to screen readers.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Illustration>;

export const Primary: Story = {
  name: "Illustration",
  args: {
    name: "empty",
    size: "xl",
  },
};

export const AllIllustrations: Story = {
  name: "All illustrations",
  args: {
    size: "md",
  },
  render: (args) => {
    const copyToClipboard = (name: string) => {
      navigator.clipboard
        .writeText(name)
        .then(() => {
          alert(`Illustration name "${name}" copied to clipboard`);
        })
        .catch((err) => {
          console.error("Failed to copy to clipboard", err);
        });
    };

    return (
      <div className="flex flex-row items-start flex-wrap gap-md">
        {ILLUSTRATION_NAMES.map((name) => (
          <button
            key={name}
            className="flex flex-col items-center gap-sm max-w-element-2xl \
            hover:shadow-border-thin-default p-sm rounded-md"
            onClick={() => copyToClipboard(name)}
          >
            <Illustration size={args.size} name={name} />
            <span className="text-xs text-center">{name}</span>
          </button>
        ))}
      </div>
    );
  },
};

export const WithAccessibility: Story = {
  name: "Accessibility examples",
  args: {
    size: "lg",
  },
  parameters: {
    docs: {
      source: {
        code: `
      <div className="flex flex-col gap-lg">
        {/* Decorative illustration (hidden from screen readers) */}
        <div className="flex flex-row items-center gap-md">
          <Illustration name="empty" size="lg" />
          <span>Decorative illustration (hidden from screen readers)</span>
        </div>

        {/* Informative illustration with alt text */}
        <div className="flex flex-row items-center gap-md">
          <Illustration 
            name="warning" 
            size="lg" 
            alt="Warning: Your account will expire soon" 
          />
          <span>Informative illustration with alt text</span>
        </div>
      </div>`,
      },
    },
  },

  render: () => {
    return (
      <div className="flex flex-col gap-lg">
        {/* Decorative illustration (hidden from screen readers) */}
        <div className="flex flex-row items-center gap-md">
          <Illustration name="empty" size="lg" />
          <span>Decorative illustration (hidden from screen readers)</span>
        </div>

        {/* Informative illustration with alt text */}
        <div className="flex flex-row items-center gap-md">
          <Illustration
            name="warning"
            size="lg"
            alt="Warning: Your account will expire soon"
          />
          <span>Informative illustration with alt text</span>
        </div>
      </div>
    );
  },
};

export const DifferentSizes: Story = {
  name: "Different sizes",
  render: () => {
    const sizesList = Object.keys(sizes);

    return (
      <div className="flex flex-col gap-lg">
        {sizesList.map((size) => (
          <div key={size} className="flex flex-row items-center gap-md">
            <Illustration name="success" size={size as keyof typeof sizes} />
            <span>Size: {size}</span>
          </div>
        ))}
      </div>
    );
  },
};
