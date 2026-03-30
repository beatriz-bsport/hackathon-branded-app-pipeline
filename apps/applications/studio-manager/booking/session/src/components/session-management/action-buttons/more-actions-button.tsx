import React, { useCallback } from "react";

import { Item, useCopyToClipboard } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { ActionsMenuButton } from "#src/components/common/action-menu-button";
import { useRetrieveSession } from "#src/hooks/session-api/fetch/use-retrieve-session";
import { useRetrieveSessionDetails } from "#src/hooks/session-api/fetch/use-retrieve-session-details";
import { useTranslation } from "#src/utils/i18n";
import { useObjectLevelPermission } from "#src/utils/permission";

export const MoreActionsButton: React.FC<{
  sessionId: number;
}> = ({ sessionId }) => {
  const { t } = useTranslation("sessionList");

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

  const canSessionBeDuplicated =
    !session.group &&
    !establishment.disabled &&
    !teacher.disabled &&
    activity.customer_enabled;

  const getMenuItems = useCallback(
    (
      setIsPopoverOpened: React.Dispatch<React.SetStateAction<boolean>>,
    ): Item[] => {
      const duplicateAction: Item = {
        id: "duplicate-action",
        label: t("table.shortcutActions.duplicate"),
        iconLeft: "copy-03",
        type: "button",
        onClick: () => {
          setIsPopoverOpened(false);
        },
      };
      const copyLinkAction: Item = {
        id: "copy-link-action",
        label: t("table.shortcutActions.copyLink"),
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
        label: t("table.shortcutActions.cancel"),
        iconLeft: "calendar-minus-02",
        type: "button",
        onClick: () => {
          setIsPopoverOpened(false);
        },
      };

      const deleteAction: Item = {
        id: "delete-shortcut",
        label: t("table.shortcutActions.delete"),
        iconLeft: "trash-01",
        type: "button",
        onClick: () => {
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

      return session.available ? availableActions : unavailableActions;
    },
    [
      t,
      session,
      copyToClipboard,
      companyId,
      hasCancelPermission,
      hasCreatePermission,
      canSessionBeDuplicated,
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
      label={t("table.shortcutActions.label")}
      items={getMenuItems}
    />
  );
};
