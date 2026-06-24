import type { Meta, StoryObj } from "@storybook/react-vite";
import { useId, useState } from "react";
import { z } from "zod";

import { ControlledForm, useFormController } from "@bsport/form";

import { fetch } from "#src/utils/fetch";
import { tanstackQueryDevToolsDecorator } from "#src/utils/stories";

import { EstablishmentFormSelector } from "./establishment-form-selector";
import {
  DEFAULT_PROPS,
  EstablishmentRawSelector,
} from "./establishment-raw-selector";

const metaComponentDescription = `
**EstablishmentSelector** is a business component wrapping \`AutocompleteControlled\` to select establishments (venues) in multi-select mode.
- **EstablishmentFormSelector**: Wrapped in a FormField
- **EstablishmentRawSelector**: Raw component

It handles internally:
- the infinite paginated fetch of establishments,
- the switch to the search endpoint as soon as the user types,
- the resolution of preselected ids so their labels remain visible,
- the grouping of establishments by their location address.

### Business Context

This component is intended for use in workflows where **establishments** must be selected (multiple selector), such as:
- Configuring product availability per venue
- Filtering or grouping items by venue

Establishments are grouped by their location address to ease selection
when the company manages multiple venues at the same address.

### How to import?

\`\`\`tsx
import { EstablishmentFormSelector } from "@bsport/kaizen-business-components/core/establishment-selector";
\`\`\`
`;

const metaSourceCode = `
import { EstablishmentFormSelector } from "@bsport/kaizen-business-components/core/establishment-selector";
import { fetch } from "#src/utils/fetch";

// ...

const schema = z.object({
  establishments: z.array(z.coerce.number())
});

const methods = useFormController({
  schema,
  defaultValues: {
    establishments: [],
  },
});

<ControlledForm {...methods}>
  <EstablishmentFormSelector<
    { establishments: number[] /* ...otherFields, etc */ },
    "establishments"
  >
    id="establishment-selector-example"
    fieldName="establishments"
    fetch={fetch}
    companyId={2}
    ...
  />
</ControlledForm>
`;

type EstablishmentSelectorComponent = typeof EstablishmentFormSelector;

const meta: Meta<EstablishmentSelectorComponent> = {
  component: EstablishmentFormSelector,
  title: "Core/EstablishmentSelector",
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
      establishments: z.array(z.coerce.number()),
    });

    const methods = useFormController({
      schema,
      defaultValues: {
        establishments: [],
      },
    });

    const formId = useId();

    return (
      <ControlledForm
        id={formId}
        {...methods}
        onSubmit={(data) => console.log(data)}
      >
        <EstablishmentFormSelector<
          { establishments: number[] },
          "establishments"
        >
          {...args}
          id={`establishment-selector-example-${formId}`}
          fieldName="establishments"
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
export const Default: StoryObj<typeof EstablishmentFormSelector> = {};

// With predefined values
export const WithPredefinedValues: StoryObj<typeof EstablishmentFormSelector> =
  {
    render: (args) => {
      const schema = z.object({
        establishments: z.array(z.coerce.number()),
      });

      const methods = useFormController({
        schema,
        defaultValues: {
          establishments: [1, 305, 3],
        },
      });

      const formId = useId();

      return (
        <ControlledForm
          id={formId}
          {...methods}
          onSubmit={(data) => console.log(data)}
        >
          <EstablishmentFormSelector<
            { establishments: number[] },
            "establishments"
          >
            {...args}
            id={`establishment-selector-example-${formId}`}
            fieldName="establishments"
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

// Raw Selector - Show raw usage of EstablishmentRawSelector
const rawSelectorSourceCode = `
import { useState } from "react";

import { fetch } from "#src/utils/fetch";

const [selectedIds, setSelectedIds] = useState<number[]>([]);

<EstablishmentRawSelector
  id="establishment-selector-example"
  fetch={fetch}
  companyId={2}
  value={selectedIds}
  onChange={setSelectedIds}
/>
`;

export const RawSelector: StoryObj<typeof EstablishmentRawSelector> = {
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
      <EstablishmentRawSelector
        {...args}
        id={`establishment-selector-example-${useId()}`}
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
export const Documentation: StoryObj<EstablishmentSelectorComponent> = {
  parameters: {
    docs: {
      description: {
        story: `
### Form schema

The form schema defines the available fields and their types:

\`\`\`ts
const schema = z.object({
  establishments: z.array(z.coerce.number()), // Apply other constraints
});
\`\`\`

---

### Generic typing

\`EstablishmentFormSelector\` is strongly typed using two generics:

\`\`\`ts
<EstablishmentFormSelector<
  { establishments: number[] },
  "establishments"
>
\`\`\`

- **First generic**: the full form value shape
- **Second generic**: a number-list-only field name (enforced at type level)

---

### Required props

| Prop | Description |
|------|------------|
| \`id\` | HTML id forwarded to the Autocomplete |
| \`fieldName\` | Name of the number-list field in the form |
| \`fetch\` | Fetch instance used internally to load establishments |
| \`companyId\` | ID of the company, used to fetch the establishments of the company |

### Additional props

They will be forwarded to the inner EstablishmentRawSelector

### Requirements

- @bsport/fetch
- @bsport/kaizen-primitive-core
- @bsport/form
- @tanstack/react-query
        `,
      },
    },
  },
};
