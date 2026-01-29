---
to: src/components/<%= name %>/<%= h.inflection.camelize(name.split('/').pop(), false) %>.stories.tsx
---
<%
const componentName = name.split('/').pop();
const ComponentName = h.inflection.camelize(componentName, false);
-%>
import type { Meta, StoryObj } from "@storybook/react";
import <%= ComponentName %> from "./<%= ComponentName %>";

const meta: Meta<typeof <%= ComponentName %>> = {
    component: <%= ComponentName %>,
    argTypes: {
        // Props control here
    },
};

export default meta;

type Story = StoryObj<typeof <%= ComponentName %>>;

export const Primary: Story = {
    name: "<%= ComponentName %>",
    args: {
        // Default args here
    },
};

