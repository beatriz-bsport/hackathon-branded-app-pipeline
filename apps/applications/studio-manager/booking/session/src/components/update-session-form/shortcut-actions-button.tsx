import React, { useCallback } from "react";

import type { SessionWithActivity } from "@bsport/api-book";
import {
  Button,
  Item,
  Menu,
  Popover,
  useCopyToClipboard,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useTranslation } from "#src/utils/i18n";
import { useObjectLevelPermission } from "#src/utils/permission";

type ShortcutActionsButtonProps = {
  session: SessionWithActivity;
  onOpenCancelSessionModal: () => void;
  onOpenDuplicateSessionModal: () => void;
};

export const ShortcutActionsButton: React.FC<ShortcutActionsButtonProps> = ({
  session,
  onOpenCancelSessionModal,
  onOpenDuplicateSessionModal,
}) => {
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
          setIsPopoverOpened(false);
          onOpenCancelSessionModal();
        },
      };

      const availableActions = [
        ...(companyId ? [copyLinkShortcutAction] : []),
        ...(hasCreatePermission ? [duplicateShortcutAction] : []),
        ...(hasCancelPermission ? [cancelShortcutAction] : []),
      ];

      const unavailableActions = [
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
    ],
  );

  const hasAnyPermission = hasCreatePermission || hasCancelPermission;

  if (!hasAnyPermission) {
    return null;
  }

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
