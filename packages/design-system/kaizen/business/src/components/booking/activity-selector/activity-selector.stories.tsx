import type { Meta, StoryObj } from "@storybook/react-vite";
import { useId, useState } from "react";
import { z } from "zod";

import { ControlledForm, useFormController } from "@bsport/form";

import { fetch } from "#src/utils/fetch";
import { tanstackQueryDevToolsDecorator } from "#src/utils/stories";

import { ActivityFormSelector } from "./activity-form-selector";
import { ActivityRawSelector, DEFAULT_PROPS } from "./activity-raw-selector";

const metaComponentDescription = `
**ActivitySelector** is a business component wrapping \`AutocompleteControlled\` to select group activities or workshops, in single or multi-select mode.
- **ActivityFormSelector**: Wrapped in a FormField
- **ActivityRawSelector**: Raw component

It handles internally:
- the infinite paginated fetch of activities,
- the switch to the search endpoint as soon as the user types,
- the resolution of preselected ids so their labels remain visible.

All other \`AutocompleteControlled\` props are forwarded — see the *Additional props* section below.

### Business Context

This component is intended for use in workflows where one or more **activities** must be selected, such as:
- Linking a session/class to its activity (single-select)
- Filtering or restricting a feature to a list of activities (multi-select)

### How to import?

\`\`\`tsx
import { ActivityFormSelector } from "@bsport/kaizen-business-components/booking/activity-selector";
\`\`\`
`;

const metaSourceCode = `
import { ActivityFormSelector } from "@bsport/kaizen-business-components/booking/activity-selector";
import { fetch } from "#src/utils/fetch";

// ...

const schema = z.object({
  activities: z.array(z.coerce.number()),
});

const methods = useFormController({
  schema,
  defaultValues: {
    activities: [],
  },
});

<ControlledForm {...methods}>
  <ActivityFormSelector<
    { activities: number[] /* ...otherFields, etc */ },
    "activities"
  >
    id="activity-selector-example"
    fieldName="activities"
    fetch={fetch}
    multiSelect
    ...
  />
</ControlledForm>
`;

type ActivitySelectorComponent = typeof ActivityFormSelector;

const meta: Meta<ActivitySelectorComponent> = {
  component: ActivityFormSelector,
  title: "Booking/ActivitySelector",
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
      activities: z.array(z.coerce.number()),
    });

    const methods = useFormController({
      schema,
      defaultValues: {
        activities: [],
      },
    });

    const formId = useId();

    return (
      <ControlledForm
        id={formId}
        {...methods}
        onSubmit={(data) => console.log(data)}
      >
        <ActivityFormSelector<{ activities: number[] }, "activities">
          {...args}
          id={`activity-selector-example-${useId()}`}
          fieldName="activities"
          fetch={fetch}
        />

        <button form={formId} className="mt-md">
          Log results
        </button>
      </ControlledForm>
    );
  },
  args: {
    ...DEFAULT_PROPS,
    required: false,
  },
};

export default meta;

// Default - Single-select, no preselected value
export const Default: StoryObj<ActivitySelectorComponent> = {};

// Multi-select with chips
export const MultiSelect: StoryObj<ActivitySelectorComponent> = {
  args: {
    multiSelect: true,
  },
};

// With a predefined value (resolved via fetchGroupActivitiesAndWorkshopsQueryOptions)
export const WithPredefinedValues: StoryObj<ActivitySelectorComponent> = {
  render: (args) => {
    const schema = z.object({
      activities: z.array(z.coerce.number()),
    });

    const methods = useFormController({
      schema,
      defaultValues: {
        activities: [1, 2],
      },
    });

    const formId = useId();

    return (
      <ControlledForm
        id={formId}
        {...methods}
        onSubmit={(data) => console.log(data)}
      >
        <ActivityFormSelector<{ activities: number[] }, "activities">
          {...args}
          id={`activity-selector-example-${useId()}`}
          fieldName="activities"
          fetch={fetch}
          multiSelect
        />

        <button form={formId} className="mt-md">
          Log results
        </button>
      </ControlledForm>
    );
  },
};

// Workshops only
export const WorkshopsOnly: StoryObj<ActivitySelectorComponent> = {
  args: {
    isWorkshop: true,
  },
};

// Raw Selector - Show raw usage of ActivityRawSelector
const rawSelectorSourceCode = `
import { useState } from "react";

const [selectedIds, setSelectedIds] = useState<number[]>([]);

<ActivityRawSelector
  id="activity-selector-example"
  fetch={fetch}
  value={selectedIds}
  onChange={setSelectedIds}
  multiSelect
/>
`;

export const RawSelector: StoryObj<typeof ActivityRawSelector> = {
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
      <ActivityRawSelector
        {...args}
        id={`activity-selector-example-${useId()}`}
        fetch={fetch}
        value={selectedIds}
        onChange={setSelectedIds}
      />
    );
  },
};

// Documentation - Inherit configuration from the meta object.
// Goal: Add story description to dive into implementation details.
export const Documentation: StoryObj<ActivitySelectorComponent> = {
  parameters: {
    docs: {
      description: {
        story: `
### Form schema

The form value is always a number array — single-select means the array has at most one element.

\`\`\`ts
const schema = z.object({
  activities: z.array(z.coerce.number()), // Apply other constraints
});
\`\`\`

---

### Generic typing

\`ActivityFormSelector\` is strongly typed using two generics:

\`\`\`ts
<ActivityFormSelector<
  { activities: number[] },
  "activities"
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
| \`fetch\` | Fetch instance used internally to load activities |

### Optional filtering props

| Prop | Description |
|------|------------|
| \`isWorkshop\` | When defined, restricts to workshops (true) or group activities (false) |
| \`customerEnabled\` | When false, includes archived activities. Defaults to true |

### Forwarded \`AutocompleteControlled\` props

Any prop accepted by [\`AutocompleteControlled\`](?path=/docs/primitive-core-autocomplete--docs) (other than the internally-managed \`value\`, \`onChange\`, \`items\` and \`loadingProps\`) is forwarded.

The following are merged with defaults rather than replaced — pass them and yours win at the leaf level:

| Prop | Default |
|------|--------|
| \`multiSelect\` | \`false\` (single-select with radio buttons) |
| \`textfieldProps\` | \`{ id, placeholder, label, iconRight: "chevron-down" }\` |
| \`menuProps\` | \`{ className: "max-h-component-select overflow-y-auto", onScroll: <infinite-scroll handler> }\` |
| \`onValueChange\` | Internal search-query setter (also called after yours) |
| \`onClear\` | Internal search-query reset (also called after yours) |

---

### Requirements

- @bsport/fetch
- @bsport/form
- @bsport/kaizen-primitive-core
- @tanstack/react-query
        `,
      },
    },
  },
};
