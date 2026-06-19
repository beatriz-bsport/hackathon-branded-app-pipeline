import { useQueryClient } from "@tanstack/react-query";
import React, { useCallback } from "react";

import { Item, useCopyToClipboard } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { ActionsMenuButton } from "#src/components/common/action-menu-button";
import { useRetrieveSession } from "#src/hooks/session-api/fetch/use-retrieve-session";
import { useRetrieveSessionDetails } from "#src/hooks/session-api/fetch/use-retrieve-session-details";
import { SessionManagementModalType } from "#src/hooks/use-session-management-modals";
import { useTranslation } from "#src/utils/i18n";
import { useObjectLevelPermission } from "#src/utils/permission";

export const MoreActionsButton: React.FC<{
  sessionId: number;
  openModal: (type: SessionManagementModalType) => void;
  isMobile?: boolean;
}> = ({ openModal, sessionId, isMobile }) => {
  const { t } = useTranslation(["sessionList", "sessionManagement"]);

  const queryClient = useQueryClient();

  const { data: session } = useRetrieveSession(sessionId);

  const { teacher, activity, establishment } =
    useRetrieveSessionDetails(session);

  const { copyToClipboard } = useCopyToClipboard();
  const companyId = dataAccessLayer.useCompanyTheme()?.company;
  const isWorkshop = activity.is_workshop;

  const hasCancelPermission = useObjectLevelPermission(
    isWorkshop
      ? "session.workshop.allowed_actions.delete"
      : "session.activity.allowed_actions.delete",
  );

  const hasCreatePermission = useObjectLevelPermission(
    isWorkshop
      ? "session.workshop.allowed_actions.create"
      : "session.activity.allowed_actions.create",
  );

  const hasAddToWaitlistPermission = useObjectLevelPermission(
    isWorkshop
      ? "reservation.workshop.allowed_actions.addToWaitlist"
      : "reservation.activity.allowed_actions.addToWaitlist",
  );

  const hasCreateBookingPermission = useObjectLevelPermission(
    isWorkshop
      ? "reservation.workshop.allowed_actions.create"
      : "reservation.activity.allowed_actions.create",
  );

  const canSessionBeDuplicated =
    !session.group &&
    !establishment.disabled &&
    !teacher.disabled &&
    activity.customer_enabled;

  const getMenuItems = useCallback(
    (
      setIsPopoverOpened: React.Dispatch<React.SetStateAction<boolean>>,
    ): Item[] => {
      const mobileCtaItem: Item | null =
        hasCreateBookingPermission && session.available
          ? {
              id: "book-action",
              label: session.full
                ? t("bookAndOverride", {
                    ns: "sessionManagement",
                  })
                : t("bookButton", { ns: "sessionManagement" }),
              iconLeft: "plus",
              type: "button",
              onClick: () => {
                setIsPopoverOpened(false);
                openModal(SessionManagementModalType.BOOK);
              },
            }
          : !session.available && !session.group
            ? {
                id: "restore-action",
                label: t("table.shortcutActions.restore", {
                  ns: "sessionManagement",
                }),
                iconLeft: "unarchive",
                type: "button",
                onClick: () => {
                  openModal(SessionManagementModalType.RESTORE);
                  setIsPopoverOpened(false);
                },
              }
            : null;

      const mobileAddToWaitlistItem: Item | null =
        hasAddToWaitlistPermission &&
        session.available &&
        session.full &&
        !session.group
          ? {
              id: "add-to-waitlist-action",
              label: t("addToWaitlist", {
                ns: "sessionManagement",
              }),
              iconLeft: "user-plus-01",
              type: "button",
              onClick: () => {
                setIsPopoverOpened(false);
                openModal(SessionManagementModalType.ADD_TO_WAITLIST);
              },
            }
          : null;

      const mobileSendCommunicationItem: Item | null = {
        id: "send-communication-action",
        label: t("actions.sendMessage", { ns: "sessionManagement" }),
        iconLeft: "send-01",
        type: "button",
        onClick: () => {
          setIsPopoverOpened(false);
        },
      };

      const mobileRefreshItem: Item = {
        id: "refresh-action",
        label: t("refresh", { ns: "sessionManagement" }),
        iconLeft: "refresh-cw-01",
        type: "button",
        onClick: () => {
          queryClient.invalidateQueries();
          setIsPopoverOpened(false);
        },
      };

      const mobileItems: Item[] = [
        mobileCtaItem,
        mobileAddToWaitlistItem,
        mobileRefreshItem,
        mobileSendCommunicationItem,
      ].filter((item) => item !== null);

      const duplicateAction: Item = {
        id: "duplicate-action",
        label: t("table.shortcutActions.duplicate", { ns: "sessionList" }),
        iconLeft: "copy-03",
        type: "button",
        onClick: () => {
          openModal(SessionManagementModalType.DUPLICATE);
          setIsPopoverOpened(false);
        },
      };
      const copyLinkAction: Item = {
        id: "copy-link-action",
        label: t("table.shortcutActions.copyLink", { ns: "sessionList" }),
        iconLeft: "link-01",
        type: "button",
        disabled: !companyId,
        onClick: () => {
          if (companyId) {
            copyToClipboard(
              `${window.location.origin}/customer/payment/offer/${session.id}?membership=${companyId}`,
            );
          }
          setIsPopoverOpened(false);
        },
      };

      const cancelAction: Item = {
        id: "cancel-shortcut",
        label: t("table.shortcutActions.cancel", { ns: "sessionList" }),
        iconLeft: "calendar-minus-02",
        type: "button",
        onClick: () => {
          openModal(SessionManagementModalType.CANCEL);
          setIsPopoverOpened(false);
        },
      };

      const deleteAction: Item = {
        id: "delete-shortcut",
        label: t("table.shortcutActions.delete", { ns: "sessionList" }),
        iconLeft: "trash-01",
        type: "button",
        onClick: () => {
          openModal(SessionManagementModalType.DELETE);
          setIsPopoverOpened(false);
        },
      };

      const availableActions = [
        ...(hasCreatePermission && canSessionBeDuplicated
          ? [duplicateAction]
          : []),
        ...(companyId ? [copyLinkAction] : []),
        ...(hasCancelPermission ? [cancelAction] : []),
      ];

      const unavailableActions = [
        ...(hasCreatePermission && canSessionBeDuplicated
          ? [duplicateAction]
          : []),
        ...(hasCancelPermission ? [deleteAction] : []),
      ];

      const sessionItems = session.available
        ? availableActions
        : unavailableActions;
      return [...(isMobile ? mobileItems : []), ...sessionItems];
    },
    [
      t,
      session,
      copyToClipboard,
      openModal,
      companyId,
      hasCancelPermission,
      hasCreatePermission,
      canSessionBeDuplicated,
      isMobile,
      queryClient,
      hasAddToWaitlistPermission,
      hasCreateBookingPermission,
    ],
  );

  const showMenu = session.available
    ? (hasCreatePermission && canSessionBeDuplicated) ||
      !!companyId ||
      hasCancelPermission
    : (hasCreatePermission && canSessionBeDuplicated) || hasCancelPermission;

  if (!showMenu) {
    return <div className="w-xl" />; // to keep button column width consistent
  }

  return (
    <ActionsMenuButton
      label={t("table.shortcutActions.label", { ns: "sessionList" })}
      items={getMenuItems}
      prominent
    />
  );
};
