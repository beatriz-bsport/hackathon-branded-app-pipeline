import { FC } from "react";

import {
  BookingStaffActionIdentifier,
  BookingStaffHistory,
  BookingStatusCode,
} from "@bsport/api-book";
import {
  DATETIME_FORMATS,
  formatDateTime,
  formatDateTimeFromDate,
} from "@bsport/datetime-formatting";
import { fromIsoString } from "@bsport/datetime-manipulation";
import {
  Alert,
  Avatar,
  Body,
  Chip,
  Icon,
  Title,
} from "@bsport/kaizen-primitive-core";

import { SessionManagementModalType } from "#src/hooks/use-session-management-modals";
import { useFetchUserRole } from "#src/hooks/user-role/use-fetch-user-roles";
import { RefinedBooking } from "#src/types";
import { LEGACY_URLS } from "#src/urls";
import { getMemberInitials } from "#src/utils/get-member-initials.js";
import { useTranslation } from "#src/utils/i18n";
import { useObjectLevelPermission } from "#src/utils/permission";

import { ShortcutActionsButton } from "../action-buttons/booking/shortcut-actions-button";
import { BookingActionItemId } from "../action-buttons/booking/types";
import { Section } from "./section";

const getLastCancellationStaffHistoryEntry = (
  staffHistory: BookingStaffHistory,
) => {
  if (!staffHistory) return null;

  return staffHistory
    .filter(
      (entry) =>
        entry.action_identifier ===
        BookingStaffActionIdentifier.BOOKING_CANCELLED_BY_STAFF,
    )
    .sort((a, b) => {
      return b.timestamp - a.timestamp;
    })[0];
};

export const BookingDetails: FC<{
  selectedBooking: RefinedBooking;
  openModal: (type: SessionManagementModalType, bookingId: number) => void;
}> = ({ selectedBooking, openModal }) => {
  const { t, i18n } = useTranslation("sessionManagement");
  const locale = i18n.language;

  const lastCancellationStaffHistoryEntry =
    getLastCancellationStaffHistoryEntry(selectedBooking.staff_history);

  const { data: userRole } = useFetchUserRole({
    select: (data) =>
      data.find((userRole) =>
        lastCancellationStaffHistoryEntry?.staff_id
          ? userRole.id === lastCancellationStaffHistoryEntry.staff_id
          : undefined,
      ),
  });

  const hasSeeProfileDetailsPermission = useObjectLevelPermission(
    "member.allowed_actions.accessProfile",
  );

  const getCancellationStatusText = (bookingStatusCode: BookingStatusCode) => {
    switch (bookingStatusCode) {
      case BookingStatusCode.CANCELLED_BY_CONSUMER:
        return t("bookingsTable.cancellationReason.consumer");
      case BookingStatusCode.CANCELLED_BY_MANAGER:
        return userRole
          ? t("bookingsTable.cancellationReason.manager", {
              managerName: `${userRole.first_name} ${userRole.last_name}`,
            })
          : t("bookingsTable.cancellationReason.studio");
      case BookingStatusCode.CANCELLED_BY_SESSION:
        return t("bookingsTable.cancellationReason.studio");
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col gap-sm">
      <div className="flex items-center gap-lg justify-between">
        <div className="flex items-center gap-xs">
          <Avatar
            shape="round"
            size="md"
            src={selectedBooking.memberData?.photo}
            initials={getMemberInitials({
              firstname: selectedBooking.memberData?.first_name,
              lastname: selectedBooking.memberData?.last_name,
            })}
          />
          {selectedBooking.memberData?.id != null &&
          hasSeeProfileDetailsPermission ? (
            <a
              href={LEGACY_URLS.MEMBER_DETAILS(selectedBooking.memberData?.id)}
            >
              <Title htmlVariant="h3" weight="strong">
                {selectedBooking.memberData?.name ?? ""}
              </Title>
            </a>
          ) : (
            <Title htmlVariant="h3" weight="strong">
              {selectedBooking.memberData?.name ?? ""}
            </Title>
          )}
        </div>
        {selectedBooking.booking_status_code === BookingStatusCode.OK && (
          <ShortcutActionsButton
            bookingId={selectedBooking.id}
            openModal={openModal}
            sessionId={selectedBooking.offer}
            allowedItemIds={[
              BookingActionItemId.SWAP_SPOT,
              BookingActionItemId.SWAP_PASS,
              BookingActionItemId.CANCEL_BOOKING,
            ]}
          />
        )}
      </div>

      <div className="flex items-center gap-xs">
        <Body size="md" weight="weak" color="weak">
          {t("participantDetails.bookedOn", {
            bookingDate: formatDateTime(
              selectedBooking.date,
              DATETIME_FORMATS.SHORT_DATE,
              { locale },
            ),
          })}
        </Body>
        {selectedBooking.recurrence_rule_booking && (
          <Chip
            color="default"
            type="weak"
            size="lg"
            iconLeft="refresh-ccw-01"
            label={t("bookingsTable.chips.recurring")}
          />
        )}
      </div>
      {selectedBooking.booking_status_code !== BookingStatusCode.OK && (
        <Alert status="critical">
          <Body color="critical">
            {getCancellationStatusText(selectedBooking.booking_status_code)}
          </Body>
          <Body color="critical">
            {t("bookingsTable.cancellationDate", {
              cancellationDate: formatDateTimeFromDate(
                fromIsoString(selectedBooking.date_canceled ?? ""),
                DATETIME_FORMATS.FULL_DATETIME,
                { locale },
              ),
            })}
          </Body>
        </Alert>
      )}
      {selectedBooking.spot_information?.name && (
        <Section title={t("participantDetails.spot")}>
          <Body weight="weak" color="default">
            {selectedBooking.spot_information?.name}
          </Body>
        </Section>
      )}
      {selectedBooking.passData && (
        <Section title={t("participantDetails.pass")}>
          <div className="flex flex-col">
            <div className="flex gap-xs items-center">
              <a href={LEGACY_URLS.PASS_DETAILS(selectedBooking.passData.id)}>
                <Body color="default">{selectedBooking.passData.name}</Body>
              </a>
              <Icon size="sm" icon="share-03" />
            </div>
            <Body color="default">
              {t("participantDetails.passValidity", {
                startDate: formatDateTime(
                  selectedBooking.consumerPaymentPackData?.starting_date ?? "",
                  DATETIME_FORMATS.MEDIUM_DATE,
                  { locale },
                ),
                endDate: formatDateTime(
                  selectedBooking.consumerPaymentPackData?.ending_date ?? "",
                  DATETIME_FORMATS.MEDIUM_DATE,
                  { locale },
                ),
              })}
            </Body>
            <Body color="default">
              {selectedBooking.passData?.unlimited
                ? t("participantDetails.unlimited")
                : t("participantDetails.creditsUsed", {
                    creditsUsed: selectedBooking.credit_consumed,
                    count: selectedBooking.credit_consumed,
                  }) +
                  t("participantDetails.credits", {
                    creditsLeft:
                      selectedBooking.consumerPaymentPackData
                        ?.available_credits,
                    totalCredits: selectedBooking.passData?.credits,
                    count:
                      selectedBooking.consumerPaymentPackData
                        ?.available_credits,
                  })}
            </Body>
          </div>
        </Section>
      )}
    </div>
  );
};
