import { random } from "lodash";
import { useMemo } from "react";

import { Member } from "@bsport/store-core-data-member";

import type { FormattedMember } from "./constants";

/**
 * Extract data from a member and format them in a useful way for the ListItem
 * @param member Source member to extract data from
 * @returns The formatted data
 */
const formatMember = (member: Partial<Member>): FormattedMember => {
  /** @todo Remove the random when using real data */
  const uniqueId = `member-${member.id}-${random(0, 1000000)}`;
  const name = member.name ?? `${member.first_name} ${member.last_name}`;
  return {
    id: uniqueId,
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
  };
};

export const useFormatMembers = (members: Member[]) => {
  return useMemo(() => {
    return members.map(formatMember);
  }, [members]);
};
