import { FC } from "react";

import type { Member, MemberNote } from "@bsport/api-cdp/member";
import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import {
  DATETIME_FORMATS,
  formatDateTimeFromDate,
} from "@bsport/datetime-formatting";
import { fromIsoString } from "@bsport/datetime-manipulation";
import {
  Body,
  Button,
  Chip,
  Title,
  useCopyToClipboard,
} from "@bsport/kaizen-primitive-core";

import { useFetchTags } from "#src/hooks/tags/use-fetch-tags";
import {
  type SessionManagementModalParams,
  SessionManagementModalType,
} from "#src/hooks/use-session-management-modals";
import { useTranslation } from "#src/utils/i18n";
import { useObjectLevelPermission } from "#src/utils/permission";

import { ShortcutActionsButton } from "../action-buttons/booking/shortcut-actions-button";
import { BookingActionItemId } from "../action-buttons/booking/types";
import { Section } from "./section";

export const ClientDetails: FC<{
  sessionId: number;
  memberData:
    | (Member & {
        notes?: MemberNote[];
      })
    | undefined;
  isNewClient?: boolean;
  bookingId?: number;
  openModal?: (
    type: SessionManagementModalType,
    params?: SessionManagementModalParams,
  ) => void;
}> = ({ sessionId, memberData, isNewClient, bookingId, openModal }) => {
  const { t, i18n } = useTranslation("sessionManagement");

  const locale = i18n.language;

  const { copyToClipboard } = useCopyToClipboard();

  const hasReadInfoPermission = useObjectLevelPermission(
    "member.allowed_actions.readInfo",
  );

  const { data: memberTags } = useFetchTags((tags) =>
    tags.filter((tag) => (memberData?.tags ?? []).includes(tag.id)),
  );

  if (!memberData) return null;

  const unpaidAmount = Number(memberData.total_unpaid_amount ?? 0);

  const balance = Number(memberData.credit_account_balance ?? 0);

  // Despite its name, highlighted actually means "is private"
  // There's even a comment in the Backemd code acknowledging the misleading name
  const memberNotes = (memberData.notes ?? []).filter(
    (note) => !note.is_medical && !note.highlighted,
  );

  return (
    <div className="flex flex-col gap-sm">
      <div className="flex items-center gap-lg justify-between">
        <Title htmlVariant="h3" weight="strong">
          {t("participantDetails.clientDetails")}
        </Title>
        <ShortcutActionsButton
          bookingId={bookingId}
          openModal={openModal}
          sessionId={sessionId}
          memberId={memberData.id}
          allowedItemIds={[
            BookingActionItemId.SELL_ITEMS,
            BookingActionItemId.SEND_MESSAGE,
            BookingActionItemId.RESOLVE_UNPAID_INVOICES,
            BookingActionItemId.UPDATE_MEMBER_NOTES,
          ]}
        />
      </div>
      <div className="flex items-center gap-lg justify-between">
        <Body size="md" weight="weak" color="weak">
          {t("participantDetails.memberSince", {
            memberSince: formatDateTimeFromDate(
              fromIsoString(memberData.date_joined ?? ""),
              DATETIME_FORMATS.DAY_MONTH_YEAR,
              { locale },
            ),
          })}
        </Body>
        {isNewClient && (
          <Chip
            size="lg"
            color="default"
            type="weak"
            label={t("bookingsTable.chips.new")}
          />
        )}
      </div>
      <Section>
        {hasReadInfoPermission && memberData.email && (
          <div className="flex gap-xs items-center">
            <Body color="default">{memberData.email}</Body>
            <Button
              kind="icon-button"
              icon="copy-07"
              label={t("actions.copyClientEmail")}
              intent="flat"
              size="md"
              color="default"
              onClick={() => {
                copyToClipboard(memberData.email);
              }}
            />
          </div>
        )}
        {hasReadInfoPermission && memberData.phone && (
          <div className="flex gap-xs items-center">
            <Body color="default">{memberData.phone}</Body>
            <Button
              kind="icon-button"
              icon="copy-07"
              label={t("actions.copyClientPhone")}
              intent="flat"
              size="md"
              color="default"
              onClick={() => {
                if (memberData.phone) {
                  copyToClipboard(memberData.phone);
                }
              }}
            />
          </div>
        )}
      </Section>
      {memberNotes.length > 0 && (
        <Section title={t("participantDetails.notes")}>
          {memberNotes.map((note) => (
            <Body key={note.id}>{note.text}</Body>
          ))}
        </Section>
      )}
      <Section title={t("participantDetails.billing")}>
        {unpaidAmount > 0 && (
          <div className="flex gap-xs items-center">
            <Body color="default">
              {t("participantDetails.unpaidInvoices")}
            </Body>
            <Body weight="strong" color="critical">
              {getCurrencyDisplayWithPrice(unpaidAmount, true)}
            </Body>
          </div>
        )}
        <div className="flex gap-xs items-center">
          <Body color="default">{t("participantDetails.balance")}</Body>
          <Body weight="strong" color={balance < 0 ? "critical" : "positive"}>
            {getCurrencyDisplayWithPrice(balance, balance < 0)}
          </Body>
        </div>
      </Section>
      {memberTags && memberTags?.length > 0 && (
        <Section title={t("participantDetails.tags")}>
          <div className="flex flex-wrap gap-xs">
            {memberTags?.map((tag) => (
              <Chip
                key={tag.id}
                size="lg"
                color="main"
                type="weak"
                rounded="lg"
                label={tag.name}
              />
            ))}
          </div>
        </Section>
      )}
    </div>
  );
};
