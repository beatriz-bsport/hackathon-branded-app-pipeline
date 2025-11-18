---
to: src/components/<%= Name %>/<%= Name %>.stories.tsx
---
import type { Meta, StoryObj } from "@storybook/react";
import <%= Name %> from "./<%= Name %>";

const meta: Meta<typeof <%= Name %>> = {
    component: <%= Name %>,
    argTypes: {
        // Props control here
    },
};

export default meta;

type Story = StoryObj<typeof <%= Name %>>;

export const Primary: Story = {
    name: "<%= Name %>",
    args: {
        // Default args here
    },
};
