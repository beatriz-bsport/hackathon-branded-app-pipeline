import type { Meta, StoryObj } from "@storybook/react";
import React, { ChangeEvent, useEffect, useState } from "react";

import { icons } from "#src/components/Icon";

import TextField, { inputTypes, statuses } from "./TextField";

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
      control: { type: "inline-radio" },
      table: { type: { summary: "string" } },
    },
    value: {
      table: { type: { summary: "string" } },
    },
    type: {
      options: inputTypes,
      control: { type: "select" },
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
    fullWidth: {
      table: {
        type: {
          summary: "boolean",
          detail:
            "will make the component take all the parent available width or not",
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
    type: "text",
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
    fullWidth: false,
  },
};

/**
 *  Showcases the color picker with the input alongside the textfield. This is a native browser feature, so the modal will behave differently on Firefox, Chrome, and mobile.
 */
export const TextFieldColorPicker: Story = {
  name: "Text Field color picker",
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
    type: "color",
    status: "default",
    value: "#abc667",
    onChange: () => {},
    onClear: () => {},
    label: "Label",
    placeholder: "Placeholder",
    required: true,
    disabled: false,
    helperText: "I am helping you here!",
    statusText: "Status is either good or bad.",
    fullWidth: false,
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
    type: "text",
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
    fullWidth: false,
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
    type: "text",
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
    fullWidth: false,
    prefix: { type: "color", value: "#32a69e" },
    suffix: { type: "icon", value: "arrow-right" },
  },
};

/**
 * The parent is bigger than the textfield, so if you put the fullWidth params to true it will take all the availanle width outside of the max width set to a textfield.
 */
export const TextFieldWithBiggerParent: Story = {
  name: "Text Field with bigger parent",
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
    type: "text",
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
    fullWidth: true,
  },
};

export const TextfieldWithIcon: Story = {
  name: "Text Field with icon",
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
    type: "text",
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
    fullWidth: true,
    iconRight: "chevron-down",
  },
};
