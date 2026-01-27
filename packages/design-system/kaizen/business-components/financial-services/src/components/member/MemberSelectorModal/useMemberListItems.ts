import React from "react";

import { Button, type ListItemProps } from "@bsport/kaizen-primitive-core";

import type { Member } from "#src/types/member";

type UseMemberListItemsProps = {
  members: Member[];
  onSelect: (member: Member) => void;
  onOpenProfile: (memberId: number) => void;
  selectedMemberId?: number;
};

export const useMemberListItems = ({
  members,
  onSelect,
  onOpenProfile,
  selectedMemberId,
}: UseMemberListItemsProps): Array<ListItemProps> => {
  return members.map((member) => {
    const { name, first_name, last_name, id, email, photo } = member;
    const finalName = name ?? `${first_name} ${last_name}`;
    const initials =
      `${first_name?.[0] ?? ""}${last_name?.[0] ?? ""}`.toUpperCase();

    return {
      id: String(id),
      avatar: {
        src: photo,
        alt: finalName,
        shape: "round",
        initials,
      },
      title: name,
      description: email,
      onItemClick: () => onSelect(member),
      isActive: selectedMemberId === id,
      customNode: React.createElement(Button, {
        kind: "icon-button",
        icon: "share-03",
        size: "md",
        intent: "flat",
        color: "default",
        label: `Open ${name} profile`,
        onClick: (e: React.MouseEvent) => {
          e.stopPropagation();
          onOpenProfile(id);
        },
      }),
    };
  });
};
