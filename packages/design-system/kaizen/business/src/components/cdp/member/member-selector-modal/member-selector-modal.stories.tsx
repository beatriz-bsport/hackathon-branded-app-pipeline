import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import type { Member } from "@bsport/api-cdp";
import { Button } from "@bsport/kaizen-primitive-core";

import fetch from "#src/utils/fetch";

import { MemberSelectorModal } from "./member-selector-modal";

type MemberSelectorModalComponent = typeof MemberSelectorModal;

const metaComponentDescription = `
**MemberSelectorModal** is a business component that provides a modal dialog for searching and selecting a member.

### Business Context

This component is intended for use in any workflow where **member selection** is needed, for example:
- Assigning or linking a member to another resource or entity.
- Allowing users to search for and pick a member in various flows, dashboards, or modal dialogs.
- Any UI that requires "choose a member" capabilities with integrated search and optional profile viewing.

### How to import?

\`\`\`tsx
import { MemberSelectorModal } from "@bsport/kaizen-business-components/cdp/member/member-selector-modal";
\`\`\`
`;

const metaSourceCode = `
import { MemberSelectorModal } from "@bsport/kaizen-business-components/cdp/member/member-selector-modal";

import { fetch } from "#src/utils/fetch";

<MemberSelectorModal
  fetch={fetch}
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSelect={(member) => { /* handle selection */ }}
  onOpenProfile={(memberId) => window.open(\`/member/\${memberId}/info\`, "_blank")}
/>
`;

const meta: Meta<MemberSelectorModalComponent> = {
  component: MemberSelectorModal,
  title: "CDP/Member/MemberSelectorModal",
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
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);

    return (
      <>
        <div className="mb-md space-y-sm">
          <Button
            label="Open Member Selector"
            size="md"
            intent="default"
            color="main"
            onClick={() => setIsOpen(true)}
          />
          {selectedMember && (
            <div className="p-md bg-gray-100 rounded">
              <p className="font-medium">Selected Member:</p>
              <p>Name: {selectedMember.name}</p>
              <p>Email: {selectedMember.email}</p>
              <p>ID: {selectedMember.id}</p>
            </div>
          )}
        </div>
        <MemberSelectorModal
          fetch={fetch}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSelect={(member) => {
            setSelectedMember(member);
            console.log("Member selected:", member);
          }}
          onOpenProfile={(memberId) => {
            console.log("Open profile for member:", memberId);
            if (typeof window !== "undefined" && window?.open) {
              window.open(`/member/${memberId}/info`, "_blank");
            } else {
              console.log(`Would open /member/${memberId}/info in a new tab`);
            }
          }}
        />
      </>
    );
  },
};

export default meta;
type Story = StoryObj<MemberSelectorModalComponent>;

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
### Fetch prop

Provide the fetch instance from your app (e.g. from src/utils/fetch).

---

### Required props

| Prop | Description |
|------|------------|
| \`fetch\` | Function to load \`Member[]\` (e.g. with search params) |
| \`isOpen\` | Controls modal visibility |
| \`onClose\` | Called when the modal is closed (cancel, outside click, or after select) |
| \`onSelect\` | Called with the selected \`Member\` when the user confirms |

### Optional props

| Prop | Description |
|------|------------|
| \`onOpenProfile\` | Called when the user opens a member profile; if omitted, defaults to \`window.open(\`/member/\${memberId}/info\`, "_blank")\` |
        `,
      },
    },
  },
};
