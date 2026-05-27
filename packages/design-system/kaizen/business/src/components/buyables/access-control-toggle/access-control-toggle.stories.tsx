import type { Meta, StoryObj } from "@storybook/react-vite";
import { z } from "zod";

import { ControlledForm, useFormController } from "@bsport/form";

import {
  AccessControlToggle,
  UPSELL_IDENTIFIER_KISI_INTEGRATION,
} from "./access-control-toggle";

type AccessControlToggleComponent = typeof AccessControlToggle;

const metaComponentDescription = `
**AccessControlToggle** binds a boolean form field to a \`Toggle\` that controls whether members holding a buyable can unlock studio doors through the Kisi integration.

### Business Context

Use it inside any \`ControlledForm\` that exposes a boolean field representing access control. Time-based access rules are managed in the Kisi platform; this toggle only flips the global access flag for the buyable.

The toggle only renders when:
- the company has the **Kisi Integration** (\`upsell_identifier = 40\`) **or** **Access Monitoring** (\`upsell_identifier = 34\`) feature enabled, **and**
- the current object is eligible for access control (\`isObjectValidForAccessControl\`).

When the optional \`onlyVodAccessFieldName\` is provided, turning the access toggle on resets that sibling boolean field to \`false\` (mutually exclusive access modes).

### How to import?

\`\`\`tsx
import { AccessControlToggle } from "@bsport/kaizen-business-components/buyables/access-control-toggle";
\`\`\`
`;

const metaSourceCode = `
import { AccessControlToggle } from "@bsport/kaizen-business-components/buyables/access-control-toggle";

const schema = z.object({
  grantsDoorAccess: z.boolean(),
  onlyVodAccess: z.boolean(),
});

const methods = useFormController({
  schema,
  defaultValues: {
    grantsDoorAccess: false,
    onlyVodAccess: false,
  },
});

<ControlledForm {...methods}>
  <AccessControlToggle<
    { grantsDoorAccess: boolean; onlyVodAccess: boolean },
    "grantsDoorAccess",
    "onlyVodAccess"
  >
    fieldName="grantsDoorAccess"
    onlyVodAccessFieldName="onlyVodAccess"
    features={companyFeatures}
    isObjectValidForAccessControl
  />
</ControlledForm>
`;

const mockedKisiFeature = [
  {
    readable_identifier: "kisi_integration",
    upsell_identifier: UPSELL_IDENTIFIER_KISI_INTEGRATION,
    is_free_trial: false,
    trial_remaining_days: null,
  },
];

const meta: Meta<AccessControlToggleComponent> = {
  component: AccessControlToggle,
  title: "Buyables/AccessControlToggle",
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
  decorators: [
    (Story) => (
      <div style={{ width: "500px" }}>
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
  args: {
    isObjectValidForAccessControl: true,
  },
  argTypes: {
    isObjectValidForAccessControl: { control: "boolean" },
  },
  render: (args) => {
    const schema = z.object({
      grantsDoorAccess: z.boolean(),
      onlyVodAccess: z.boolean(),
    });

    const methods = useFormController({
      schema,
      defaultValues: {
        grantsDoorAccess: false,
        onlyVodAccess: false,
      },
    });

    return (
      <ControlledForm {...methods} onSubmit={(data) => console.log(data)}>
        <AccessControlToggle<
          { grantsDoorAccess: boolean; onlyVodAccess: boolean },
          "grantsDoorAccess",
          "onlyVodAccess"
        >
          fieldName="grantsDoorAccess"
          onlyVodAccessFieldName="onlyVodAccess"
          features={mockedKisiFeature}
          isObjectValidForAccessControl={args.isObjectValidForAccessControl}
        />
      </ControlledForm>
    );
  },
};

export default meta;

// Default - Inherit configuration from the meta object.
// Goal: Manipulate the story.
export const Default: StoryObj<AccessControlToggleComponent> = {};

// Documentation - Inherit configuration from the meta object.
// Goal: Add story description to dive into implementation details.
export const Documentation: StoryObj<AccessControlToggleComponent> = {
  parameters: {
    docs: {
      description: {
        story: `
### Requirements

- \`@bsport/kaizen-primitive-core\`
- \`@bsport/form\`

---

### Form schema

The toggle binds to a single boolean field. When a sibling field is reset on enable, both must be declared:

\`\`\`ts
const schema = z.object({
  grantsDoorAccess: z.boolean(),
  onlyVodAccess: z.boolean(),
});
\`\`\`

---

### Generic typing

\`AccessControlToggle\` is strongly typed using three generics:

\`\`\`ts
<AccessControlToggle<
  { grantsDoorAccess: boolean; onlyVodAccess: boolean },
  "grantsDoorAccess",
  "onlyVodAccess"
>
\`\`\`

- **First generic**: the full form value shape
- **Second generic**: the boolean field bound to the toggle
- **Third generic**: the (optional) boolean sibling field reset to \`false\` when the toggle turns on

---

### Required props

| Prop | Description |
|------|-------------|
| \`fieldName\` | Name of the boolean field in the form |
| \`features\` | Company features array used to gate the toggle behind the Kisi-related upsells |
| \`isObjectValidForAccessControl\` | Whether the current object (pass, pack, …) is eligible for access control |

### Optional props

| Prop | Description |
|------|-------------|
| \`onlyVodAccessFieldName\` | Sibling boolean field reset to \`false\` when the toggle turns on |
| \`id\` | HTML id forwarded to the underlying Toggle |
| \`formId\` | Prefix used to derive the final id when \`id\` is not provided |
| Any other \`ToggleProps\` | Forwarded to the underlying \`Toggle\` |
        `,
      },
    },
  },
};
