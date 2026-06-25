import type { Meta, StoryObj } from "@storybook/react-vite";
import { useId, useState } from "react";
import { z } from "zod";

import { ControlledForm, useFormController } from "@bsport/form";

import { fetch } from "#src/utils/fetch";
import { tanstackQueryDevToolsDecorator } from "#src/utils/stories";

import { CategoryFormSelector } from "./category-form-selector";
import { CategoryRawSelector, DEFAULT_PROPS } from "./category-raw-selector";

const metaComponentDescription = `
**CategorySelector** is a business component wrapping \`AutocompleteControlled\` to select categories (SCTs) in multi or single select mode.
- **CategoryFormSelector**: Wrapped in a FormField
- **CategoryRawSelector**: Raw component

### Business Context

This component is intended for use in workflows where **categories** must be selected, such as:
- Configuring product categories to restricted categories
- Filtering or grouping items by category

### How to import?

\`\`\`tsx
import { CategoryFormSelector } from "@bsport/kaizen-business-components/core/category-selector";
\`\`\`
`;

const metaSourceCode = `
import { CategoryFormSelector } from "@bsport/kaizen-business-components/core/category-selector";
import { fetch } from "#src/utils/fetch";

// ...

const schema = z.object({
  categories: z.array(z.coerce.number())
});

const methods = useFormController({
  schema,
  defaultValues: {
    categories: [],
  },
});

<ControlledForm {...methods}>
  <CategoryFormSelector<
    { categories: number[] /* ...otherFields, etc */ },
    "categories"
  >
    id="category-selector-example"
    fieldName="categories"
    fetch={fetch}
    companyId={2}
    ...
  />
</ControlledForm>
`;

type CategorySelectorComponent = typeof CategoryFormSelector;

const meta: Meta<CategorySelectorComponent> = {
  component: CategoryFormSelector,
  title: "Core/CategorySelector",
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
  tags: ["autodocs"],
  decorators: tanstackQueryDevToolsDecorator,
  render: (args) => {
    const schema = z.object({
      categories: z.array(z.coerce.number()),
    });

    const methods = useFormController({
      schema,
      defaultValues: {
        categories: [],
      },
    });

    const formId = useId();

    return (
      <ControlledForm
        id={formId}
        {...methods}
        onSubmit={(data) => console.log(data)}
      >
        <CategoryFormSelector<{ categories: number[] }, "categories">
          {...args}
          fieldName="categories"
          fetch={fetch}
          companyId={2}
        />

        <button form={formId} className="mt-md">
          Log results
        </button>
      </ControlledForm>
    );
  },
  args: {
    ...DEFAULT_PROPS,
    required: true,
    disabled: false,
    withChips: true,
    className: "max-w-[420px]",
  },
};

export default meta;

// Default - No default data
export const Default: StoryObj<typeof CategoryFormSelector> = {};

// With predefined values
export const WithPredefinedValues: StoryObj<typeof CategoryFormSelector> = {
  render: (args) => {
    const schema = z.object({
      categories: z.array(z.coerce.number()),
    });

    const methods = useFormController({
      schema,
      defaultValues: {
        categories: [1, 2, 3],
      },
    });

    const formId = useId();

    return (
      <ControlledForm
        id={formId}
        {...methods}
        onSubmit={(data) => console.log(data)}
      >
        <CategoryFormSelector<{ categories: number[] }, "categories">
          {...args}
          fieldName="categories"
          fetch={fetch}
          companyId={2}
        />

        <button form={formId} className="mt-md">
          Log results
        </button>
      </ControlledForm>
    );
  },
};

// Raw Selector - Show raw usage of CategoryRawSelector
const rawSelectorSourceCode = `
import { useState } from "react";

import { fetch } from "#src/utils/fetch";

const [selectedIds, setSelectedIds] = useState<number[]>([]);

<CategoryRawSelector
  fetch={fetch}
  companyId={2}
  value={selectedIds}
  onChange={setSelectedIds}
/>
`;

export const RawSelector: StoryObj<typeof CategoryRawSelector> = {
  parameters: {
    docs: {
      source: {
        code: rawSelectorSourceCode,
      },
    },
  },
  render: (args) => {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    return (
      <CategoryRawSelector
        {...args}
        fetch={fetch}
        onChange={(values) => setSelectedIds(values)}
        value={selectedIds}
        companyId={2}
      />
    );
  },
};

// Documentation - Inherit configuration from the meta object.
// Goal: Add story description to dive into implementation details.
export const Documentation: StoryObj<CategorySelectorComponent> = {
  parameters: {
    docs: {
      description: {
        story: `
### Form schema

The form schema defines the available fields and their types:

\`\`\`ts
const schema = z.object({
  categories: z.array(z.coerce.number()), // Apply other constraints
});
\`\`\`

---

### Generic typing

\`CategoryFormSelector\` is strongly typed using two generics:

\`\`\`ts
<CategoryFormSelector<
  { categories: number[] },
  "categories"
>
\`\`\`

- **First generic**: the full form value shape
- **Second generic**: a number-list-only field name (enforced at type level)

---

### Required props

| Prop | Description |
|------|------------|
| \`fieldName\` | Name of the number-list field in the form |
| \`fetch\` | Fetch instance used internally to load categories |
| \`companyId\` | ID of the company, in order to retrieve categories in the company language |

### Additional props

They will be forwarded to the inner CategoryRawSelector
        `,
      },
    },
  },
};
