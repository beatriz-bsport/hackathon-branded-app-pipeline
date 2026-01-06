import React, { useCallback } from "react";

import {
  Button,
  Item,
  Menu,
  Popover,
  useCopyToClipboard,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import type { EnrichedSession } from "#src/types";
import { useTranslation } from "#src/utils/i18n";

type ShortcutActionsProps = {
  session: EnrichedSession;
};

export const ShortcutActions: React.FC<ShortcutActionsProps> = ({
  session,
}) => {
  const { t } = useTranslation("sessionList");
  const { copyToClipboard } = useCopyToClipboard();
  const companyId = dataAccessLayer.useCompanyTheme()?.company;

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
          setIsPopoverOpened(false);
        },
      };
      const duplicateShortcutAction: Item = {
        id: "duplicate-shortcut",
        label: t("table.shortcutActions.duplicate"),
        iconLeft: "copy-03",
        type: "button",
        onClick: () => {
          setIsPopoverOpened(false);
        },
      };
      const copyLinkShortcutAction: Item = {
        id: "copy-link-shortcut",
        label: t("table.shortcutActions.copyLink"),
        iconLeft: "link-01",
        type: "button",
        onClick: () => {
          copyToClipboard(
            `${window.location.origin}/customer/payment/offer/${session.id}?membership=${companyId}`,
          );
          setIsPopoverOpened(false);
        },
      };
      const cancelShortcutAction: Item = {
        id: "cancel-shortcut",
        label: t("table.shortcutActions.cancel"),
        iconLeft: "calendar-minus-02",
        type: "button",
        onClick: () => {
          setIsPopoverOpened(false);
        },
      };
      const restoreShortcutAction: Item = {
        id: "restore-shortcut",
        label: t("table.shortcutActions.restore"),
        iconLeft: "unarchive",
        type: "button",
        onClick: () => {
          setIsPopoverOpened(false);
        },
      };
      const deleteShortcutAction: Item = {
        id: "delete-shortcut",
        label: t("table.shortcutActions.delete"),
        iconLeft: "trash-01",
        type: "button",
        onClick: () => {
          setIsPopoverOpened(false);
        },
      };

      return session.available
        ? [
            editShortcutAction,
            duplicateShortcutAction,
            copyLinkShortcutAction,
            cancelShortcutAction,
          ]
        : [
            restoreShortcutAction,
            editShortcutAction,
            duplicateShortcutAction,
            deleteShortcutAction,
          ];
    },
    [t, session.available, session.id, copyToClipboard, companyId],
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
