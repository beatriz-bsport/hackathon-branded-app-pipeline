import type { Meta, StoryObj } from "@storybook/react-vite";
import { useId, useState } from "react";
import { z } from "zod";

import { ControlledForm, useFormController } from "@bsport/form";

import { fetch } from "#src/utils/fetch";

import { BookkeepingAccountFormSelector } from "./form-selector";
import { BookkeepingAccountRawSelector } from "./raw-selector";
import { BookkeepingAccountRawSelectorInner } from "./raw-selector-inner";

const metaComponentDescription = `
**BookkeepingAccountFormSelector** provides a dropdown selector for bookkeeping accounts, designed for both controlled form environments and raw usage.

### Business Context

This component is used to select a bookkeeping account from a list, displaying the account name and VAT rate. It is useful in workflows such as:
- Financial reporting
- Invoice creation
- Expense tracking
- Buyables purchase settings

It handles internally data fetching and reload.

### How to import?

\`\`\`tsx
import {
  BookkeepingAccountFormSelector,
} from "@bsport/kaizen-business-components/financial-services/bookkeeping-account/selector";
\`\`\`
`;

const metaSourceCode = `
const schema = z.object({
  bookkeeping_account: z.number().nullable(),
  tax: z.number().nullable(),
});

const methods = useFormController({
  schema,
  defaultValues: {
    bookkeeping_account: null,
    tax: null,
  },
});

// Usage within a form:
<ControlledForm {...methods}>
  <BookkeepingAccountFormSelector<
    { bookkeeping_account: number | null, tax: number | null },
    "bookkeeping_account",
    "tax"
    >
    idFieldName="bookkeeping_account"
    taxFieldName="tax"
    withCreationFlow
    ...
  />
</ControlledForm>

// Raw usage:
<BookkeepingAccountRawSelector
  value={selectedAccountId}
  onChange={(id) => setSelectedAccountId(id)}
  onChangeTax={(tax) => setSelectedAccountTax(tax)}
  onClear={() => {
    setSelectedAccountId(null);
    setSelectedAccountTax(null);
  }}
/>
`;

type BookkeepingAccountFormSelectorComponent =
  typeof BookkeepingAccountFormSelector;
type BookkeepingAccountRawSelectorComponent =
  typeof BookkeepingAccountRawSelector;
type BookkeepingAccountRawSelectorInnerComponent =
  typeof BookkeepingAccountRawSelectorInner;

const meta: Meta<BookkeepingAccountFormSelectorComponent> = {
  component: BookkeepingAccountFormSelector,
  title: "Financial Services/Bookkeeping Account/Selector",
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
  argTypes: {
    popoverPlacement: {
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "bottom-right" },
      },
      options: [
        undefined,
        "top",
        "top-left",
        "top-right",
        "bottom",
        "bottom-left",
        "bottom-right",
        "left",
        "right",
      ],
      control: { type: "select" },
    },
    popoverClassName: {
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "w-component-popover-min" },
      },
      control: { type: "text" },
    },
    anchorClassName: {
      defaultValue: {
        summary: "min-w-component-popover-min max-w-full",
      },
      table: { type: { summary: "string" } },
      control: { type: "text" },
    },
  },
  render: ({ idFieldName: _id, taxFieldName: _tax, ...args }) => {
    const schema = z.object({
      bookkeeping_account: args.required ? z.number() : z.number().nullable(),
      tax: args.required ? z.number() : z.number().nullable(),
    });

    const methods = useFormController({
      schema,
      defaultValues: {
        bookkeeping_account: null,
        tax: null,
      },
    });

    const id = useId();

    return (
      <ControlledForm
        id={id}
        {...methods}
        onSubmit={(data) => console.log(data)}
      >
        <BookkeepingAccountFormSelector<
          { bookkeeping_account: number | null; tax: number | null },
          "bookkeeping_account",
          "tax"
        >
          idFieldName="bookkeeping_account"
          taxFieldName="tax"
          {...args}
        />
        <button form={id} className="mt-md">
          Log results
        </button>
      </ControlledForm>
    );
  },
  args: {
    popoverPlacement: "bottom-right",
    popoverClassName: "w-component-popover-min",
    anchorClassName: "min-w-component-popover-min max-w-full",
    required: false,
    fetch: fetch,
    withCreationFlow: true,
    taxFieldClearedValue: 0,
  },
  tags: ["autodocs"],
};

export default meta;

// Default - Inherit configuration from the meta object
// Goal: Manipulate and see the story.
export const Default: StoryObj<BookkeepingAccountFormSelectorComponent> = {};

