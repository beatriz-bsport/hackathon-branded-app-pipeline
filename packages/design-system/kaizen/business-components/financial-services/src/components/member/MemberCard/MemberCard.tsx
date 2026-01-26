import React from "react";

import {
  Avatar,
  Body,
  Button,
  Card,
  Title,
} from "@bsport/kaizen-primitive-core";

import type { Member } from "#src/types/member";

export type MemberCardData = Pick<
  Member,
  "name" | "first_name" | "last_name" | "email" | "photo"
>;

export type MemberCardProps = {
  member: MemberCardData | null;
  onEditClick: () => void;
  className?: string;
};

const MemberCard: React.FC<MemberCardProps> = ({
  member,
  onEditClick,
  className,
}) => {
  if (!member) return null;

  const { name, first_name, last_name, email, photo } = member;
  const finalName = name ?? `${first_name} ${last_name}`;
  const initials =
    `${first_name?.[0] ?? ""}${last_name?.[0] ?? ""}`.toUpperCase();

  return (
    <Card elevated={false} className={className}>
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-sm">
          <Avatar
            src={photo}
            alt={finalName}
            shape="round"
            initials={initials}
            size="md"
          />
          <div className="flex flex-col min-w-0 flex-1">
            <Title htmlVariant="h5" color="default">
              {name}
            </Title>
            {email && (
              <Body htmlVariant="span" color="weak" size="sm">
                {email}
              </Body>
            )}
          </div>
        </div>
        <Button
          kind="icon-button"
          icon="edit-02"
          size="md"
          intent="flat"
          color="default"
          label="Edit member"
          onClick={onEditClick}
        />
      </div>
    </Card>
  );
};

MemberCard.displayName = "KaizenMemberCard";

export default MemberCard;
