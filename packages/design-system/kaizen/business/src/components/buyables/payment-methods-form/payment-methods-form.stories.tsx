import type { Meta, StoryObj } from "@storybook/react-vite";
import { z } from "zod";

import { ControlledForm, useFormController } from "@bsport/form";

import { PAYMENT_METHOD_IDENTIFIERS } from "./constants";
import { PaymentMethodsForm } from "./payment-methods-form.component";

type PaymentMethodsFormComponent = typeof PaymentMethodsForm;

const metaComponentDescription = `
**PaymentMethodsForm** is a business component that wraps a form field around a \`CheckboxGroup\`, specifically designed for selecting payment methods in a controlled form environment.

### Business Context

This component is intended for use in workflows where **payment method selection** is required, such as:
- Configuring available payment methods for a product, subscription, or order.
- Ensuring payment method IDs are validated and typed as a list of numbers.
- Integrating payment method selection into form state for easy submission and validation.

### How to import?

\`\`\`tsx
import { PaymentMethodsForm, PAYMENT_METHOD_IDENTIFIERS } from "@bsport/kaizen-business-components/buyables/payment-methods-form";
\`\`\`
`;

const metaSourceCode = `
import { PaymentMethodsForm, PAYMENT_METHOD_IDENTIFIERS } from "@bsport/kaizen-business-components/buyables/payment-methods-form";

// ...

const schema = z.object({
  available_payment_method_identifiers: z
    .array(z.coerce.number())
    .min(1, "Provide at least one payment method"),
});
      
const methods = useFormController({
  schema,
  defaultValues: {
    available_payment_method_identifiers: [PAYMENT_METHOD_IDENTIFIERS.ONLINE_PAYMENTS_ID],
  },
});

<ControlledForm {...methods}>
  <PaymentMethodsForm<
    { available_payment_method_identifiers: number[] /* ...otherFields, etc */ },
    "available_payment_method_identifiers"
  >
    id="buyables-payment-methods-example"
    fieldName="available_payment_method_identifiers"
    ...
  />
</ControlledForm>
`;

const meta: Meta<PaymentMethodsFormComponent> = {
  component: PaymentMethodsForm,
  title: "Buyables/PaymentMethodsForm",
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
      available_payment_method_identifiers: z
        .array(z.coerce.number())
        .min(1, "Provide at least one payment method"),
    });

    const methods = useFormController({
      schema,
      defaultValues: {
        available_payment_method_identifiers: [
          PAYMENT_METHOD_IDENTIFIERS.ONLINE_PAYMENTS_ID,
        ],
      },
    });

    return (
      <ControlledForm {...methods} onSubmit={(data) => console.log(data)}>
        <PaymentMethodsForm<
          { available_payment_method_identifiers: number[] },
          "available_payment_method_identifiers"
        >
          {...args}
          id="buyables-payment-methods-example"
          fieldName="available_payment_method_identifiers"
        />
      </ControlledForm>
    );
  },
  tags: ["autodocs"],
  args: {
    required: true,
    helperText: "This is a helper text",
  },
};

export default meta;

// Default - Inherit configuration from the meta object.
// Goal: Manipulate the story.
export const Default: StoryObj<PaymentMethodsFormComponent> = {};

// Documentation - Inherit configuration from the meta object.
// Goal: Add story description to dive into implementation details.
export const Documentation: StoryObj<PaymentMethodsFormComponent> = {
  parameters: {
    docs: {
      description: {
        story: `
### Form schema

The form schema defines the available fields and their types:

\`\`\`ts
const schema = z.object({
  myPaymentMethodsField: z.array(z.coerce.number()), // Apply other constraints
});
\`\`\`

---

### Generic typing

\`PaymentMethodsForm\` is strongly typed using two generics:

\`\`\`ts
<PaymentMethodsForm<
  { myPaymentMethodsField: number[] },
  "myPaymentMethodsField"
>
\`\`\`

- **First generic**: the full form value shape
- **Second generic**: a number-list-only field name (enforced at type level)

---

### Required props

| Prop | Description |
|------|------------|
| \`id\` | HTML id forwarded to the CheckboxGroup |
| \`fieldName\` | Name of the number-list field in the form |

### Additional props

They will be forwarded to the inner CheckboxGroup
        `,
      },
    },
  },
};
