import type { Meta, StoryObj } from "@storybook/react-vite";
import { useId } from "react";
import { z } from "zod";

import { ControlledForm, useFormController } from "@bsport/form";

import { VisibilityRules } from "./visibility-rules";

const metaComponentDescription = `
**VisibilityRules** provides a set of checkboxes for managing visibility rules in a controlled form environment.

### Business Context

This component is used to toggle visibility rules for buyables, such as:
- Recommended status
- New members only
- Hide from staff

It is useful in workflows like:
- Buyable creation/editing
- Visibility management

### How to import?

\`\`\`tsx
import { VisibilityRules } from "@bsport/kaizen-business-components/buyables/visibility-rules";
\`\`\`
`;

const metaSourceCode = `
const schema = z.object({
  recommended: z.boolean(),
  new_members_only: z.boolean(),
  is_visible_by_staff: z.boolean(),
});

const methods = useFormController({
  schema,
  defaultValues: {
    recommended: false,
    new_members_only: false,
    is_visible_by_staff: true,
  },
});

// Usage within a form:
<ControlledForm {...methods}>
  <VisibilityRules<
    { recommended: boolean; new_members_only: boolean; is_visible_by_staff: boolean },
    "recommended" | "new_members_only" | "is_visible_by_staff",
  >
    formId={formId}
    recommendedField={{ name: "recommended" }}
    newMembersField={{ name: "new_members_only" }}
    hideFromStaffField={{ name: "is_visible_by_staff", reversed: true }}
  />
</ControlledForm>
`;

type VisibilityRulesComponent = typeof VisibilityRules;

const meta: Meta<VisibilityRulesComponent> = {
  component: VisibilityRules,
  title: "Buyables/VisibilityRules",
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
    disabled: {
      table: {
        type: { summary: "boolean" },
      },
      control: { type: "boolean" },
    },
  },
  render: (args) => {
    const schema = z.object({
      recommended: z.boolean(),
      new_members_only: z.boolean(),
      is_visible_by_staff: z.boolean(),
    });

    const methods = useFormController({
      schema,
      defaultValues: {
        recommended: false,
        new_members_only: false,
        is_visible_by_staff: true,
      },
    });

    const id = useId();

    return (
      <ControlledForm
        id={id}
        {...methods}
        onSubmit={(data) => console.log(data)}
      >
        <VisibilityRules<
          {
            recommended: boolean;
            new_members_only: boolean;
            is_visible_by_staff: boolean;
          },
          "recommended" | "new_members_only" | "is_visible_by_staff"
        >
          {...args}
          formId={id}
          recommendedField={{ name: "recommended" }}
          newMembersField={{ name: "new_members_only" }}
          hideFromStaffField={{ name: "is_visible_by_staff", reversed: true }}
        />
        <button form={id} className="mt-md">
          Log results
        </button>
      </ControlledForm>
    );
  },
  args: {
    disabled: false,
  },
  tags: ["autodocs"],
};

export default meta;

// Default - All fields
export const Default: StoryObj<VisibilityRulesComponent> = {};

// Subset - Only recommended and new members
const recommendedAndNewMembersSourceCode = `
const schema = z.object({
  recommended: z.boolean(),
  new_members_only: z.boolean(),
});

const methods = useFormController({
  schema,
  defaultValues: {
    recommended: false,
    new_members_only: false,
  },
});

// Usage within a form:
<ControlledForm {...methods}>
  <VisibilityRules<
    { recommended: boolean; new_members_only: boolean },
    "recommended" | "new_members_only",
  >
    formId={formId}
    recommendedField={{ name: "recommended" }}
    newMembersField={{ name: "new_members_only" }}
    // Set name to null to remove hideFromStaffField
    hideFromStaffField={{ name: null }}
  />
</ControlledForm>
`;
export const RecommendedAndNewMembers: StoryObj<VisibilityRulesComponent> = {
  parameters: {
    docs: { source: { code: recommendedAndNewMembersSourceCode } },
  },
  render: (args) => {
    const schema = z.object({
      recommended: z.boolean(),
      new_members_only: z.boolean(),
    });

    const methods = useFormController({
      schema,
      defaultValues: {
        recommended: false,
        new_members_only: false,
      },
    });

    const id = useId();

    return (
      <ControlledForm
        id={id}
        {...methods}
        onSubmit={(data) => console.log(data)}
      >
        <VisibilityRules<
          { recommended: boolean; new_members_only: boolean },
          "recommended" | "new_members_only"
        >
          {...args}
          formId={id}
          recommendedField={{ name: "recommended" }}
          newMembersField={{ name: "new_members_only" }}
          hideFromStaffField={{ name: null }}
        />
        <button form={id} className="mt-md">
          Log results
        </button>
      </ControlledForm>
    );
  },
};

// Documentation - Inherit configuration from the meta object
export const Documentation: StoryObj<VisibilityRulesComponent> = {
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
  recommended: z.boolean(),
  new_members_only: z.boolean(),
  hide_from_staff: z.boolean(),
});
\`\`\`

---

### Generic typing

\`VisibilityRules\` is strongly typed using two generics:

\`\`\`ts
<VisibilityRules<
  { recommended: boolean; new_members_only: boolean; hide_from_staff: boolean },
  "recommended" | "new_members_only" | "hide_from_staff"
>
\`\`\`

- **First generic**: the full form value shape
- **Second generic**: the boolean field paths in your type. 
It should be a literal that lists the different fields you want to resolve.

---

### Required props

| Prop | Description |
|------|------------|
| \`formId\` | ID of the form, used for accessibility and DOM targeting |
| \`recommendedField\` | Configuration for the recommended checkbox |
| \`newMembersField\` | Configuration for the new members only checkbox |
| \`hideFromStaffField\` | Configuration for the hide from staff checkbox |

---

### Field configuration

Each field configuration object has the following shape:

| Prop | Description |
|------|------------|
| \`name\` | Name of the field in the form. Set it to null to remove it and bypass type checking |
| \`reversed\` | If true, the checkbox value will be inverted (checked = false, unchecked = true) |

Example: If your field is "is_visible_to_staff", it's the opposite meaning of "hide_from_staff".
Thus, to align UX with the field logic, you need to enable "reversed" on your field config. 

---
        `,
      },
    },
  },
};
