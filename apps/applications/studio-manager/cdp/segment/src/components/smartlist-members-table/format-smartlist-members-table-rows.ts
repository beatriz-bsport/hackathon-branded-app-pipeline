import type { SmartlistMember } from "@bsport/api-cdp/smartlist";
import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";

import { i18nInstance } from "#src/utils/i18n";

import type { SmartlistMembersTableRow } from "./types";

const SMARTLIST_MEMBERS_ROW_PREFIX = "smartlist-member-row";

export const MEMBER_PROFILE_URL = (memberId: number) =>
  `/member/${memberId}/info`;

/**
 * Maps API members to table row data for display.
 */
export const formatSmartlistMembersTableRows = (
  members: SmartlistMember[],
): SmartlistMembersTableRow[] => {
  return members.map((member) => ({
    id: `${SMARTLIST_MEMBERS_ROW_PREFIX}-${member.id}`,
    memberId: member.id,
    name: member.name,
    email: member.email || null,
    balance: Number(member.credit_account_balance ?? 0),
    joinDateLabel: formatDateTime(
      member.date_joined,
      DATETIME_FORMATS.DAY_MONTH_YEAR,
      {
        locale: i18nInstance.language,
        timeZone: "utc",
      },
    ),
    link: MEMBER_PROFILE_URL(member.id),
  }));
};