const rawSelectorSourceCode = `
const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);

<BookkeepingAccountRawSelector
  value={selectedAccountId}
  onChange={(id) => setSelectedAccountId(id)}
  onClear={() => setSelectedAccountId(null)}
/>
`;
// Raw Selector - Show raw usage
export const RawSelector: StoryObj<BookkeepingAccountRawSelectorComponent> = {
  parameters: {
    docs: {
      source: {
        code: rawSelectorSourceCode,
      },
    },
  },
  render: (args) => {
    const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
      args.value ?? null,
    );
    return (
      <BookkeepingAccountRawSelector
        {...args}
        value={selectedAccountId}
        onChange={(id) => setSelectedAccountId(id)}
        onClear={() => setSelectedAccountId(null)}
      />
    );
  },
};

export const EmptySelector: StoryObj<BookkeepingAccountRawSelectorInnerComponent> =
  {
    render: (args) => {
      const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
        args.value ?? null,
      );
      return (
        <BookkeepingAccountRawSelectorInner
          {...args}
          value={selectedAccountId}
          onChange={(id) => setSelectedAccountId(id)}
          onClear={() => setSelectedAccountId(null)}
        />
      );
    },
    args: {
      isLoading: false,
      withCreationFlow: false,
      bookkeepingAccounts: [],
    },
  };

export const LoadingSelector: StoryObj<BookkeepingAccountRawSelectorInnerComponent> =
  {
    render: (args) => {
      const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
        args.value ?? null,
      );
      return (
        <BookkeepingAccountRawSelectorInner
          {...args}
          value={selectedAccountId}
          onChange={(id) => setSelectedAccountId(id)}
          onClear={() => setSelectedAccountId(null)}
        />
      );
    },
    args: {
      isLoading: true,
      withCreationFlow: false,
      bookkeepingAccounts: [
        {
          account_name: "name",
          account_number: "1234",
          company: 2,
          id: 1,
          vat_rate: "10.234",
        },
      ],
    },
  };

// Documentation - Inherit configuration from the meta object
// Goal: Add story description to dive into implementation details.
export const Documentation: StoryObj<BookkeepingAccountFormSelectorComponent> =
  {
    parameters: {
      docs: {
        description: {
          story: `
### Requirements

- @bsport/form
- @bsport/kaizen-primitive-core
- @tanstack/react-query

---

### Components

You can use 3 different versions of the component

#### **BookkeepingAccountFormSelector**

The Raw Selector wrapped in a Form Field, handling internally the fetch of the accounts.

| Prop | Description |
|------|------------|
| \`idFieldName\` | Name of the field in the form that points to the bookkeeping account id |
| \`taxFieldName\` | Name of the field in the form that points to the bookkeeping account tax |
| \`taxFieldClearedValue\` | Default value to apply when clearing the bookkeeping selector |
| \`fetch\` | Fetch instance of your application |

#### **BookkeepingAccountRawSelector**

The Raw Selector, handling internally the fetch of the accounts, with loading and empty state.

You need to provide the control logic.

| Prop | Description |
|------|------------|
| \`value\` | Currently selected account ID |
| \`fetch\` | Fetch instance of your application |
| \`onChange\` | Callback when an account is selected that provides new id |
| \`onChangeTax\` | Callback when an account is selected that provides new tax |
| \`onClear\` | Callback to clear the selection |

#### **BookkeepingAccountRawSelectorInner** (Story Only)

The Selector as pure UI. It does not handle the fetch of the accounts.

| Prop | Description |
|------|------------|
| \`value\` | Currently selected account ID |
| \`onChange\` | Callback when an account is selected that provides new id |
| \`onChangeTax\` | Callback when an account is selected that provides new tax |
| \`onClear\` | Callback to clear the selection |
| \`bookkeepingAccounts\` | List of BookkeepingAccount |
| \`isLoading\` | Whether data are being fetched |

---

### BookkeepingAccountFormSelector Specifications

#### **Form validation**

The form schema defines the available fields and their types:

\`\`\`ts
const schema = z.object({
  bookkeeping_account: z.number().nullable(),
});
\`\`\`

---

#### **Generic typing**

\`BookkeepingAccountFormSelector\` is strongly typed using two generics:

\`\`\`ts
<BookkeepingAccountFormSelector<
  { bookkeeping_account: number | null },
  "bookkeeping_account"
>
\`\`\`

- **First generic**: the full form value shape
- **Second generic**: the field name (enforced at type level)

---
        `,
        },
      },
    },
  };
