import { FC, useCallback } from "react";
import { useNavigate } from "react-router";

import { openCheckoutFlow } from "@bsport/kaizen-business-components/core/checkout-flow-modal";
import { Item, useCopyToClipboard } from "@bsport/kaizen-primitive-core";

import { ActionsMenuButton } from "#src/components/common/action-menu-button";
import { useRetrieveSession } from "#src/hooks/session-api/fetch/use-retrieve-session";
import { useRetrieveSessionDetails } from "#src/hooks/session-api/fetch/use-retrieve-session-details";
import { SessionManagementModalType } from "#src/hooks/use-session-management-modals.js";
import { useTranslation } from "#src/utils/i18n";
import { useObjectLevelPermission } from "#src/utils/permission";

import { type ActionItemId, BookingActionItemId } from "./types";

export const ShortcutActionsButton: FC<{
  sessionId: number;
  bookingId: number;
  memberId?: number;
  openModal: (type: SessionManagementModalType, bookingId: number) => void;
  allowedItemIds?: ActionItemId[];
  participantEmail?: string;
  participantPhone?: string;
}> = ({
  sessionId,
  bookingId,
  memberId,
  openModal,
  allowedItemIds,
  participantEmail,
  participantPhone,
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

  const hasReadInvoicePermission = useObjectLevelPermission(
    "billing.allowed_actions.readInvoices",
  );

  const hasCancelBookingPermission = useObjectLevelPermission(
    isWorkshop
      ? "reservation.workshop.allowed_actions.delete"
      : "reservation.activity.allowed_actions.delete",
  );

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
          // TODO: implement swap spot action
          setIsPopoverOpened(false);
        },
      };

      const swapPassAction: Item = {
        id: BookingActionItemId.SWAP_PASS,
        label: t("actions.swapPass"),
        iconLeft: "switch-horizontal-01",
        type: "button",
        onClick: () => {
          // TODO: implement swap pass action
          setIsPopoverOpened(false);
        },
      };

      const cancelBookingAction: Item = {
        id: BookingActionItemId.CANCEL_BOOKING,
        label: t("actions.cancelBooking"),
        iconLeft: "user-x-01",
        type: "button",
        onClick: () => {
          openModal(SessionManagementModalType.CANCEL_BOOKING, bookingId);
          setIsPopoverOpened(false);
        },
      };

      const sellItemsAction: Item = {
        id: BookingActionItemId.SELL_ITEMS,
        label: t("actions.sellItems"),
        iconLeft: "shopping-cart-01",
        type: "button",
        onClick: () => {
          openCheckoutFlow({
            basketStartTrigger: "member_profile_page",
            memberId,
            navigate: (url) => navigate(url),
          });
          setIsPopoverOpened(false);
        },
      };

      const resolveUnpaidInvoicesAction: Item = {
        id: BookingActionItemId.RESOLVE_UNPAID_INVOICES,
        label: t("actions.resolveUnpaidInvoices"),
        iconLeft: "file-attachment-02",
        type: "button",
        onClick: () => {
          // TODO: implement resolve unpaid invoices action
          setIsPopoverOpened(false);
        },
      };

      const sendMessageAction: Item = {
        id: BookingActionItemId.SEND_MESSAGE,
        label: t("actions.sendMessage"),
        iconLeft: "send-01",
        type: "button",
        onClick: () => {
          // TODO: implement send message action
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

      const allItems: Item[] = [
        sectionTitle(t("booking")),
        ...(hasCreateBookingPermission ? [swapSpotAction] : []),
        ...(hasChangeSpotPermission ? [swapPassAction] : []),
        ...(hasCancelBookingPermission ? [cancelBookingAction] : []),
        divider,
        sectionTitle(t("billing")),
        ...(hasCreateInvoicePermission ? [sellItemsAction] : []),
        ...(hasReadInvoicePermission ? [resolveUnpaidInvoicesAction] : []),
        divider,
        sectionTitle(t("contact")),
        sendMessageAction,
        ...(participantEmail?.length ? [copyEmailAction] : []),
        ...(participantPhone?.length ? [copyPhoneAction] : []),
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
      hasReadInvoicePermission,
      participantEmail,
      participantPhone,
      copyToClipboard,
      bookingId,
      openModal,
      navigate,
      memberId,
    ],
  );

  return <ActionsMenuButton label={t("actions.label")} items={getMenuItems} />;
};
