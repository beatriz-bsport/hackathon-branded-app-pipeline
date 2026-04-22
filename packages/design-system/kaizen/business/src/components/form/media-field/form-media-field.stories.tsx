import type { Meta, StoryObj } from "@storybook/react-vite";
import { z } from "zod";

import { ControlledForm, useFormController } from "@bsport/form";

import { FormMediaField } from "./form-media-field.component";

type FormMediaFieldComponent = typeof FormMediaField;

const metaComponentDescription = `
**FormMediaField** binds a \`File | string | null\` form field to a \`FileUpload\` component using \`@bsport/form\`.

It is designed to:
- Work inside a \`ControlledForm\`
- Enforce media-only field names (\`File | string | null | undefined\`) at compile time
- Own the preview lifecycle (object URL creation + revocation)
- Forward \`handleUploadFile\` and \`inline\` mode to the underlying \`FileUpload\`

### When to use

- Use **FormMediaField** when a file/image field must be part of form state
- Prefer raw \`FileUpload\` for uncontrolled or local UI state

### Required peer dependencies

- \`@bsport/form\` must be installed and available
`;

const metaSourceCode = `
const schema = z.object({
  cover: z.union([z.instanceof(File), z.string(), z.null()]),
});

const methods = useFormController({
  schema,
  defaultValues: { cover: null },
});

<ControlledForm {...methods}>
  <FormMediaField<{ cover: File | string | null }, "cover">
    id="form-media-field-example"
    fieldName="cover"
    fileExtensionList={["image/*"]}
    helperText="Upload a cover image (JPG, PNG, WebP)"
  />
</ControlledForm>
`;

const meta: Meta<FormMediaFieldComponent> = {
  component: FormMediaField,
  title: "Form/FormMediaField",
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
      cover: z.union([z.instanceof(File), z.string(), z.null()]),
    });

    const methods = useFormController({
      schema,
      defaultValues: { cover: null },
    });

    return (
      <ControlledForm {...methods} onSubmit={(data) => console.log(data)}>
        <FormMediaField<{ cover: File | string | null }, "cover">
          id="form-media-field-example"
          fieldName="cover"
          fileExtensionList={["image/*"]}
          helperText="Upload a cover image (JPG, PNG, WebP)"
        />
      </ControlledForm>
    );
  },
  tags: ["autodocs"],
};

export default meta;

export const Default: StoryObj<FormMediaFieldComponent> = {};

export const Disabled: StoryObj<FormMediaFieldComponent> = {
  render: () => {
    const schema = z.object({
      cover: z.union([z.instanceof(File), z.string(), z.null()]),
    });

    const methods = useFormController({
      schema,
      defaultValues: { cover: null },
    });

    return (
      <ControlledForm {...methods} onSubmit={(data) => console.log(data)}>
        <FormMediaField<{ cover: File | string | null }, "cover">
          id="form-media-field-disabled"
          fieldName="cover"
          fileExtensionList={["image/*"]}
          helperText="Upload a cover image (JPG, PNG, WebP)"
          disabled
        />
      </ControlledForm>
    );
  },
};

export const Documentation: StoryObj<FormMediaFieldComponent> = {
  parameters: {
    docs: {
      description: {
        story: `
### Form schema

\`\`\`ts
const schema = z.object({
  cover: z.custom<File | string | null>().nullable(),
});
\`\`\`

---

### Generic typing

\`FormMediaField\` is strongly typed using two generics:

\`\`\`ts
<FormMediaField<
  { cover: File | string | null },
  "cover"
>
\`\`\`

- **First generic**: the full form value shape
- **Second generic**: a media-only field name (\`File | string | null | undefined\` — enforced at type level)

---

### Required props

| Prop | Description |
|------|------------|
| \`id\` | HTML id forwarded to FileUpload |
| \`fieldName\` | Name of the media field in the form |

### Optional props

| Prop | Default | Description |
|------|---------|------------|
| \`alt\` | field name | Alt text for the preview image |
| \`helperText\` | — | Text shown below upload zone when no file is selected |
| \`fileExtensionList\` | \`["image/*"]\` | Accepted file types |
| \`autoUpload\` | \`true\` | Auto-start upload on file select |
| \`disabled\` | \`false\` | Disable the upload input |

### Owned internally (not overrideable)

- \`handleUploadFile\` — sets the field value and returns success status
- \`inline\` — toggled based on whether a value is present
- Preview lifecycle — creates and revokes object URLs automatically
        `,
      },
    },
  },
};
