import React, { useCallback } from "react";

import { Button, Item, Menu, Popover } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";
import { useObjectLevelPermission } from "#src/utils/permission";

type MoreActionsButtonProps = {
  onParticipantsExport: () => void;
  onCancelMultipleSessions: () => void;
};
export const MoreActionsButton: React.FC<MoreActionsButtonProps> = ({
  onParticipantsExport,
  onCancelMultipleSessions,
}) => {
  const { t } = useTranslation("sessionList");
  const hasCancelMultipleSessionsPermission = useObjectLevelPermission(
    "planning.calendar.allowed_actions.bulkCancellation",
  );
  const hasCancelActivitySessionsPermission = useObjectLevelPermission(
    "session.activity.allowed_actions.delete",
  );
  const hasCancelWorkshopSessionsPermission = useObjectLevelPermission(
    "session.workshop.allowed_actions.delete",
  );

  const hasExportParticipantsPermission = useObjectLevelPermission(
    "export.allowed_actions.planning",
  );

  const canCancelMultipleSessions =
    hasCancelMultipleSessionsPermission &&
    (hasCancelActivitySessionsPermission ||
      hasCancelWorkshopSessionsPermission);

  const getMenuItems = useCallback(
    (
      setIsPopoverOpened: React.Dispatch<React.SetStateAction<boolean>>,
    ): Item[] => {
      const exportParticipantsAction: Item = {
        id: "export-participants",
        label: t("moreActions.exportParticipants"),
        iconLeft: "upload-01",
        type: "button",
        onClick: () => {
          onParticipantsExport();
          setIsPopoverOpened(false);
        },
      };
      const cancelMultipleSessionsAction: Item = {
        id: "cancel-multiple-sessions",
        label: t("moreActions.cancelMultipleSessions"),
        iconLeft: "x-circle-solid",
        type: "button",
        onClick: () => {
          onCancelMultipleSessions();
          setIsPopoverOpened(false);
        },
      };
      return [
        ...(hasExportParticipantsPermission ? [exportParticipantsAction] : []),
        ...(canCancelMultipleSessions ? [cancelMultipleSessionsAction] : []),
      ];
    },
    [
      t,
      onParticipantsExport,
      onCancelMultipleSessions,
      canCancelMultipleSessions,
      hasExportParticipantsPermission,
    ],
  );

  return (
    (hasExportParticipantsPermission || canCancelMultipleSessions) && (
      <Popover>
        <Popover.Anchor>
          {({ setIsPopoverOpened }) => (
            <Button
              kind="icon-button"
              icon="dots-vertical"
              onClick={() => setIsPopoverOpened(true)}
              size="md"
              intent="default"
              color="main"
              label={t("moreActions.label")}
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
    )
  );
};
