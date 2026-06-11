import type { RecurrenceRuleBooking } from "@bsport/api-book";
import type { Member } from "@bsport/api-cdp";

import { getMemberInitials } from "#src/utils/get-member-initials";

export type RecurringBookingRow = {
  /** Rule id — used as the Kaizen Table row id. */
  id: number;
  memberId: number;
  memberName: string;
  memberPhoto?: string;
  memberInitials: string;
  dayOfWeek: number;
  hour: number;
  minute: number;
  /** delay_week — how many weeks in advance the member is enrolled. */
  week: number;
};

export const buildRecurringBookingRows = (
  rules: RecurrenceRuleBooking[],
  membersById: Record<string, Member>,
): RecurringBookingRow[] =>
  rules.map((rule) => {
    const member = membersById[String(rule.member)];
    return {
      id: rule.id,
      memberId: rule.member,
      memberName: member?.name ?? "",
      memberPhoto: member?.photo,
      memberInitials: getMemberInitials({
        firstname: member?.first_name,
        lastname: member?.last_name,
      }),
      dayOfWeek: rule.day_of_week,
      hour: rule.hour,
      minute: rule.minute,
      week: rule.delay_week,
    };
  });
