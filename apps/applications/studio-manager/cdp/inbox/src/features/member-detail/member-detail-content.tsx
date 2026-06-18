import { Divider } from "@bsport/kaizen-primitive-core";

import { MemberDetailAccount } from "#src/features/member-detail/account/member-detail-account";
import { MemberDetailHeader } from "#src/features/member-detail/header/member-detail-header";
import { MemberDetailNotes } from "#src/features/member-detail/notes/member-detail-notes";
import { MemberDetailTags } from "#src/features/member-detail/tags/member-detail-tags";

import { useMemberDetailData } from "./use-member-detail-data";

export type MemberDetailContentProps = {
  memberId: number;
};

export function MemberDetailContent({ memberId }: MemberDetailContentProps) {
  const {
    name,
    joinedLabel,
    birthdayLabel,
    isBirthdayToday,
    contactItems,
    unpaidInvoicesCount,
    creditAccountBalanceLabel,
    tags,
    notes,
  } = useMemberDetailData(memberId);

  return (
    <aside className="flex h-full min-h-[640px] w-full max-w-[320px] flex-col gap-md overflow-y-auto border-l-stroke-thin border-l-stroke-weak bg-surface-page-navigation px-xs py-md">
      <MemberDetailHeader
        name={name}
        joinedLabel={joinedLabel}
        birthdayLabel={birthdayLabel}
        isBirthdayToday={isBirthdayToday}
      />
      <Divider />
      <div className="flex flex-col gap-md">
        <MemberDetailAccount
          contactItems={contactItems}
          unpaidInvoicesCount={unpaidInvoicesCount}
          creditAccountBalanceValue={creditAccountBalanceLabel}
        />
        <Divider />
        <MemberDetailTags tags={tags} />
        <Divider />
        <MemberDetailNotes notes={notes} />
      </div>
    </aside>
  );
}
