import type { MemberDetail } from "@bsport/api-cdp/member";
import type { Tag, TagGroup } from "@bsport/api-cdp/tags";
import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";

import type {
  MemberDetailNoteItem,
  MemberDetailPanelProps,
  MemberDetailTagItem,
} from "./types";

/**
 * Adapts the API {@link MemberDetail} (plus the unpaid-invoice count and the tag
 * reference data) into the presentational {@link MemberDetailPanelProps} the panel
 * renders. Pure and side-effect free so it can run inside the query `combine`
 * step — TanStack Query memoizes the result and only re-runs it when the
 * underlying query data changes, not on every render.
 */
export const mapMemberDetailToPanelProps = (
  member: MemberDetail,
  unpaidInvoicesCount: number,
  tags: Tag[],
  tagGroups: TagGroup[],
): MemberDetailPanelProps => {
  const tagsById = new Map(tags.map((tag) => [tag.id, tag]));
  const groupNameById = new Map(
    tagGroups.map((group) => [group.id, group.name]),
  );
  const phone = member.phone_number ?? member.phone ?? "-";

  return {
    name: member.name,
    joinedLabel: formatDate(member.date_joined),
    birthdayLabel: member.birthday ? formatDate(member.birthday) : undefined,
    isBirthdayToday: member.birthday ? isTodayMonthDay(member.birthday) : false,
    contactItems: [
      {
        id: "phone",
        icon: "phone-02",
        value: phone,
        optedIn: member.accept_sms === true,
      },
      {
        id: "email",
        icon: "mail-01",
        value: member.email || "-",
        optedIn: member.accept_email,
      },
    ],
    unpaidInvoicesCount,
    creditAccountBalanceLabel: getCurrencyDisplayWithPrice(
      parseAmount(member.credit_account_balance),
    ),
    // `member.tags` is a list of tag IDs; resolve each to its name/color/group
    // from the fetched tag + tag-group reference data. Unknown IDs are dropped.
    tags: member.tags
      .map((tagId) => tagsById.get(tagId))
      .filter((tag): tag is Tag => tag != null)
      .map((tag) => mapTag(tag, groupNameById)),
    // Mirror the Booking vertical (ClientDetails): hide medical and private
    // notes — `highlighted` is misleadingly named and means "is private".
    notes: member.notes
      .filter((note) => !note.is_medical && !note.highlighted)
      .map(mapNote),
  };
};

const mapNote = (
  note: MemberDetail["notes"][number],
): MemberDetailNoteItem => ({
  id: note.id,
  date: formatDateTime(note.date, DATETIME_FORMATS.SHORT_DATE),
  text: note.text,
});

const mapTag = (
  tag: Tag,
  groupNameById: Map<number, string>,
): MemberDetailTagItem => {
  const groupName = groupNameById.get(tag.group);

  return {
    id: tag.id,
    label: groupName ? `${groupName}: ${tag.name}` : tag.name,
    color: tag.color,
  };
};

const parseAmount = (value: number | string): number => {
  if (typeof value === "number") return value;
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
};

const formatDate = (iso: string): string => {
  return formatDateTime(iso, DATETIME_FORMATS.FULL_DATE);
};

const isTodayMonthDay = (isoDate: string): boolean => {
  const [month, day] = isoDate.split("-").slice(1);
  const today = new Date();
  const todayMonth = String(today.getMonth() + 1).padStart(2, "0");
  const todayDay = String(today.getDate()).padStart(2, "0");

  return month === todayMonth && day === todayDay;
};
