import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import Checkbox from "#src/components/Checkbox";
import { TYPOGRAPHY_COLORS } from "#src/constants";

import CheckboxGroup from "./CheckboxGroup";

const meta: Meta<typeof CheckboxGroup> = {
  title: "Components/CheckboxGroup",
  component: CheckboxGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
A flexible **CheckboxGroup** component that allows users to select one or multiple options.  

It supports two main usage patterns:  
- **Declarative**: pass an \`options\` array (uncontrolled or controlled).  
- **Composable**: pass a \`Checkboxes\` array of components (Checkbox).  

### Features
- Controlled and uncontrolled modes
- Optional helper text and status messages
- Supports required labels
- Fully composable with custom \`<Checkbox>\` provided inside \`Checkboxes\` prop

### Usage example
\`\`\`tsx
import { CheckboxGroup } from "@bsport/kaizen-primitive-core";

export const MyGroup = () => {
  const checkboxOptions = [
    {
      id: 'option-1',
      label: 'First option'
    },
    {
      helperText: 'This is an helper text',
      id: 'option-2',
      label: 'Option with helper text'
    },
    {
      errorText: 'This is an error text',
      id: 'option-3',
      label: 'Option with error text'
    }
  ];
  const initiallyChecked = ['option-2'];

  return (
    <CheckboxGroup
      initialCheckedIds={initiallyChecked}
      direction="start"
      helperText="This is the helper text of the checkbox group"
      label="My field name"
      options={checkboxOptions}
      required
      status="positive"
      statusText="This is the status of the checkbox group"
    />
  );
} 
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    label: {
      control: "text",
      description: "Main label displayed above the checkbox group.",
    },
    required: {
      control: "boolean",
      description: "Marks the field as required by adding an asterisk.",
    },
    helperText: {
      control: "text",
      description: "Additional helper text displayed below the label.",
    },
    statusText: {
      control: "text",
      description: "Text to display a validation or status message.",
    },
    status: {
      options: Object.keys(TYPOGRAPHY_COLORS),
      control: { type: "select" },
      description:
        "Defines the color of the status text. Defaults to 'default'.",
    },
    direction: {
      control: "radio",
      options: ["start", "end"],
      description: "Alignment of the label and helper text.",
    },
    options: {
      control: "object",
      description:
        "List of options for the declarative API. Each option requires an `id` and `label`, and may include `helperText` or `errorText`.",
    },
    Checkboxes: {
      control: false,
      description: "Custom list of `<Checkbox>` nodes for the composable API.",
    },
    checkedIds: {
      control: false,
      description: "Controlled list of checked option IDs.",
    },
    setCheckedIds: {
      control: false,
      description: "Setter function for controlled checked IDs.",
    },
    initialCheckedIds: {
      control: "object",
      description: "Initial selection for uncontrolled usage.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof CheckboxGroup>;

const commonArgs = {
  status: "positive",
  statusText: "This is the status of the checkbox group",
  helperText: "This is the helper text of the checkbox group",
  label: "My field name",
  required: true,
  direction: "start",
} as const;

const checkboxOptions = [
  {
    id: "option-1",
    label: "First option",
  },
  {
    id: "option-2",
    label: "Option with helper text",
    helperText: "This is an helper text",
  },
  {
    id: "option-3",
    label: "Option with error text",
    errorText: "This is an error text",
  },
];

/**
 * ✅ Story 1: Uncontrolled with initial selection
 */
export const DeclarativeAndUncontrolled: Story = {
  args: {
    options: checkboxOptions,
    ...commonArgs,
    initialCheckedIds: ["option-2"],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Uncontrolled usage: selection is managed internally. Use `initialCheckedIds` to set a default state.",
      },
    },
  },
};

/**
 * ✅ Story 2: Controlled with external state
 */
export const DeclarativeAndControlled: Story = {
  args: {
    options: checkboxOptions,
    ...commonArgs,
  },
  render: (args) => {
    const [selection, setSelection] = useState(["option-2"]);
    return (
      <CheckboxGroup
        {...args}
        setCheckedIds={setSelection}
        checkedIds={selection}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Controlled usage: selection is fully managed by external state. Pass `checkedIds` and `setCheckedIds`.",
      },
    },
  },
};

/**
 * ✅ Story 3: Composable API with custom Checkboxes
 */
export const Composable: Story = {
  args: commonArgs,
  render: (args) => {
    const [selection, setSelection] = useState(new Set(["option-2"]));
    return (
      <CheckboxGroup
        {...args}
        Checkboxes={checkboxOptions.map((config) => (
          <Checkbox
            key={config.id}
            {...config}
            value={selection.has(config.id) ? "checked" : "unchecked"}
            onChange={(value) => {
              const nextState = new Set(selection);
              if (value) {
                nextState.add(config.id);
              } else {
                nextState.delete(config.id);
              }
              setSelection(nextState);
            }}
          />
        ))}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Composable usage: build a custom group by passing `<Checkbox>` nodes manually in `Checkboxes` props. This allows for advanced customization.",
      },
    },
  },
};
