import type { Meta, StoryObj } from "@storybook/react";
import React, { useEffect, useState } from "react";

import Button from "#src/components/Button";
import FormRadioGroup from "#src/components/FormRadioGroup";
import TextField from "#src/components/TextField";

/**
 * FormRadioGroup
 *
 * A flexible and accessible group of radio buttons rendered as a `<fieldset>`, using the `FormRadioField` component for each option.
 * This component allows users to select a single option from a provided list, with support for custom layout directions, disabling, and responsive label sizing.
 *
 * ## Features
 * - Renders a group of radio buttons with labels
 * - Supports horizontal or vertical alignment (`direction`)
 * - Handles accessibility via `role="radiogroup"`
 * - Dynamically aligns radio labels based on their width
 * - Integrates seamlessly with Tailwind or custom CSS via `className`
 *
 * ## Usage
 * ```
 * <FormRadioGroup
 *   id="payment-method"
 *   options={[
 *     { id: "card", label: "Credit Card", value: "card" },
 *     { id: "paypal", label: "PayPal", value: "paypal", element: <Button label="Connect" />, alertConfig: { status: "info", children: "PayPal is secure" } },
 *   ]}
 *   value="card"
 *   onChangeValue={(e) => console.log(e.target.value)}
 * />
 * ```
 *
 * ## Props
 * | Name        | Type                                                        | Default   | Description                                                        |
 * |-------------|-------------------------------------------------------------|-----------|--------------------------------------------------------------------|
 * | `id`        | `string`                                                    | —         | Unique identifier for the fieldset.                                |
 * | `label`     | `string`                                                    | —         | Optionnal text to display on top of the radio group.               |
 * | `options`   | `Array<FormRadioOptionsProps>`                              | —         | Array of radio button options to render.                           |
 * | `value`     | `string`                                                    | —         | The currently selected value.                                      |
 * | `onChangeValue` | `(event: React.ChangeEvent<HTMLInputElement>) => void`  | —         | Callback fired when selection changes.                             |
 * | `disabled`  | `boolean`                                                   | `false`   | If true, disables all radio buttons.                               |
 * | `direction` | `"start"` \| `"end"`                                        | `"start"` | Alignment of radio and label (`start` = left, `end` = right).      |
 * | `className` | `string`                                                    | —         | Additional CSS classes for the container.                          |
 * | `required`  | `boolean`                                                   | —         | If true, display an asterisk to tell this field is required        |
 * | ...props    | `React.FieldsetHTMLAttributes<HTMLFieldSetElement>`         | —         | Other native fieldset attributes.                                  |
 *
 * ## Accessibility
 * - Uses `role="radiogroup"` for assistive technologies.
 * - Each radio is associated with a label for clarity.
 *
 * ## See Also
 * - [FormRadioField](./FormRadioField)
 * - [Storybook Docs](https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-radiogroup--docs)
 *
 * @component
 */

