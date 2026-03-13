import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { fetch } from "#src/utils/fetch";

import { BookkeepingAccountModalCreator } from "./modal-creator";

const metaComponentDescription = `
**BookkeepingAccountModalCreator** is a modal dialog for creating new bookkeeping accounts. It includes form fields for account number, account name, and VAT rate, with internal validation and user feedback.

### Business Context

This component is used in workflows where users need to create new bookkeeping accounts, such as:
- Financial administration
- Account setup
- Selector for Bookkeeping accounts

### How to import?

\`\`\`tsx
import { BookkeepingAccountModalCreator } from "@bsport/kaizen-business-components/financial-services/bookkeeping-account/modal-creator";
\`\`\`
`;

const metaSourceCode = `
import { fetch } from "#src/utils/fetch"; // fetch instance from your app
...

const [isOpen, setIsOpen] = useState(false);

<BookkeepingAccountModalCreator
  isOpen={isOpen}
  closeModal={() => setIsOpen(false)}
  onSuccess={() => console.log("Account created successfully!")}
  onError={() => console.error("Failed to create account.")}
  fetch={fetch}
/>
`;

type BookkeepingAccountModalCreatorComponent =
  typeof BookkeepingAccountModalCreator;

const meta: Meta<BookkeepingAccountModalCreatorComponent> = {
  component: BookkeepingAccountModalCreator,
  title: "Financial Services/Bookkeeping Account/Modal Creator",
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
    isOpen: {
      table: {
        type: { summary: "boolean" },
      },
      control: { type: "boolean" },
    },
    closeModal: {
      table: {
        type: { summary: "function" },
      },
    },
    onSuccess: {
      table: {
        type: { summary: "function" },
      },
    },
    onError: {
      table: {
        type: { summary: "function" },
      },
    },
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <button onClick={() => setIsOpen(true)}>Open Modal</button>
        <BookkeepingAccountModalCreator
          {...args}
          isOpen={isOpen}
          closeModal={() => setIsOpen(false)}
        />
      </>
    );
  },
  args: {
    isOpen: false,
    closeModal: undefined,
    onSuccess: (params) => console.log("Success with these params:", params),
    onError: (params) => console.log("Error with these params:", params),
    fetch: fetch,
  },
  tags: ["autodocs"],
};

export default meta;

// Default - Inherit configuration from the meta object
// Goal: Manipulate and see the story.
export const Default: StoryObj<BookkeepingAccountModalCreatorComponent> = {};

// Documentation - Inherit configuration from the meta object
// Goal: Add story description to dive into implementation details.
export const Documentation: StoryObj<BookkeepingAccountModalCreatorComponent> =
  {
    parameters: {
      docs: {
        description: {
          story: `
### Requirements

- @bsport/form
- @bsport/kaizen-primitive-core
- @tanstack/react-query

---

### Required props

| Prop | Description |
|------|------------|
| \`isOpen\` | Controls the visibility of the modal |
| \`closeModal\` | Callback to close the modal |
| \`fetch\` | Fetch instance of your application |

---

### Optional props

| Prop | Description |
|------|------------|
| \`onSuccess\` | Callback for successful form submission |
| \`onError\` | Callback for failed form submission |

---
        `,
        },
      },
    },
  };
