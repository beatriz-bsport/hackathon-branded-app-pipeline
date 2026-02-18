import type { Meta, StoryObj } from "@storybook/react-vite";
import { z } from "zod";

import type { Tag, TagGroup } from "@bsport/api-core";
import { ControlledForm, useFormController } from "@bsport/form";

import tagGroups from "#src/fixtures/tag-groups.json";
import tags from "#src/fixtures/tags.json";

import { DEFAULT_PROPS, TagSelector } from "./tag-selector.component";

type TagSelectorComponent = typeof TagSelector;

const metaComponentDescription = `
**TagSelector** is a business component that wraps a \`FormField\` around a \`Autocomplete\`, specifically designed for selecting tags.

### Business Context

It applies the following custom logic: only a single tag per group can be selected.
This component is intended for use in workflows where **tags** must be selected:
- Configuring tag after purchase (=> cf buyables/tags-after-purchase-selector)
- Configuring blacklist or whitelist

### How to import?

\`\`\`tsx
import { TagSelector } from "@bsport/kaizen-business-components/cdp/tag-selector";
\`\`\`
`;

const metaSourceCode = `
import { TagSelector } from "@bsport/kaizen-business-components/cdp/tag-selector";

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
        <TagSelector<{ tags: number[] }, "tags">
          {...args}
          id="tag-selector-example"
          fieldName="tags"
        />
      </ControlledForm>
    );
  },
  tags: ["autodocs"],
  args: {
    ...DEFAULT_PROPS,
    tags: tags as Tag[],
    tagGroups: tagGroups as TagGroup[],
    placeholder: "Add tags...",
    multiSelect: true,
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

### Additional props

They will be forwarded to the inner Autocomplete
        `,
      },
    },
  },
};
