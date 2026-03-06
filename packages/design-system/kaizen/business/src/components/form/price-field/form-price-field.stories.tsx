import type { Meta, StoryObj } from "@storybook/react-vite";
import { z } from "zod";

import { ControlledForm, useFormController } from "@bsport/form";

import { FormPriceField } from "./form-price-field.component";

type FormPriceFieldComponent = typeof FormPriceField;

const metaComponentDescription = `
**FormPriceField** binds a price form field (stored as cents) to a \`TextField\` component using \`@bsport/form\`.

It is designed to:
- Work inside a \`ControlledForm\`
- Store cents in form state while displaying euros in the input
- Enforce number-only field names at compile time
- Validate and commit the price on blur (so the user can freely type intermediate values)
- Support min/max constraints, decimal or whole-euro mode, and a currency suffix

### When to use

- Use **FormPriceField** when you need a price input that stores cents in form state
- Prefer raw \`TextField\` or \`FormNumberField\` when the field is not a price
`;

const metaSourceCode = `
const schema = z.object({
  priceCts: z.number().min(0),
});

const methods = useFormController({
  schema,
  defaultValues: {
    priceCts: 1000, // 10.00€
  },
});

<ControlledForm {...methods}>
  <FormPriceField<
    { priceCts: number /* ...otherFields, etc */ },
    "priceCts"
  >
    id="form-price-field-example"
    fieldName="priceCts"
    defaultCts={1000}
    label="Price"
    ...
  />
</ControlledForm>
`;

const meta: Meta<FormPriceFieldComponent> = {
  component: FormPriceField,
  title: "Form/FormPriceField",
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
      priceCts: z.number().min(0),
    });

    const methods = useFormController({
      schema,
      defaultValues: {
        priceCts: 1000,
      },
    });

    return (
      <ControlledForm {...methods} onSubmit={(data) => console.log(data)}>
        <FormPriceField<{ priceCts: number }, "priceCts">
          id="form-price-field-example"
          fieldName="priceCts"
          defaultCts={1000}
          label="Price"
        />
      </ControlledForm>
    );
  },
  tags: ["autodocs"],
};

export default meta;

// Default - Inherit configuration from the meta object.
// Goal: Manipulate the story.
export const Default: StoryObj<FormPriceFieldComponent> = {};

// Documentation - Inherit configuration from the meta object.
// Goal: Add story description to dive into implementation details.
export const Documentation: StoryObj<FormPriceFieldComponent> = {
  parameters: {
    docs: {
      description: {
        story: `
### Form schema

The form schema defines the available fields and their types.
The price field stores **cents** (integer):

\`\`\`ts
const schema = z.object({
  priceCts: z.number().min(0), // Apply other constraints
});
\`\`\`

---

### Generic typing

\`FormPriceField\` is strongly typed using two generics:

\`\`\`ts
<FormPriceField<
  { priceCts: number },
  "priceCts"
>
\`\`\`

- **First generic**: the full form value shape
- **Second generic**: a number-only field name (enforced at type level)

This prevents accidentally binding a Price Field to a non-number field.

---

### Required props

| Prop | Description |
|------|------------|
| \`id\` | HTML id forwarded to the TextField |
| \`fieldName\` | Name of the number field in the form (stores cents) |

---

### Price-specific props

| Prop | Default | Description |
|------|---------|------------|
| \`defaultCts\` | \`0\` | Fallback value in cents when input is empty or invalid on blur |
| \`minCts\` | \`0\` | Minimum allowed value in cents |
| \`maxCts\` | — | Maximum allowed value in cents (no limit when omitted) |
| \`allowDecimals\` | \`true\` | Whether decimal euro amounts are accepted |
| \`currencySuffix\` | auto | Currency symbol shown as suffix (defaults to \`getCurrencyDisplay()\`) |
| \`onPriceCommit\` | — | Callback fired after a valid price is committed on blur |
        `,
      },
    },
  },
};

const wholeEuroSourceCode = `
const schema = z.object({
  giftCardCts: z.number().int().min(500).max(50000),
});

const methods = useFormController({
  schema,
  defaultValues: {
    giftCardCts: 500, // 5€
  },
});

<ControlledForm {...methods}>
  <FormPriceField<
    { giftCardCts: number, ...otherFields },
    "giftCardCts"
  >
    id="form-gift-card-example"
    fieldName="giftCardCts"
    defaultCts={500}
    minCts={500}
    maxCts={50000}
    allowDecimals={false}
    label="Gift card amount"
  />
</ControlledForm>
`;

export const WholeEuro: StoryObj<FormPriceFieldComponent> = {
  parameters: {
    docs: {
      source: {
        code: wholeEuroSourceCode,
      },
    },
  },
  render: () => {
    const schema = z.object({
      giftCardCts: z.number().int().min(500).max(50000),
    });

    const methods = useFormController({
      schema,
      defaultValues: {
        giftCardCts: 500,
      },
    });

    return (
      <ControlledForm {...methods} onSubmit={(data) => console.log(data)}>
        <FormPriceField<{ giftCardCts: number }, "giftCardCts">
          id="form-gift-card-example"
          fieldName="giftCardCts"
          defaultCts={500}
          minCts={500}
          maxCts={50000}
          allowDecimals={false}
          label="Gift card amount"
        />
      </ControlledForm>
    );
  },
};

const withMinMaxSourceCode = `
const schema = z.object({
  itemPriceCts: z.number().min(100).max(100000),
});

const methods = useFormController({
  schema,
  defaultValues: {
    itemPriceCts: 2500, // 25.00€
  },
});

<ControlledForm {...methods}>
  <FormPriceField<
    { itemPriceCts: number, ...otherFields },
    "itemPriceCts"
  >
    id="form-item-price-example"
    fieldName="itemPriceCts"
    defaultCts={2500}
    minCts={100}
    maxCts={100000}
    label="Item price"
    onPriceCommit={(cts) => console.log('Committed:', cts)}
  />
</ControlledForm>
`;

export const WithMinMax: StoryObj<FormPriceFieldComponent> = {
  parameters: {
    docs: {
      source: {
        code: withMinMaxSourceCode,
      },
    },
  },
  render: () => {
    const schema = z.object({
      itemPriceCts: z.number().min(100).max(100000),
    });

    const methods = useFormController({
      schema,
      defaultValues: {
        itemPriceCts: 2500,
      },
    });

    return (
      <ControlledForm {...methods} onSubmit={(data) => console.log(data)}>
        <FormPriceField<{ itemPriceCts: number }, "itemPriceCts">
          id="form-item-price-example"
          fieldName="itemPriceCts"
          defaultCts={2500}
          minCts={100}
          maxCts={100000}
          label="Item price"
          onPriceCommit={(cts) => console.log("Committed:", cts)}
        />
      </ControlledForm>
    );
  },
};
