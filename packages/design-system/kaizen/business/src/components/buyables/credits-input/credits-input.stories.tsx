import type { Meta, StoryObj } from "@storybook/react-vite";
import { useId } from "react";
import { z } from "zod";

import { ControlledForm, useFormController } from "@bsport/form";

import { CreditsInput } from "./credits-input";

type CreditsInputComponent = typeof CreditsInput;

const metaComponentDescription = `
**CreditsInput** is a business component for entering a credit amount and being able to see the effective credit amount
based on the credit factor.

It wraps:
- \`FormNumberField\` — to bind the value to a form field
- \`useCreditFactor\` — to derive the credit-factor-adjusted display value from the company theme

### When to use

- Use **CreditsInput** when the user must enter a credit amount tied to the company \`pass_credit_factor\`
- Prefer raw \`FormNumberField\` when the field is not credits-related

### How to import?

\`\`\`tsx
import { CreditsInput } from "@bsport/kaizen-business-components/core/credits-input";
\`\`\`
`;

const metaSourceCode = `
const schema = z.object({
  credits: z.number().int().min(0),
});

const methods = useFormController({
  schema,
  defaultValues: {
    credits: 0,
  },
});

<ControlledForm {...methods}>
  <CreditsInput<
    { credits: number /* ...otherFields, etc */ },
    "credits"
  >
    id="credits-input-example"
    fieldName="credits"
    passCreditFactor={companyTheme?.pass_credit_factor}
    getHelperText={(effectiveCredits) =>
      t("displayEffectiveCredits", { effectiveCredits })
    }
  />
</ControlledForm>
`;

const meta: Meta<CreditsInputComponent> = {
  component: CreditsInput,
  title: "Buyables/CreditsInput",
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
  render: (args) => {
    const schema = z.object({
      credits: z.number().int().min(0),
    });

    const methods = useFormController({
      schema,
      defaultValues: {
        credits: 0,
      },
      mode: "onChange",
    });

    const id = `credits-input-example-${useId()}`;

    return (
      <ControlledForm {...methods} onSubmit={(data) => console.log(data)}>
        <CreditsInput<{ credits: number }, "credits">
          {...args}
          id={id}
          fieldName="credits"
        />
      </ControlledForm>
    );
  },
  args: {
    passCreditFactor: 1,
    required: true,
    disabled: false,
  },
  tags: ["autodocs"],
};

export default meta;

// Default - Inherit configuration from the meta object.
// Goal: Manipulate the story.
export const Default: StoryObj<CreditsInputComponent> = {};

// With a custom helperText derived from the credit factor display
export const WithCustomHelperText: StoryObj<CreditsInputComponent> = {
  args: {
    passCreditFactor: 2,
    getHelperText: ({ creditsMessage }) =>
      `Will cost ${creditsMessage} to book the session`,
  },
};

// Documentation - Inherit configuration from the meta object.
// Goal: Add story description to dive into implementation details.
export const Documentation: StoryObj<CreditsInputComponent> = {
  parameters: {
    docs: {
      description: {
        story: `
### Form schema

The form schema defines the available fields and their types:

\`\`\`ts
const schema = z.object({
  credits: z.number().int().min(0), // Apply other constraints
});
\`\`\`

---

### Generic typing

\`CreditsInput\` is strongly typed using two generics:

\`\`\`ts
<CreditsInput<
  { credits: number },
  "credits"
>
\`\`\`

- **First generic**: the full form value shape
- **Second generic**: a number-only field name (enforced at type level)

---

### Required props

| Prop | Description |
|------|------------|
| \`id\` | HTML id forwarded to the underlying TextField |
| \`fieldName\` | Name of the number field in the form |

### Optional props

| Prop | Description |
|------|------------|
| \`passCreditFactor\` | Company theme \`pass_credit_factor\`. Defaults to \`1\` when missing. |
| \`getHelperText\` | Dynamic helper text builder receiving adjusted inputs |

The label defaults to the translated \`"Credits"\` string and can be overridden via the \`label\` prop.
Additional \`TextFieldProps\` are forwarded to the inner \`FormNumberField\`.
        `,
      },
    },
  },
};
