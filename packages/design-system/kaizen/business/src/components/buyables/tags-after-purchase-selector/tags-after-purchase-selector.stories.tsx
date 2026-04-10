import type { Meta, StoryObj } from "@storybook/react-vite";
import { z } from "zod";

import { ControlledForm, useFormController } from "@bsport/form";

import { fetch } from "#src/utils/fetch";
import { tanstackQueryDevToolsDecorator } from "#src/utils/stories";

import { TagsAfterPurchaseSelector } from "./tags-after-purchase-selector.component";

type TagsAfterPurchaseSelectorComponent = typeof TagsAfterPurchaseSelector;

const metaComponentDescription = `
**TagsAfterPurchaseSelector** is a business component that is built on \`TagSelector\` (CDP). 

### Business Context

It joins the TagSelector with a title and description to provide a full section to select tags after purchase
in a form context.

### How to import?

\`\`\`tsx
import { TagsAfterPurchaseSelector } from "@bsport/kaizen-business-components/buyables/tags-after-purchase-selector";
\`\`\`
`;

const metaSourceCode = `
import { TagsAfterPurchaseSelector } from "@bsport/kaizen-business-components/buyables/tags-after-purchase-selector";
import { fetch } from "#src/utils/fetch";

// ...

const schema = z.object({
  tags: z.array(z.coerce.number())
});
      
const methods = useFormController({
  schema,
  defaultValues: {
    tags: [],
  },
});

<ControlledForm {...methods}>
  <TagsAfterPurchaseSelector<
    { tags: number[] /* ...otherFields, etc */ },
    "tags"
  >
    id="tags-after-purchase-selector-example"
    fieldName="tags"
    fetch={fetch}
  />
</ControlledForm>
`;

const meta: Meta<TagsAfterPurchaseSelectorComponent> = {
  component: TagsAfterPurchaseSelector,
  title: "Buyables/TagsAfterPurchaseSelector",
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
  decorators: tanstackQueryDevToolsDecorator,
  render: (args) => {
    const schema = z.object({
      tags: z.array(z.coerce.number()),
    });

    const methods = useFormController({
      schema,
      defaultValues: {
        tags: [1],
      },
    });

    return (
      <ControlledForm {...methods} onSubmit={(data) => console.log(data)}>
        <TagsAfterPurchaseSelector<{ tags: number[] }, "tags">
          {...args}
          id="tags-after-purchase-selector-example"
          fieldName="tags"
          fetch={fetch}
        />
      </ControlledForm>
    );
  },
  tags: ["autodocs"],
};

export default meta;

// Default - Inherit configuration from the meta object.
// Goal: Manipulate the story.
export const Default: StoryObj<TagsAfterPurchaseSelectorComponent> = {};

// Documentation - Inherit configuration from the meta object.
// Goal: Add story description to dive into implementation details.
export const Documentation: StoryObj<TagsAfterPurchaseSelectorComponent> = {
  parameters: {
    docs: {
      description: {
        story: `
### Form schema

The form schema defines the available fields and their types:

\`\`\`ts
const schema = z.object({
  tags: z.array(z.coerce.number()), // Apply other constraints
});
\`\`\`

---

### Generic typing

\`TagsAfterPurchaseSelector\` is strongly typed using two generics:

\`\`\`ts
<TagsAfterPurchaseSelector<
  { tags: number[] },
  "tags"
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
| \`fetch\` | Fetch instance used internally to load tags and tag groups |

### Additional props

They will be forwarded to the inner Autocomplete
        `,
      },
    },
  },
};
