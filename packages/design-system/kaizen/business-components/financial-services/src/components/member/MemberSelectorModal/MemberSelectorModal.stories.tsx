import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { Button } from "@bsport/kaizen-primitive-core";

import type { Member } from "#src/types/member";

import MemberSelectorModal from "./MemberSelectorModal";

const meta: Meta<typeof MemberSelectorModal> = {
  component: MemberSelectorModal,
  title: "MemberSelectorModal",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MemberSelectorModal>;

export const Default: Story = {
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
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSelect={(member) => {
            setSelectedMember(member);
            console.log("Member selected:", member);
          }}
          onOpenProfile={(memberId) => {
            console.log("Open profile for member:", memberId);
            window.open(`/member/${memberId}/info`, "_blank");
          }}
        />
      </>
    );
  },
};