const meta: Meta<typeof FormRadioGroup> = {
  component: FormRadioGroup,
  argTypes: {
    id: {
      control: { type: "text" },
    },
    label: {
      control: { type: "text" },
    },
    options: {
      control: { type: "object" },
      table: {
        type: {
          summary: "array",
          detail:
            "[{ id: string, value: string, helperText?: string, errorText?: string, element?: ReactNode, alertConfig?: AlertProps }]",
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
    required: {
      control: { type: "boolean" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof FormRadioGroup>;

export const Primary: Story = {
  name: "FormRadioGroup",
  render: (args) => {
    const [checked, setChecked] = useState(args.value);
    useEffect(() => {
      setChecked(args.value);
    }, [args.value]);

    return (
      <FormRadioGroup
        {...args}
        value={checked}
        onChangeValue={(event: React.ChangeEvent<HTMLInputElement>) =>
          setChecked(event.target.value)
        }
      />
    );
  },
  args: {
    label: "Choose your favorite fruit",
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
    required: true,
  },
};

export const WithElementsAndHelpers: Story = {
  name: "RadioGroup with elements and helpers",
  render: (args) => {
    const [checked, setChecked] = useState(args.value);
    useEffect(() => {
      setChecked(args.value);
    }, [args.value]);

    return (
      <FormRadioGroup
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
        element: (
          <Button
            intent="call-to-action"
            size="md"
            color="main"
            label="Click me"
          />
        ),
      },
      {
        id: "radio-2",
        value: "Orange",
        errorText: "Too much orange",
        element: (
          <Button
            intent="call-to-action"
            size="md"
            color="main"
            label="Click me"
          />
        ),
      },
      {
        id: "radio-3",
        value: "Banana",
        helperText: "another",
        errorText: "Too much banana",
        element: (
          <Button
            intent="call-to-action"
            size="md"
            color="main"
            label="Click me"
          />
        ),
      },
    ],
    value: "",
    disabled: false,
    direction: "start",
  },
};

export const WithCustomElements: Story = {
  name: "RadioGroup with custom elemements",
  render: (args) => {
    const [checked, setChecked] = useState(args.value);
    useEffect(() => {
      setChecked(args.value);
    }, [args.value]);

    return (
      <FormRadioGroup
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
        value: "Textfield with button in row",
        element: (
          <div className="flex flex-row gap-xs">
            <TextField
              id="textfield-test"
              type="text"
              placeholder="Text to write here"
            />

            <Button
              intent="call-to-action"
              size="md"
              color="main"
              label="Click me"
            />
          </div>
        ),
        alertConfig: {
          alert: {
            status: "warning",
            type: "weak",
            children:
              "Choosing '0' will remove the discount for the person who is referred",
          },
          position: "top",
        },
      },
      {
        id: "radio-2",
        value: "Textfield with button in column",
        helperText: "another looong helper textanother",
        element: (
          <div className="flex flex-col gap-xs">
            <TextField
              id="textfield-test"
              type="text"
              placeholder="Text to write here"
            />

            <Button
              intent="call-to-action"
              size="md"
              color="main"
              label="Click me"
            />
          </div>
        ),
      },
      {
        id: "radio-3",
        value: "Textfield alone",
        helperText:
          "another looong helper textanother looong helper textanother looong helper text",
        element: (
          <TextField
            id="textfield-test"
            type="text"
            placeholder="Text to write here"
          />
        ),
      },
      {
        id: "radio-4",
        value: "Textfield with label",
        element: (
          <TextField
            id="textfield-test"
            type="text"
            placeholder="Text to write here"
            label="Textfield with label"
          />
        ),
      },
    ],
    value: "",
    disabled: false,
    direction: "end",
  },
};

export const BasicExapleInFormsElements: Story = {
  name: "RadioGroup with basic forms exammples",
  render: (args) => {
    const [checked, setChecked] = useState(args.value);
    useEffect(() => {
      setChecked(args.value);
    }, [args.value]);

    const getOptions = () => {
      return args.options.map((option) => ({
        ...option,
        helperText:
          checked === "Percentage"
            ? "This is a helper text This is a helper textThis is a helper text vThis is a helper text"
            : option.helperText,
      }));
    };

    return (
      <div>
        <Button
          intent="call-to-action"
          size="md"
          color="main"
          label="Click me to see the radio group"
          onClick={() => {
            setChecked("");
          }}
        />
        <FormRadioGroup
          {...args}
          options={getOptions()}
          value={checked}
          onChangeValue={(event: React.ChangeEvent<HTMLInputElement>) =>
            setChecked(event.target.value)
          }
        />
      </div>
    );
  },
  args: {
    id: "radio-group-1",
    options: [
      {
        id: "radio-1",
        value: "Percentage",
        element: (
          <TextField
            id="textfield-test"
            type="text"
            placeholder="Text to write here"
            helperText={
              "another looong helper textanother looong helper textanother looong helper text"
            }
            suffix={{
              type: "text",
              value: "%",
            }}
          />
        ),
        alertConfig: {
          alert: {
            status: "warning",
            type: "weak",
            children:
              "Choosing '0' will remove the discount for the person who is referred",
          },
          position: "top",
        },
      },
      {
        id: "radio-2",
        value: "Amount",
        element: (
          <TextField
            id="textfield-test"
            type="text"
            status="error"
            placeholder="Text to write here"
            statusText="error no more than 2 decimals for this"
            suffix={{
              type: "text",
              value: "EUR",
            }}
          />
        ),
        alertConfig: {
          alert: {
            status: "warning",
            type: "weak",
            children:
              "Choosing '0' will remove the discount for the person who is referred",
          },
          position: "bottom",
        },
      },
    ],
    value: "",
    disabled: false,
    direction: "start",
  },
};
