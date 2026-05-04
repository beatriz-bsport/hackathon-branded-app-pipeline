import React, { useCallback, useMemo } from "react";

import type { SessionWithActivity } from "@bsport/api-book";
import { Item, useCopyToClipboard } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { ActionsMenuButton } from "#src/components/common/action-menu-button";
import { SessionVisibilityType } from "#src/events/constants";
import {
  sessionUpdateCancelButtonClickedEvent,
  sessionUpdateCopyLinkButtonClickedEvent,
  sessionUpdateDuplicateButtonClickedEvent,
  sessionUpdateRestoreButtonClickedEvent,
} from "#src/events/session-edition/events";
import { useFetchTeacher } from "#src/hooks/use-fetch-teachers";
import { analyticsClient } from "#src/utils/analytics";
import { useTranslation } from "#src/utils/i18n";
import { useObjectLevelPermission } from "#src/utils/permission";

type ShortcutActionsButtonProps = {
  session: SessionWithActivity;
  onOpenCancelSessionModal: () => void;
  onOpenDuplicateSessionModal: () => void;
  onOpenRestoreSessionModal: () => void;
};

export const ShortcutActionsButton: React.FC<ShortcutActionsButtonProps> = ({
  session,
  onOpenCancelSessionModal,
  onOpenDuplicateSessionModal,
  onOpenRestoreSessionModal,
}) => {
  const teacherId = session.coach_override ?? session.coach;

  const { data: teacher } = useFetchTeacher(teacherId);

  const trackingProperties = useMemo(() => {
    return {
      session_id: session.id,
      session_name: session.name,
      session_start_date_time: session.date_start,
      participant_number: session.nb_bookings,
      teacher_name: teacher?.name,
      teacher_id: session.coach_override ?? session.coach,
      session_type: session.is_workshop ? "workshop" : "group_activity",
      session_is_online: session.is_broadcast,
      session_available: session.available,
      session_duration: session.duration_minute,
      session_visibility: (session.manager_only
        ? "unlisted"
        : "listed") as SessionVisibilityType,
    };
  }, [session, teacher]);

  const { t } = useTranslation("sessionList");

  const { copyToClipboard } = useCopyToClipboard();
  const companyId = dataAccessLayer.useCompanyTheme()?.company;
  const isWorkshop = session.is_workshop;

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

  const hasEditPermission = useObjectLevelPermission(
    isWorkshop
      ? "session.workshop.allowed_actions.edit"
      : "session.activity.allowed_actions.edit",
  );

  const getMenuItems = useCallback(
    (
      setIsPopoverOpened: React.Dispatch<React.SetStateAction<boolean>>,
    ): Item[] => {
      const duplicateShortcutAction: Item = {
        id: "duplicate-shortcut",
        label: t("table.shortcutActions.duplicate"),
        iconLeft: "copy-03",
        type: "button",
        onClick: () => {
          analyticsClient.trackEvent(
            sessionUpdateDuplicateButtonClickedEvent(trackingProperties),
          );
          setIsPopoverOpened(false);
          onOpenDuplicateSessionModal();
        },
      };
      const copyLinkShortcutAction: Item = {
        id: "copy-link-shortcut",
        label: t("table.shortcutActions.copyLink"),
        iconLeft: "link-01",
        type: "button",
        disabled: !companyId,
        onClick: () => {
          analyticsClient.trackEvent(
            sessionUpdateCopyLinkButtonClickedEvent(trackingProperties),
          );
          if (companyId) {
            copyToClipboard(
              `${window.location.origin}/customer/payment/offer/${session.id}?membership=${companyId}`,
            );
          }
          setIsPopoverOpened(false);
        },
      };
      const cancelShortcutAction: Item = {
        id: "cancel-shortcut",
        label: t("table.shortcutActions.cancel"),
        iconLeft: "calendar-minus-02",
        type: "button",
        onClick: () => {
          analyticsClient.trackEvent(
            sessionUpdateCancelButtonClickedEvent(trackingProperties),
          );
          setIsPopoverOpened(false);
          onOpenCancelSessionModal();
        },
      };
      const restoreShortcutAction: Item = {
        id: "restore-shortcut",
        label: t("table.shortcutActions.restore"),
        iconLeft: "unarchive",
        type: "button",
        onClick: () => {
          analyticsClient.trackEvent(
            sessionUpdateRestoreButtonClickedEvent(trackingProperties),
          );
          setIsPopoverOpened(false);
          onOpenRestoreSessionModal();
        },
      };

      const availableActions = [
        ...(companyId ? [copyLinkShortcutAction] : []),
        ...(hasCreatePermission ? [duplicateShortcutAction] : []),
        ...(hasCancelPermission ? [cancelShortcutAction] : []),
      ];

      const unavailableActions = [
        ...(hasEditPermission ? [restoreShortcutAction] : []),
        ...(hasCreatePermission ? [duplicateShortcutAction] : []),
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
      onOpenCancelSessionModal,
      onOpenDuplicateSessionModal,
      onOpenRestoreSessionModal,
      hasEditPermission,
      trackingProperties,
    ],
  );

  const hasAnyPermission =
    hasCreatePermission || hasCancelPermission || hasEditPermission;

  if (!hasAnyPermission) {
    return null;
  }

  return (
    <ActionsMenuButton
      label={t("table.shortcutActions.label")}
      items={getMenuItems}
    />
  );
};
