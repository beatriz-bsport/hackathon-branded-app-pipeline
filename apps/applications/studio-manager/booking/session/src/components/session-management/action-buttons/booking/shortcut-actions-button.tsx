import { FC, useCallback } from "react";
import { useNavigate } from "react-router";

import { fromIsoString, getLocalNow } from "@bsport/datetime-manipulation";
import { openFullPaymentFlow } from "@bsport/kaizen-business-components/financial-services/checkout-payment-flow-modal";
import { Item, useCopyToClipboard } from "@bsport/kaizen-primitive-core";

import { ActionsMenuButton } from "#src/components/common/action-menu-button";
import { useAssignSpotAction } from "#src/hooks/booking/actions/use-assign-spot-action";
import { useRetrieveSession } from "#src/hooks/session-api/fetch/use-retrieve-session";
import { useRetrieveSessionDetails } from "#src/hooks/session-api/fetch/use-retrieve-session-details";
import {
  type SessionManagementModalParams,
  SessionManagementModalType,
} from "#src/hooks/use-session-management-modals";
import { LEGACY_URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";
import { useObjectLevelPermission } from "#src/utils/permission";

import { type ActionItemId, BookingActionItemId } from "./types";

export const ShortcutActionsButton: FC<{
  sessionId: number;
  bookingId?: number;
  bookingOptionId?: number;
  memberId?: number;
  consumerPaymentPackId?: number | null;
  openModal?: (
    type: SessionManagementModalType,
    params?: SessionManagementModalParams,
  ) => void;
  allowedItemIds?: ActionItemId[];
  participantEmail?: string;
  participantPhone?: string;
  currentSpot?: number | null;
}> = ({
  sessionId,
  bookingId,
  bookingOptionId,
  memberId,
  consumerPaymentPackId,
  openModal,
  allowedItemIds,
  participantEmail,
  participantPhone,
  currentSpot,
}) => {
  const { t } = useTranslation("sessionManagement");

  const { data: session } = useRetrieveSession(sessionId);

  const navigate = useNavigate();

  const { activity } = useRetrieveSessionDetails(session);

  const { copyToClipboard } = useCopyToClipboard();

  const isWorkshop = activity.is_workshop;

  const hasCreateBookingPermission = useObjectLevelPermission(
    isWorkshop
      ? "reservation.workshop.allowed_actions.create"
      : "reservation.activity.allowed_actions.create",
  );

  const hasChangeSpotPermission = useObjectLevelPermission(
    isWorkshop
      ? "reservation.workshop.allowed_actions.editSpot"
      : "reservation.activity.allowed_actions.editSpot",
  );

  const hasCreateInvoicePermission = useObjectLevelPermission(
    "billing.allowed_actions.createInvoice",
  );

  const hasCancelBookingPermission = useObjectLevelPermission(
    isWorkshop
      ? "reservation.workshop.allowed_actions.delete"
      : "reservation.activity.allowed_actions.delete",
  );

  const hasSeeProfileDetailsPermission = useObjectLevelPermission(
    "member.allowed_actions.accessProfile",
  );

  const hasSessionStarted = (() => {
    const startDateTime = fromIsoString(session.date_start, {
      zone: session.timezone_name,
    });
    const now = getLocalNow({ zone: session.timezone_name });
    return now >= startDateTime;
  })();

  const { openModal: openAssignSpotModal, modalElement: assignSpotModal } =
    useAssignSpotAction({ bookingId: bookingId ?? 0, sessionId, currentSpot });

  const getMenuItems = useCallback(
    (
      setIsPopoverOpened: React.Dispatch<React.SetStateAction<boolean>>,
    ): Item[] => {
      const sectionTitle: (title: string) => Item = (title) => ({
        id: `section-${title}`,
        label: title,
        type: "title",
      });

      const divider: Item = { type: "divider" };

      const swapSpotAction: Item = {
        id: BookingActionItemId.SWAP_SPOT,
        label: t("actions.swapSpot"),
        iconLeft: "switch-horizontal-01",
        type: "button",
        onClick: () => {
          openAssignSpotModal();
          setIsPopoverOpened(false);
        },
      };

      const swapPassAction: Item = {
        id: BookingActionItemId.SWAP_PASS,
        label: t("actions.swapPass"),
        iconLeft: "switch-horizontal-01",
        type: "button",
        disabled: !openModal || !bookingId || !memberId,
        onClick: () => {
          if (!openModal || !bookingId || !memberId) return;
          openModal(SessionManagementModalType.SWAP_PASS, {
            bookingId,
            memberId,
            consumerPaymentPackId,
          });
          setIsPopoverOpened(false);
        },
      };

      const cancelBookingAction: Item = {
        id: BookingActionItemId.CANCEL_BOOKING,
        label: t("actions.cancelBooking"),
        iconLeft: "user-x-01",
        type: "button",
        onClick: () => {
          if (!openModal || !bookingId) return;
          openModal(SessionManagementModalType.CANCEL_BOOKING, { bookingId });
          setIsPopoverOpened(false);
        },
      };

      const sellItemsAction: Item = {
        id: BookingActionItemId.SELL_ITEMS,
        label: t("actions.sellItems"),
        iconLeft: "shopping-cart-01",
        type: "button",
        onClick: () => {
          openFullPaymentFlow({
            basketStartTrigger: "session_management_page",
            memberId,
            navigate: (url) => navigate(url),
          });
          setIsPopoverOpened(false);
        },
      };

      const copyEmailAction: Item = {
        id: BookingActionItemId.COPY_EMAIL,
        label: participantEmail ?? "",
        iconLeft: "copy-07",
        type: "button",
        onClick: () => {
          if (participantEmail) {
            copyToClipboard(participantEmail);
          }
        },
      };

      const copyPhoneAction: Item = {
        id: BookingActionItemId.COPY_PHONE,
        label: participantPhone ?? "",
        iconLeft: "copy-07",
        type: "button",
        onClick: () => {
          if (participantPhone) {
            copyToClipboard(participantPhone);
          }
        },
      };

      const updateMemberNotesAction: Item = {
        id: BookingActionItemId.UPDATE_MEMBER_NOTES,
        label: t("actions.editClientNotes"),
        iconLeft: "edit-05",
        type: "button",
        onClick: () => {
          if (!memberId) return;
          window.location.assign(LEGACY_URLS.MEMBER_NOTES(memberId));
        },
      };

      const bookOptionAction: Item = {
        id: BookingActionItemId.BOOK_OPTION,
        label: t("actions.bookToClass"),
        iconLeft: "plus",
        type: "button",
        disabled:
          hasSessionStarted || !openModal || !bookingOptionId || !memberId,
        onClick: () => {
          if (!openModal || !bookingOptionId || !memberId) return;
          openModal(SessionManagementModalType.BOOK, {
            bookingOptionId,
            memberId,
          });
          setIsPopoverOpened(false);
        },
      };

      const removeFromWaitlistAction: Item = {
        id: BookingActionItemId.REMOVE_FROM_WAITLIST,
        label: t("actions.removeFromWaitlist"),
        iconLeft: "trash-01",
        type: "button",
        disabled: hasSessionStarted || !openModal,
        onClick: () => {
          if (!openModal || !bookingOptionId) return;
          openModal(SessionManagementModalType.DISCARD_BOOKING_OPTION, {
            bookingOptionId,
          });
          setIsPopoverOpened(false);
        },
      };

      const allItems: Item[] = [
        sectionTitle(t("booking")),
        ...(hasChangeSpotPermission && session.room_blueprint && bookingId
          ? [swapSpotAction]
          : []),
        ...(hasChangeSpotPermission && bookingId ? [swapPassAction] : []),
        ...(hasCancelBookingPermission && openModal && bookingId
          ? [cancelBookingAction]
          : []),
        divider,
        sectionTitle(t("billing")),
        ...(hasCreateInvoicePermission ? [sellItemsAction] : []),
        divider,
        sectionTitle(t("contact")),
        ...(hasSeeProfileDetailsPermission && memberId
          ? [updateMemberNotesAction]
          : []),
        ...(participantEmail?.length ? [copyEmailAction] : []),
        ...(participantPhone?.length ? [copyPhoneAction] : []),
        ...(hasCreateBookingPermission && bookingOptionId
          ? [bookOptionAction]
          : []),
        ...(bookingOptionId && openModal ? [removeFromWaitlistAction] : []),
      ];

      if (!allowedItemIds) return allItems;

      return allItems.filter(
        (item) =>
          item.type === "button" &&
          allowedItemIds.includes(item.id as ActionItemId),
      );
    },
    [
      t,
      allowedItemIds,
      hasCreateBookingPermission,
      hasChangeSpotPermission,
      hasCancelBookingPermission,
      hasCreateInvoicePermission,
      participantEmail,
      participantPhone,
      copyToClipboard,
      bookingId,
      consumerPaymentPackId,
      openModal,
      openAssignSpotModal,
      navigate,
      memberId,
      session,
      hasSeeProfileDetailsPermission,
      bookingOptionId,
      hasSessionStarted,
    ],
  );

  return (
    <>
      <ActionsMenuButton label={t("actions.label")} items={getMenuItems} />
      {assignSpotModal}
    </>
  );
};
