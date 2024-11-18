import React, { ChangeEvent, useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import TextField, { statuses, inputTypes } from "./TextField";
import { icons } from "../Icon";

/**
 * A component that allows users to input a single line of text.<br>
 * Icons, a prefix, and a suffix can be added to the component.<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=338-24787" target="_blank">Figma</a>
 */
const meta: Meta<typeof TextField> = {
  component: TextField,
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
    type: {
      options: inputTypes,
      table: { type: { summary: "string" } },
    },
    onChange: {
      table: { type: { summary: "function" } },
    },
    onClear: {
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
    iconLeft: {
      options: [undefined, ...Object.keys(icons)],
      control: { type: "select" },
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "undefined" },
      },
    },
    iconRight: {
      options: [undefined, ...Object.keys(icons)],
      control: { type: "select" },
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "undefined" },
      },
    },
    prefix: {
      control: { type: "object" },
      table: {
        type: {
          summary: "object",
          detail:
            '{ type: "text" | "country" | "color" | "icon", value: string | IconName }',
        },
      },
    },
    suffix: {
      control: { type: "object" },
      table: {
        type: {
          summary: "object",
          detail:
            '{ type: "text" | "country" | "color" | "icon", value: string | IconName }',
        },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof TextField>;

export const TextFieldBasic: Story = {
  name: "Text Field basic",
  render: (args) => {
    const [value, setValue] = useState(args.value);
    useEffect(() => {
      setValue(args.value);
    }, [args.value]);

    return (
      <TextField
        {...args}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setValue(e.target.value)
        }
        onClear={() => setValue("")}
      />
    );
  },
  args: {
    id: "textfield",
    status: "default",
    value: "Fun with selectors",
    onChange: () => {},
    onClear: () => {},
    label: "Label",
    placeholder: "Placeholder",
    required: true,
    disabled: false,
    helperText: "I am helping you here!",
    statusText: "Status is either good or bad.",
  },
};

export const TextFieldWithIcons: Story = {
  name: "Text Field with icons",
  render: (args) => {
    const [value, setValue] = useState(args.value);
    useEffect(() => {
      setValue(args.value);
    }, [args.value]);

    return (
      <TextField
        {...args}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setValue(e.target.value)
        }
        onClear={() => setValue("")}
      />
    );
  },
  args: {
    id: "textfield",
    status: "default",
    value: "Fun with selectors",
    onChange: () => {},
    onClear: () => {},
    label: "Label",
    placeholder: "Placeholder",
    required: true,
    disabled: false,
    helperText: "I am helping you here!",
    statusText: "Status is either good or bad.",
    iconLeft: "message-question-square",
    iconRight: "loading",
  },
};

/**
 * Can pass a color as a string ("blue"), a hexcode ("#32a69e"), or a rgb value ("rgb(50, 166, 158)").
 */
export const TextFieldWithPrefixSuffix: Story = {
  name: "Text Field with prefix & suffix",
  render: (args) => {
    const [value, setValue] = useState(args.value);
    useEffect(() => {
      setValue(args.value);
    }, [args.value]);

    return (
      <TextField
        {...args}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setValue(e.target.value)
        }
        onClear={() => setValue("")}
      />
    );
  },
  args: {
    id: "textfield",
    status: "default",
    value: "",
    onChange: () => {},
    onClear: () => {},
    label: "Label",
    placeholder: "Placeholder",
    required: true,
    disabled: false,
    helperText: "I am helping you here!",
    statusText: "Status is either good or bad.",
    prefix: { type: "color", value: "#32a69e" },
    suffix: { type: "icon", value: "arrow-right" },
  },
};
