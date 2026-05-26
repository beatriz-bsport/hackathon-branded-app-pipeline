import type { Meta, StoryObj } from "@storybook/react-vite";
import { z } from "zod";

import { ControlledForm, useFormController } from "@bsport/form";

import { fetch } from "#src/utils/fetch";
import { tanstackQueryDevToolsDecorator } from "#src/utils/stories";

import { DEFAULT_PROPS, TagSelector } from "./tag-selector.component";

type TagSelectorComponent = typeof TagSelector;

const metaComponentDescription = `
**TagSelector** is a business component that wraps a \`FormField\` around a \`Autocomplete\`, specifically designed for selecting tags.

### Business Context

This component is intended for use in workflows where **tags** must be selected:
- Configuring tag after purchase (=> cf buyables/tags-after-purchase-selector)
- Configuring Allow list or Block list

It handles internally the fetch to tags and tags groups.

### How to import?

\`\`\`tsx
import { TagSelector } from "@bsport/kaizen-business-components/cdp/tag-selector";
\`\`\`
`;

const metaSourceCode = `
import { TagSelector } from "@bsport/kaizen-business-components/cdp/tag-selector";
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
  <TagSelector<
    { tags: number[] /* ...otherFields, etc */ },
    "tags"
  >
    id="tag-selector-example"
    fieldName="tags"
    placeholder={t("...")}
    fetch={fetch}
    ...
  />
</ControlledForm>
`;

const meta: Meta<TagSelectorComponent> = {
  component: TagSelector,
  title: "CDP/TagSelector",
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
        tags: [4],
      },
    });

    return (
      <ControlledForm {...methods} onSubmit={(data) => console.log(data)}>
        <TagSelector<{ tags: number[] }, "tags">
          {...args}
          id="tag-selector-example"
          fieldName="tags"
          fetch={fetch}
        />
      </ControlledForm>
    );
  },
  tags: ["autodocs"],
  args: {
    ...DEFAULT_PROPS,
    placeholder: "Add tags...",
    multiSelect: true,
    hasOneTagPerCategoryLimit: false,
  },
};

export default meta;

// Default - Inherit configuration from the meta object.
// Goal: Manipulate the story.
export const Default: StoryObj<TagSelectorComponent> = {};

// Documentation - Inherit configuration from the meta object.
// Goal: Add story description to dive into implementation details.
export const Documentation: StoryObj<TagSelectorComponent> = {
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

\`TagSelector\` is strongly typed using two generics:

\`\`\`ts
<TagSelector<
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
