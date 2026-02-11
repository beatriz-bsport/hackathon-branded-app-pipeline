import { useCallback, useMemo } from "react";

import {
  Button,
  type Item,
  Menu,
  Popover,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

const EDIT_ACTION_ID = "edit";
const DELETE_ACTION_ID = "delete";

type NotificationActionsMenuProps = {
  campaignId: number;
  onEdit: (notificationId: number) => void;
  onDelete: (notificationId: number) => void;
};

export const CampaignScheduledActionDropdown = ({
  onEdit,
  onDelete,
  campaignId,
}: NotificationActionsMenuProps) => {
  const { t } = useTranslation("campaign");

  const handleMenuItemClick = (itemId: string) => {
    switch (itemId) {
      case EDIT_ACTION_ID:
        onEdit(campaignId);
        break;
      case DELETE_ACTION_ID:
        onDelete(campaignId);
        break;
      default:
        break;
    }
  };

  const getMenuItems = useCallback((): Item[] => {
    return [
      {
        id: EDIT_ACTION_ID,
        label: t("table.campaignScheduled.moreActions.edit"),
        iconLeft: "edit-02",
      },
      {
        id: DELETE_ACTION_ID,
        label: t("table.campaignScheduled.moreActions.delete"),
        iconLeft: "trash-01",
      },
    ];
  }, []);

  const menuItems = useMemo(() => getMenuItems(), [getMenuItems]);

  return (
    <Popover>
      <Popover.Anchor>
        {({ setIsPopoverOpened }) => (
          <Button
            kind="icon-button"
            label={t("table.campaignScheduled.moreActions.label")}
            icon="dots-vertical"
            color="default"
            intent="flat"
            size="md"
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
