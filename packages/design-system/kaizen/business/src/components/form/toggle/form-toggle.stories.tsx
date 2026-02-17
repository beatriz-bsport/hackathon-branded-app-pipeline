import type { Meta, StoryObj } from "@storybook/react-vite";
import { z } from "zod";

import { ControlledForm, useFormController } from "@bsport/form";

import { FormToggle } from "./form-toggle.component";

type FormToggleComponent = typeof FormToggle;

const metaComponentDescription = `
**FormToggle** binds a boolean form field to a \`Toggle\` component using \`@bsport/form\`.

It is designed to:
- Work inside a \`ControlledForm\`
- Enforce boolean-only field names at compile time
- Forward form state (\`checked\`) to the underlying Toggle

### When to use

- Use **FormToggle** when the toggle value must be part of form state
- Prefer raw \`Toggle\` for uncontrolled or local UI state
`;

const metaSourceCode = `
const schema = z.object({
  hasFieldEnabled: z.boolean(),
});
      
const methods = useFormController({
  schema,
  defaultValues: {
    hasFieldEnabled: false,
  },
});

<ControlledForm {...methods}>
  <FormToggle<
    { hasFieldEnabled: boolean },
    "hasFieldEnabled"
  >
    id="form-toggle-example"
    fieldName="hasFieldEnabled"
    label="Enable field"
  />
</ControlledForm>
`;

const meta: Meta<FormToggleComponent> = {
  component: FormToggle,
  title: "Form/FormToggle",
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
      hasFieldEnabled: z.boolean(),
    });

    const methods = useFormController({
      schema,
      defaultValues: {
        hasFieldEnabled: false,
      },
    });

    return (
      <ControlledForm {...methods} onSubmit={(data) => console.log(data)}>
        <FormToggle<{ hasFieldEnabled: boolean }, "hasFieldEnabled">
          id="form-toggle-example"
          fieldName="hasFieldEnabled"
          label="Enable field"
        />
      </ControlledForm>
    );
  },
  tags: ["autodocs"],
};

export default meta;

// Default - Inherit configuration from the meta object.
// Goal: Manipulate the story.
export const Default: StoryObj<FormToggleComponent> = {};

// Documentation - Inherit configuration from the meta object.
// Goal: Add story description to dive into implementation details.
export const Documentation: StoryObj<FormToggleComponent> = {
  parameters: {
    docs: {
      description: {
        story: `
### Form schema

The form schema defines the available fields and their types:

\`\`\`ts
const schema = z.object({
  hasFieldEnabled: z.boolean(),
});
\`\`\`

---

### Generic typing

\`FormToggle\` is strongly typed using two generics:

\`\`\`ts
<FormToggle<
  { hasFieldEnabled: boolean },
  "hasFieldEnabled"
>
\`\`\`

- **First generic**: the full form value shape
- **Second generic**: a boolean-only field name (enforced at type level)

This prevents accidentally binding a toggle to a non-boolean field.

---

### Required props

| Prop | Description |
|------|------------|
| \`id\` | HTML id forwarded to the Toggle |
| \`fieldName\` | Name of the boolean field in the form |
| \`label\` | Toggle label |
        `,
      },
    },
  },
};
