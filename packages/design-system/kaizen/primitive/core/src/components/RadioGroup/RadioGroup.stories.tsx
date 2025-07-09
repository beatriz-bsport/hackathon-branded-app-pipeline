import type { Meta, StoryObj } from "@storybook/react";
import React, { useEffect, useState } from "react";

import RadioGroup from "./RadioGroup";

/**
 * A group of radio buttons presented as a single component.
 * This component is used to render a set of radio buttons, allowing the user to select
 * a single option from the provided list.<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Kaizen-library?node-id=2069-5293&t=m4qTMe7zQfpmdCzB-4" target="_blank">Figma</a><br>
 * <a href="https://bsport.supernova-docs.io/latest/components/form-controls/radio/component-overview-sFKOXDqa" target="_blank">Supernova docs</a>
 */
const meta: Meta<typeof RadioGroup> = {
  component: RadioGroup,
  argTypes: {
    id: {
      control: { type: "text" },
    },
    options: {
      control: { type: "object" },
      table: {
        type: {
          summary: "array",
          detail:
            "[{ id: string, value: string, helperText?: string, errorText?: string }]",
        },
      },
    },
    disabled: {
      control: { type: "boolean" },
    },
    direction: {
      control: { type: "inline-radio" },
      table: { type: { summary: "string" } },
      options: ["start", "end"],
    },
    onChangeValue: {
      table: { type: { summary: "function" } },
    },
  },
};

export default meta;

type Story = StoryObj<typeof RadioGroup>;

export const Primary: Story = {
  name: "RadioGroup",
  render: (args) => {
    const [checked, setChecked] = useState(args.value);
    useEffect(() => {
      setChecked(args.value);
    }, [args.value]);

    return (
      <RadioGroup
        {...args}
        value={checked}
        onChangeValue={(event: React.ChangeEvent<HTMLInputElement>) =>
          setChecked(event.target.value)
        }
      />
    );
  },
  args: {
    id: "radio-group-1",
    options: [
      {
        id: "radio-1",
        value: "Mango",
        helperText: "bsport’s favourite",
      },
      {
        id: "radio-2",
        value: "Orange",
        errorText: "Too much orange",
      },
      {
        id: "radio-3",
        value: "Banana",
        helperText: "another looong helper text",
        errorText: "Too much banana",
      },
    ],
    value: "",
    disabled: false,
    direction: "start",
  },
};
