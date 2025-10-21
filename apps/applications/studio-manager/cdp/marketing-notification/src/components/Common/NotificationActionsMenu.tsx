import { useCallback, useMemo } from "react";

import {
  Button,
  type Item,
  Menu,
  Popover,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

type NotificationActionsMenuProps = {
  notificationId: number;
  onEdit: (notificationId: number) => void;
  onDelete: (notificationId: number) => void;
  onPreview?: (notificationId: number) => void;
};

export const NotificationActionsMenu = ({
  onPreview,
  onEdit,
  onDelete,
  notificationId,
}: NotificationActionsMenuProps) => {
  const { t } = useTranslation("marketingNotificationList");

  const handleMenuItemClick = (itemId: string) => {
    switch (itemId) {
      case "preview":
        onPreview?.(notificationId);
        break;
      case "edit":
        onEdit(notificationId);
        break;
      case "delete":
        onDelete(notificationId);
        break;
      default:
        break;
    }
  };

  const getMenuItems = useCallback((): Item[] => {
    const previewAction: Item = {
      id: "preview",
      label: t("table.actions.preview"),
      iconLeft: "eye",
    };
    const sharedActions: Item[] = [
      {
        id: "edit",
        label: t("table.actions.edit"),
        iconLeft: "edit-02",
      },
      {
        id: "delete",
        label: t("table.actions.delete"),
        iconLeft: "trash-01",
      },
    ];
    return onPreview ? [previewAction, ...sharedActions] : sharedActions;
  }, [onPreview]);

  const menuItems = useMemo(() => getMenuItems(), [getMenuItems]);

  return (
    <Popover>
      <Popover.Anchor>
        {({ setIsPopoverOpened }) => (
          <Button
            color="default"
            intent="flat"
            size="md"
            iconLeft="dots-vertical"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              event.stopPropagation();
              setIsPopoverOpened((opened) => !opened);
            }}
          />
        )}
      </Popover.Anchor>
      <Popover.Content placement="bottom-right">
        {({ setIsPopoverOpened }) => (
          <div className="flex flex-col gap-sm">
            <Menu
              items={menuItems}
              onSelectOption={(value) => {
                setIsPopoverOpened(false);
                handleMenuItemClick(value);
              }}
            />
          </div>
        )}
      </Popover.Content>
    </Popover>
  );
};
