import { FC } from "react";

import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import {
  Avatar,
  Body,
  DetailDrawer,
  Divider,
  Title,
} from "@bsport/kaizen-primitive-core";

import { Loader } from "#src/components/query-boundary/fallbacks";
import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { ShortcutActionsButton } from "#src/components/session-management/action-buttons/booking/shortcut-actions-button";
import { BookingActionItemId } from "#src/components/session-management/action-buttons/booking/types";
import { useRetrieveRefinedBookingOption } from "#src/hooks/waitlist/use-retrieve-refined-booking-option";
import { LEGACY_URLS } from "#src/urls";
import { getMemberInitials } from "#src/utils/get-member-initials";
import { useTranslation } from "#src/utils/i18n.js";
import { useObjectLevelPermission } from "#src/utils/permission";

import { ClientDetails } from "./client-details";

export const BookingOptionDetailDrawer: FC<{
  selectedBookingOptionId: number | null;
  onClose: () => void;
}> = ({ selectedBookingOptionId, onClose }) => {
  return (
    <DetailDrawer
      id="booking-option-detail-drawer"
      // Default z-index of the drawer is 1000, we need to set it to 999 to be below the modals that have a z-index of 1000
      className="z-[999] max-w-component-modal-max-sm"
      isOpen={selectedBookingOptionId != null}
      onClose={onClose}
    >
      {selectedBookingOptionId != null && (
        <QueryBoundary>
          <BookingOptionDetailDrawerContent
            bookingOptionId={selectedBookingOptionId}
          />
        </QueryBoundary>
      )}
    </DetailDrawer>
  );
};

const BookingOptionDetailDrawerContent: FC<{
  bookingOptionId: number;
}> = ({ bookingOptionId }) => {
  const { t, i18n } = useTranslation("sessionManagement");
  const locale = i18n.language;

  const { refinedBookingOption, isLoading } =
    useRetrieveRefinedBookingOption(bookingOptionId);

  const hasSeeProfileDetailsPermission = useObjectLevelPermission(
    "member.allowed_actions.accessProfile",
  );

  if (isLoading) {
    return <Loader />;
  }

  if (!refinedBookingOption) {
    return null;
  }

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex items-center gap-lg justify-between">
        <div className="flex items-center gap-xs">
          <Avatar
            shape="round"
            size="md"
            src={refinedBookingOption.memberData?.photo}
            initials={getMemberInitials({
              firstname: refinedBookingOption.memberData?.first_name,
              lastname: refinedBookingOption.memberData?.last_name,
            })}
          />
          {refinedBookingOption.memberData?.id != null &&
          hasSeeProfileDetailsPermission ? (
            <a
              href={LEGACY_URLS.MEMBER_DETAILS(
                refinedBookingOption.memberData?.id,
              )}
            >
              <Title htmlVariant="h2" weight="strong">
                {refinedBookingOption.memberData?.name ?? ""}
              </Title>
            </a>
          ) : (
            <Title htmlVariant="h2" weight="strong">
              {refinedBookingOption.memberData?.name ?? ""}
            </Title>
          )}
        </div>
        <ShortcutActionsButton
          bookingOptionId={refinedBookingOption.id}
          sessionId={refinedBookingOption.offer.id}
          allowedItemIds={[
            BookingActionItemId.BOOK_OPTION,
            BookingActionItemId.REMOVE_FROM_WAITLIST,
          ]}
        />
      </div>
      <Body size="md" weight="weak" color="weak">
        {t("participantDetails.addedToWaitlistOn", {
          bookingOptionDate: formatDateTime(
            refinedBookingOption.date,
            DATETIME_FORMATS.SHORT_DATE,
            { locale },
          ),
        })}
      </Body>
      <Divider orientation="horizontal" weight="extra-thin" />
      <ClientDetails
        sessionId={refinedBookingOption.offer.id}
        memberData={refinedBookingOption.memberData}
      />
    </div>
  );
};
