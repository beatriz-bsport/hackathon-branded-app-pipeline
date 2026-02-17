import type { Meta, StoryObj } from "@storybook/react-vite";
import { useId } from "react";
import { z } from "zod";

import { ControlledForm, useFormController } from "@bsport/form";

import { VisibilitySelector } from "./visibility-selector.component";

const metaComponentDescription = `
**VisibilitySelector** wraps a FormField around a \`Dropdown\`, specifically designed for selecting the visible state of a buyable in a controlled form environment.

### Business Context

The component manages the visibility value (boolean) and displays the current value inside the Dropdown Anchor. It allows to fit the two following cases:
- your form field has a "positive" meaning, for instance "visible" or "listed": provides \`asHiddenSelector=false\`
- your form field has a "negative" meaning, for instance "hidden" or "manager_only": provides \`asHiddenSelector=true\`

This component is intended for use in workflows where **visibility selection** is required, such as:
- listing buyables on the Member Area

### How to import ?

\`\`\`tsx
import { VisibilitySelector } from "@bsport/kaizen-business-components/buyables/visibility-selector";
\`\`\`
`;

const metaSourceCode = `
const schema = z.object({
  manager_only: z.boolean(),
});
      
const methods = useFormController({
  schema,
  defaultValues: {
    manager_only: false,
  },
});

<ControlledForm {...methods}>
  <VisibilitySelector<
    { manager_only: boolean },
    "manager_only"
  >
    fieldName="manager_only"
    asHiddenSelector // -> because "manager_only" means "hidden" when true
    buyableName={t("...")}
    ...
  />
</ControlledForm>
`;

type VisibilitySelectorComponent = typeof VisibilitySelector;

const meta: Meta<VisibilitySelectorComponent> = {
  component: VisibilitySelector,
  title: "Buyables/VisibilitySelector",
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
      defaultValue: { summary: "min-w-component-popover-min max-w-full" },
      table: { type: { summary: "string" } },
      control: { type: "text" },
    },
    buyableName: {
      table: { type: { summary: "string" } },
      control: { type: "text" },
    },
  },
  render: ({ asHiddenSelector, fieldName: _, ...args }) => {
    const schema = z.object({
      manager_only: z.boolean(),
    });

    const methods = useFormController({
      schema,
      defaultValues: {
        manager_only: false,
      },
    });

    const id = useId();

    return (
      <ControlledForm
        id={id}
        {...methods}
        onSubmit={(data) => console.log(data)}
      >
        <VisibilitySelector<{ manager_only: boolean }, "manager_only">
          fieldName="manager_only"
          asHiddenSelector={asHiddenSelector == null ? true : asHiddenSelector}
          {...args}
        />
        <button form={id} className="mt-md">
          Log results
        </button>
      </ControlledForm>
    );
  },
  args: {
    asHiddenSelector: false,
    popoverPlacement: "bottom-right",
    popoverClassName: "w-component-popover-min", // default value
    anchorClassName: "min-w-component-popover-min max-w-full", // default value
    buyableName: "Pack",
  },
  tags: ["autodocs"],
};

export default meta;

// Default - Inherit configuration from the meta object
// Goal: Manipulate and see the story.
export const Default: StoryObj<VisibilitySelectorComponent> = {};

// Documentation - Inherit configuration from the meta object
// Goal: Add story description to dive into implementation details.
export const Documentation: StoryObj<VisibilitySelectorComponent> = {
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
  manager_only: z.boolean(),
});
\`\`\`

---

### Generic typing

\`VisibilitySelector\` is strongly typed using two generics:

\`\`\`ts
<VisibilitySelector<
  { manager_only: boolean },
  "manager_only"
>
\`\`\`

- **First generic**: the full form value shape
- **Second generic**: a boolean-only field name (enforced at type level)

This prevents accidentally binding the VisibilitySelector to a non-boolean field.

---

### Required props

| Prop | Description |
|------|------------|
| \`fieldName\` | Name of the boolean field in the form |
| \`asHiddenSelector\` | Whether the prop you are manipulating has a negative meaning (e.g. manager_only, when true, stands for hidden) |

---

### Hook useVisibilityBadgeConfig

\`useVisibilityBadgeConfig\` is a hook that return the props for a Visibility Badge (Visible vs Hidden).
It forwards the right translations.

\`\`\`tsx
import { useVisibilityBadgeConfig } from "@bsport/kaizen-business-components/buyables/visibility-selector";
\`\`\`
        `,
      },
    },
  },
};
