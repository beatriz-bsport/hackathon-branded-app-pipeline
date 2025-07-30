import { useMemo } from "react";

import {
  type Member,
  addMemberToSearchHistoryAction,
} from "@bsport/store-core-data-member";

import type { FormattedMember } from "./constants";

/**
 * Extract data from a member and format them in a useful way for the ListItem
 * @param member Source member to extract data from
 * @returns The formatted data
 */
const formatMember = (member: Member): FormattedMember => {
  const name = member.name ?? `${member.first_name} ${member.last_name}`;
  return {
    id: String(member.id),
    avatar: {
      src: member.photo,
      alt: name,
      initials:
        `${member.first_name?.[0] ?? ""}${member.last_name?.[0] ?? ""}`.toUpperCase(),
    } as const,
    name: name,
    email: member.email,
    phone: member.phone,
    tags: member.tags ?? [],
    onClick: () => addMemberToSearchHistoryAction(member),
  };
};

export const useFormatMembers = ({
  members,
  reverse = false,
}: {
  members: Member[];
  reverse?: boolean;
}) => {
  return useMemo(() => {
    const formattedList = members.map(formatMember);
    return reverse ? formattedList.reverse() : formattedList;
  }, [members, reverse]);
};
