import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { ChangeEvent, useEffect, useState } from "react";

import TextArea, { statuses } from "./TextArea";

/**
 * A component that allows users to input multiple lines of text.<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=2112-7351" target="_blank">Figma</a>
 */
const meta: Meta<typeof TextArea> = {
  component: TextArea,
  argTypes: {
    id: {
      table: { type: { summary: "string" } },
    },
    status: {
      options: Object.keys(statuses),
      table: { type: { summary: "string" } },
    },
    value: {
      table: { type: { summary: "string" } },
    },
    onChange: {
      table: { type: { summary: "function" } },
    },
    label: {
      table: { type: { summary: "string" } },
    },
    placeholder: {
      table: { type: { summary: "string" } },
    },
    required: {
      table: { type: { summary: "boolean" } },
    },
    disabled: {
      table: { type: { summary: "boolean" } },
    },
    helperText: {
      table: { type: { summary: "string" } },
    },
    statusText: {
      table: { type: { summary: "string" } },
    },
  },
};

export default meta;

type Story = StoryObj<typeof TextArea>;

export const Primary: Story = {
  name: "Text Area",
  render: (args) => {
    const [value, setValue] = useState(args.value);
    useEffect(() => {
      setValue(args.value);
    }, [args.value]);

    return (
      <TextArea
        {...args}
        value={value}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
          setValue(e.target.value)
        }
      />
    );
  },
  args: {
    id: "textarea",
    status: "default",
    value: "Fun with selectors",
    label: "Label",
    placeholder: "Placeholder",
    required: true,
    disabled: false,
    helperText: "I am helping you here!",
    statusText: "Status is either good or bad.",
  },
};
