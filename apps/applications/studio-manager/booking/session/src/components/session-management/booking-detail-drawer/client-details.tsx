import { FC } from "react";

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

import { SessionManagementModalType } from "#src/hooks/use-session-management-modals";
import { RefinedBooking } from "#src/types";
import { useTranslation } from "#src/utils/i18n";

import { ShortcutActionsButton } from "../action-buttons/booking/shortcut-actions-button";
import { BookingActionItemId } from "../action-buttons/booking/types";
import { Section } from "./section";

export const ClientDetails: FC<{
  selectedBooking: RefinedBooking;
  openModal: (type: SessionManagementModalType, bookingId: number) => void;
}> = ({ selectedBooking, openModal }) => {
  const { t, i18n } = useTranslation("sessionManagement");

  const locale = i18n.language;

  const { copyToClipboard } = useCopyToClipboard();

  if (!selectedBooking) return null;

  return (
    <div className="flex flex-col gap-sm">
      <div className="flex items-center gap-lg justify-between">
        <Title htmlVariant="h3" weight="strong">
          {t("participantDetails.clientDetails")}
        </Title>
        <ShortcutActionsButton
          bookingId={selectedBooking?.id}
          openModal={openModal}
          sessionId={selectedBooking.offer}
          memberId={selectedBooking.memberData?.id}
          allowedItemIds={[
            BookingActionItemId.SELL_ITEMS,
            BookingActionItemId.SEND_MESSAGE,
            BookingActionItemId.RESOLVE_UNPAID_INVOICES,
          ]}
        />
      </div>
      <div className="flex items-center gap-lg justify-between">
        <Body size="md" weight="weak" color="weak">
          {t("participantDetails.memberSince", {
            memberSince: formatDateTimeFromDate(
              fromIsoString(selectedBooking.memberData?.date_joined ?? ""),
              DATETIME_FORMATS.DAY_MONTH_YEAR,
              { locale },
            ),
          })}
        </Body>
        {selectedBooking?.first_in_company && (
          <Chip
            size="lg"
            color="default"
            type="weak"
            label={t("bookingsTable.chips.new")}
          />
        )}
      </div>
      <Section>
        <div className="flex gap-xs items-center">
          <Body color="default">{selectedBooking.memberData?.email}</Body>
          <Button
            kind="icon-button"
            icon="copy-07"
            label={t("actions.copyClientEmail")}
            intent="flat"
            size="md"
            color="default"
            onClick={() => {
              if (selectedBooking.memberData?.email) {
                copyToClipboard(selectedBooking.memberData?.email);
              }
            }}
          />
        </div>
        {selectedBooking.memberData?.phone && (
          <div className="flex gap-xs items-center">
            <Body color="default">{selectedBooking.memberData?.phone}</Body>
            <Button
              kind="icon-button"
              icon="copy-07"
              label={t("actions.copyClientPhone")}
              intent="flat"
              size="md"
              color="default"
              onClick={() => {
                if (selectedBooking.memberData?.phone) {
                  copyToClipboard(selectedBooking.memberData?.phone);
                }
              }}
            />
          </div>
        )}
      </Section>
    </div>
  );
};
