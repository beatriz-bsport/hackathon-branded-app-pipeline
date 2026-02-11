import React, { useCallback, useMemo } from "react";
import { useNavigate } from "react-router";

import {
  Button,
  Item,
  Menu,
  Popover,
  useCopyToClipboard,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { SessionVisibilityType } from "#src/events/constants";
import {
  sessionListCancelButtonClickedEvent,
  sessionListCopyLinkButtonClickedEvent,
  sessionListDeleteButtonClickedEvent,
  sessionListDuplicateButtonClickedEvent,
  sessionListEditButtonClickedEvent,
  sessionListRestoreButtonClickedEvent,
} from "#src/events/session-list/events";
import {
  openCancelModal,
  openDeleteModal,
  openDuplicateModal,
  openRestoreModal,
} from "#src/stores/session-list";
import type { EnrichedSession } from "#src/types";
import { getDetailsUrl } from "#src/urls";
import { analyticsTrackSafeEvent } from "#src/utils/analytics-track-safe-event";
import { useTranslation } from "#src/utils/i18n";
import { useObjectLevelPermission } from "#src/utils/permission";

type ShortcutActionsButtonProps = {
  session: EnrichedSession;
};

export const ShortcutActionsButton: React.FC<ShortcutActionsButtonProps> = ({
  session,
}) => {
  const { t } = useTranslation("sessionList");
  const navigate = useNavigate();

  const trackingProperties = useMemo(
    () => ({
      session_id: session.id,
      session_name: session.name,
      session_start_date_time: session.date_start,
      participant_number: session.nb_bookings,
      teacher_name: session.teacherName!,
      teacher_id: session.coach_override ?? session.coach,
      session_type: session.is_workshop ? "workshop" : "group_activity",
      session_is_online: session.is_broadcast,
      session_available: session.available,
      session_duration: session.duration_minute,
      session_visibility: (session.manager_only
        ? "unlisted"
        : "listed") as SessionVisibilityType,
    }),
    [session],
  );

  const { copyToClipboard } = useCopyToClipboard();
  const companyId = dataAccessLayer.useCompanyTheme()?.company;
  const isWorkshop = session.is_workshop;

  const hasEditPermission = useObjectLevelPermission(
    isWorkshop
      ? "session.workshop.allowed_actions.edit"
      : "session.activity.allowed_actions.edit",
  );

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

  const getMenuItems = useCallback(
    (
      setIsPopoverOpened: React.Dispatch<React.SetStateAction<boolean>>,
    ): Item[] => {
      const editShortcutAction: Item = {
        id: "edit-shortcut",
        label: t("table.shortcutActions.edit"),
        iconLeft: "edit-02",
        type: "button",
        onClick: () => {
          analyticsTrackSafeEvent(
            sessionListEditButtonClickedEvent,
            trackingProperties,
          );
          navigate(getDetailsUrl(session.id));
          setIsPopoverOpened(false);
        },
      };

      const canSessionBeDuplicated =
        !session.group &&
        !session.isEstablishmentArchived &&
        !session.isTeacherArchived &&
        !session.isMetaActivityArchived;

      const duplicateShortcutAction: Item = {
        id: "duplicate-shortcut",
        label: t("table.shortcutActions.duplicate"),
        iconLeft: "copy-03",
        type: "button",
        onClick: () => {
          analyticsTrackSafeEvent(
            sessionListDuplicateButtonClickedEvent,
            trackingProperties,
          );
          setIsPopoverOpened(false);
          openDuplicateModal(session);
        },
      };
      const copyLinkShortcutAction: Item = {
        id: "copy-link-shortcut",
        label: t("table.shortcutActions.copyLink"),
        iconLeft: "link-01",
        type: "button",
        disabled: !companyId,
        onClick: () => {
          analyticsTrackSafeEvent(
            sessionListCopyLinkButtonClickedEvent,
            trackingProperties,
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
          analyticsTrackSafeEvent(
            sessionListCancelButtonClickedEvent,
            trackingProperties,
          );
          setIsPopoverOpened(false);
          openCancelModal(session);
        },
      };
      const restoreShortcutAction: Item = {
        id: "restore-shortcut",
        label: t("table.shortcutActions.restore"),
        iconLeft: "unarchive",
        type: "button",
        onClick: () => {
          analyticsTrackSafeEvent(
            sessionListRestoreButtonClickedEvent,
            trackingProperties,
          );
          setIsPopoverOpened(false);
          openRestoreModal(session);
        },
      };
      const deleteShortcutAction: Item = {
        id: "delete-shortcut",
        label: t("table.shortcutActions.delete"),
        iconLeft: "trash-01",
        type: "button",
        onClick: () => {
          analyticsTrackSafeEvent(
            sessionListDeleteButtonClickedEvent,
            trackingProperties,
          );
          setIsPopoverOpened(false);
          openDeleteModal(session);
        },
      };

      const availableActions = [
        ...(hasEditPermission ? [editShortcutAction] : []),
        ...(hasCreatePermission && canSessionBeDuplicated
          ? [duplicateShortcutAction]
          : []),
        ...(companyId ? [copyLinkShortcutAction] : []),
        ...(hasCancelPermission ? [cancelShortcutAction] : []),
      ];

      const unavailableActions = [
        ...(hasEditPermission ? [restoreShortcutAction] : []),
        ...(hasEditPermission ? [editShortcutAction] : []),
        ...(hasCreatePermission && canSessionBeDuplicated
          ? [duplicateShortcutAction]
          : []),
        ...(hasCancelPermission ? [deleteShortcutAction] : []),
      ];

      return session.available ? availableActions : unavailableActions;
    },
    [
      t,
      session,
      copyToClipboard,
      companyId,
      hasEditPermission,
      hasCancelPermission,
      hasCreatePermission,
      navigate,
      trackingProperties,
    ],
  );

  const hasAnyPermission =
    hasEditPermission || hasCreatePermission || hasCancelPermission;
  const showMenu = session.available
    ? !!companyId || hasAnyPermission
    : hasAnyPermission;

  if (!showMenu) {
    return <div className="w-xl" />; // to keep button column width consistent
  }

  return (
    <Popover>
      <Popover.Anchor>
        {({ setIsPopoverOpened }) => (
          <Button
            kind="icon-button"
            icon="dots-vertical"
            onClick={(event) => {
              event.stopPropagation(); // Prevent triggering row click
              setIsPopoverOpened(true);
            }}
            size="md"
            intent="flat"
            color="default"
            label={t("table.shortcutActions.label")}
          />
        )}
      </Popover.Anchor>
      <Popover.Content placement="bottom-right">
        {({ setIsPopoverOpened }) => (
          <div className="flex flex-col gap-sm">
            <Menu items={getMenuItems(setIsPopoverOpened)} />
          </div>
        )}
      </Popover.Content>
    </Popover>
  );
};
