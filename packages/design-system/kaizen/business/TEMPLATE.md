# Template - Business Component structure

## `my-business-stuff.component.tsx`

```tsx
import { i18nInstance, useTranslation } from "#src/i18n";

type MyBusinessStuffProps = { ... };

export const MyBusinessStuff: FC<MyBusinessStuffProps> = ({...}) => {
    const { t } = useTranslation("business-domain", { i18n: i18nInstance });

    return (
        ...
    )
}

MyBusinessStuff.displayName = "KaizenMyBusinessStuff";
```

---

## `index.ts`

```tsx
export { MyBusinessStuff } from "./my-business-stuff.component";
```

---

## `my-business-stuff.stories.tsx`

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useId } from "react";
import { z } from "zod";

import { ControlledForm, useFormController } from "@bsport/form";

import { MyBusinessStuff } from "./my-business-stuff.component";

const metaComponentDescription = `
**MyBusinessStuff** wraps a FormField around a \`Dropdown\` to do ...

### Business Context

The component manages ...

### How to import ?

\`\`\`tsx
import { MyBusinessStuff } from "@bsport/kaizen-business-components/business-domain/my-business-stuff";
\`\`\`
`;

const metaSourceCode = `
const schema = z.object({
  ...
});

const methods = useFormController({
  schema,
  defaultValues: {
    ...
  },
});

<ControlledForm {...methods}>
  <MyBusinessStuff<
    { ... },
    "myField"
  >
    fieldName="myField"
    ...
  />
</ControlledForm>
`;

type MyBusinessStuffComponent = typeof MyBusinessStuff;

const meta: Meta<MyBusinessStuffComponent> = {
  component: MyBusinessStuff,
  title: "BusinessDomain/MyBusinessStuff",
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
    anyProps: {
      table: {
        type: ...,
        defaultValue: ...,
      },
      options: ...,
      control: ...,
    },
    ...
  },
  render: ({ ... }) => {
    const schema = z.object({
        ...
    });

    const methods = useFormController({
      schema,
      defaultValues: {
        ...
      },
    });

    const id = useId();

    return (
      <ControlledForm
        id={id}
        {...methods}
        onSubmit={(data) => console.log(data)}
      >
        <MyBusinessStuff<{ ... }, "...">
          fieldName="..."
          {...args}
        />
        <button form={id} className="mt-md">
          Log results
        </button>
      </ControlledForm>
    );
  },
  args: {
    ...,
  },
  tags: ["autodocs"],
};

export default meta;

// Default - Inherit configuration from the meta object
// Goal: Manipulate and see the story.
export const Default: StoryObj<MyBusinessStuffComponent> = {};

// Documentation - Inherit configuration from the meta object
// Goal: Add story description to dive into implementation details.
export const Documentation: StoryObj<MyBusinessStuffComponent> = {
  parameters: {
    docs: {
      description: {
        story: `
### Requirements

- @bsport/form
- @bsport/kaizen-primitive-core

---

### Form validation

The form schema defines the available fields and their types:

\`\`\`ts
const schema = z.object({
   ...
});
\`\`\`

---

### Generic typing

\`MyBusinessStuff\` is strongly typed using two generics:

\`\`\`ts
<MyBusinessStuff<
  ...,
  "..."
>
\`\`\`

- **First generic**: the full form value shape
- **Second generic**: a SPECIFIC-TYPE-only field name (enforced at type level)

This prevents accidentally binding the MyBusinessStuff to a non-SPECIFIC-TYPE field.

---

### Required props

| Prop | Description |
|------|------------|
| \`fieldName\` | Name of the domain-specific field in the form |

---

### Other stuff
...
        `,
      },
    },
  },
};
```
