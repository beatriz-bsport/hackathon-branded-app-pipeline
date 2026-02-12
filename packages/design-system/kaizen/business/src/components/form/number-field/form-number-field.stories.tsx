import type { Meta, StoryObj } from "@storybook/react-vite";
import { z } from "zod";

import { ControlledForm, useFormController } from "@bsport/form";

import { FormNumberField } from "./form-number-field.component";

type FormNumberFieldComponent = typeof FormNumberField;

const metaComponentDescription = `
**FormNumberField** binds a number form field to a \`TextField\` component using \`@bsport/form\`.

It is designed to:
- Work inside a \`ControlledForm\`
- Enforce number-only field names at compile time
- Forward form state (\`value\`) to the underlying TextField

### When to use

- Use **FormNumberField** when the number value must be part of form state
- Prefer raw \`TextField\` for uncontrolled or local UI state
`;

const metaSourceCode = `
const schema = z.object({
  myNumberField: z.number().int().min(0).max(50),
});
      
const methods = useFormController({
  schema,
  defaultValues: {
    myNumberField: 0,
  },
});

<ControlledForm {...methods}>
  <FormNumberField<
    { myNumberField: number /* ...otherFields, etc */ },
    "myNumberField"
  >
    id="form-number-field-example"
    fieldName="myNumberField"
    ...
  />
</ControlledForm>
`;

const meta: Meta<FormNumberFieldComponent> = {
  component: FormNumberField,
  title: "Form/FormNumberField",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: metaComponentDescription,
      },
      source: {
        code: metaSourceCode,
      },
    },
  },
  render: () => {
    const schema = z.object({
      myNumberField: z.number(),
    });

    const methods = useFormController({
      schema,
      defaultValues: {
        myNumberField: 0,
      },
    });

    return (
      <ControlledForm {...methods} onSubmit={(data) => console.log(data)}>
        <FormNumberField<{ myNumberField: number }, "myNumberField">
          id="form-number-field-example"
          fieldName="myNumberField"
        />
      </ControlledForm>
    );
  },
  tags: ["autodocs"],
};

export default meta;

/**
 * Default - Inherit configuration from the meta object
 * Goal: Manipulate the story.
 */
export const Default: StoryObj<FormNumberFieldComponent> = {};

/**
 * Documentation - Inherit configuration from the meta object
 * Goal: Add story description to dive into implementation details.
 */
export const Documentation: StoryObj<FormNumberFieldComponent> = {
  parameters: {
    docs: {
      description: {
        story: `
### Form schema

The form schema defines the available fields and their types:

\`\`\`ts
const schema = z.object({
  myNumberField: z.number(), // Apply other constraints
});
\`\`\`

---

### Generic typing

\`FormNumberField\` is strongly typed using two generics:

\`\`\`ts
<FormNumberField<
  { myNumberField: number },
  "myNumberField"
>
\`\`\`

- **First generic**: the full form value shape
- **Second generic**: a number-only field name (enforced at type level)

This prevents accidentally binding a Number Field to a non-number field.

---

### Required props

| Prop | Description |
|------|------------|
| \`id\` | HTML id forwarded to the TextField |
| \`fieldName\` | Name of the number field in the form |
        `,
      },
    },
  },
};

const percentageSourceCode = `
const schema = z.object({
  rate: z.number().int().min(0).max(100),
});
      
const methods = useFormController({
  schema,
  defaultValues: {
    rate: 0,
  },
});

<ControlledForm {...methods}>
  <FormNumberField<
    { rate: number, ...otherFields },
    "rate"
  >
    id="form-rate-example"
    fieldName="rate"
    min={0}
    max={100}
    label="Apply a rate"
    suffix={{
      type: "text",
      value: "%",
    }}
  />
</ControlledForm>
`;

export const Percentage: StoryObj<FormNumberFieldComponent> = {
  parameters: {
    docs: {
      source: {
        code: percentageSourceCode,
      },
    },
  },
  render: () => {
    const schema = z.object({
      rate: z.number().int().min(0).max(100),
    });

    const methods = useFormController({
      schema,
      defaultValues: {
        rate: 50,
      },
    });

    return (
      <ControlledForm {...methods} onSubmit={(data) => console.log(data)}>
        <FormNumberField<{ rate: number }, "rate">
          id="form-field-example"
          fieldName="rate"
          min={0}
          max={100}
          label="Apply a rate"
          suffix={{
            type: "text",
            value: "%",
          }}
          required
        />
      </ControlledForm>
    );
  },
};
