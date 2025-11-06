import {
  Controls,
  Description,
  Primary,
  Stories,
  Story,
  Subtitle,
  Title,
} from "@storybook/blocks";
import type { Meta, StoryObj } from "@storybook/react";
import React, { useEffect, useId, useState } from "react";

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
    onChange: {
      table: { type: { summary: "function" } },
    },
  },
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
          <Controls />
          {/* 🟢 Only show the stories list, no Primary story */}
          <Stories includePrimary={false} />
        </>
      ),
    },
  },
};

export default meta;

type Story = StoryObj<typeof RadioGroup>;

export const ControlledComponent: Story = {
  name: "Controlled Radio Group",
  render: (args) => {
    const id = useId();
    const [checked, setChecked] = useState(args.value);
    useEffect(() => {
      setChecked(args.value);
    }, [args.value]);

    return (
      <RadioGroup
        {...args}
        id={id}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setChecked(event.target.value);
        }}
        value={checked}
      />
    );
  },
  args: {
    id: "radio-group-1",
    options: [
      {
        value: "mango",
        label: "You want Mango",
        helperText: "bsport’s favourite",
      },
      {
        value: "orange",
        label: "Or you prefer Orange",
        errorText: "Too much orange",
      },
      {
        value: "banana",
        label: "Maybe Banana",
        helperText: "another looong helper text",
        errorText: "Too much banana",
      },
    ],
    value: "mango",
    disabled: false,
    direction: "start",
  },
};
