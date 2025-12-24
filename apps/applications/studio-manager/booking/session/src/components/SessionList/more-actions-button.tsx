import React, { useCallback } from "react";

import { Button, Item, Menu, Popover } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export const MoreActionsButton: React.FC = () => {
  const { t } = useTranslation("sessionList");

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
          console.log("Export Participants clicked");
          setIsPopoverOpened(false);
        },
      };
      const cancelMultipleSessionsAction: Item = {
        id: "cancel-multiple-sessions",
        label: t("moreActions.cancelMultipleSessions"),
        iconLeft: "x-circle-solid",
        type: "button",
        onClick: () => {
          console.log("Cancel Multiple Sessions clicked");
          setIsPopoverOpened(false);
        },
      };
      return [exportParticipantsAction, cancelMultipleSessionsAction];
    },
    [t],
  );

  return (
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
  );
};
