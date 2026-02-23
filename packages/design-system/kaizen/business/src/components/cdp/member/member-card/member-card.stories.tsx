import type { Meta, StoryObj } from "@storybook/react-vite";

import { MemberCard, type MemberCardData } from "./member-card";

type MemberCardComponent = typeof MemberCard;

const metaComponentDescription = `
**MemberCard** is a business component that displays a member's summary in a card layout, with avatar, name, email, and an edit action.

### Business Context

This component is intended for contexts where **member display** is required, such as:
- Showing the selected member in a member selector flow.
- Displaying member info in lists or detail views with a quick edit action.
- Reusing a consistent member card pattern across the app.

### How to import?

\`\`\`tsx
import { MemberCard, type MemberCardData } from "@bsport/kaizen-business-components/cdp/member/member-card";
\`\`\`
`;

const metaSourceCode = `
import { MemberCard, type MemberCardData } from "@bsport/kaizen-business-components/cdp/member/member-card";

const member: MemberCardData = {
  name: "John Doe",
  first_name: "John",
  last_name: "Doe",
  email: "john.doe@example.com",
  photo: "https://...",
};

<MemberCard
  member={member}
  onEditClick={() => {}}
/>
`;

const defaultMember: MemberCardData = {
  name: "John Doe",
  first_name: "John",
  last_name: "Doe",
  email: "john.doe@example.com",
  photo: "https://i.pravatar.cc/150?img=12",
};

const meta: Meta<MemberCardComponent> = {
  component: MemberCard,
  title: "CDP/Member/MemberCard",
  parameters: {
    layout: "centered",
    viewport: {
      defaultViewport: "responsive",
    },
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
    member: defaultMember,
    onEditClick: () => {
      console.log("Edit clicked");
    },
  },
};

export default meta;
type Story = StoryObj<MemberCardComponent>;

// Default - Inherit configuration from the meta object.
// Goal: Manipulate the story.
export const Default: Story = {};

// Documentation - Inherit configuration from the meta object.
// Goal: Add story description to dive into implementation details.
export const Documentation: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### MemberCardData

\`member\` accepts \`MemberCardData\`, which is a subset of \`Member\`:

\`\`\`ts
type MemberCardData = Pick<
  Member,
  "name" | "first_name" | "last_name" | "email" | "photo"
>;
\`\`\`

- \`name\` is used as the main display name when present; otherwise \`first_name\` and \`last_name\` are combined.
- \`photo\` and \`email\` are optional; the card hides the email line when empty and shows initials in the avatar when no photo is provided.

---

### Required props

| Prop | Description |
|------|------------|
| \`member\` | Member data to display, or \`null\` (component renders nothing) |
| \`onEditClick\` | Callback when the edit button is clicked |

### Optional props

| Prop | Description |
|------|------------|
| \`className\` | Optional CSS class for the card container |
        `,
      },
    },
  },
};

export const WithoutPhoto: Story = {
  args: {
    member: {
      ...defaultMember,
      photo: undefined,
    },
  },
};

export const WithoutEmail: Story = {
  args: {
    member: {
      ...defaultMember,
      email: "",
    },
  },
};
