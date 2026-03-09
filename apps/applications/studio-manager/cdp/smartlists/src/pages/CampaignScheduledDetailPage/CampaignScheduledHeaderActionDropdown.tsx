import {
  Button,
  type Item,
  Menu,
  Popover,
} from "@bsport/kaizen-primitive-core";

import {
  CAMPAIGN_SCHEDULED_DELETE_INLINE_ACTION,
  CAMPAIGN_SCHEDULED_EDIT_INLINE_ACTION,
} from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";

type CampaignScheduledHeaderActionDropdownProps = {
  onEdit: () => void;
  onDelete: () => void;
};

export const CampaignScheduledHeaderActionDropdown = ({
  onEdit,
  onDelete,
}: CampaignScheduledHeaderActionDropdownProps) => {
  const { t } = useTranslation("campaign");

  const handleMenuItemClick = (itemId: string) => {
    switch (itemId) {
      case CAMPAIGN_SCHEDULED_EDIT_INLINE_ACTION:
        onEdit();
        break;
      case CAMPAIGN_SCHEDULED_DELETE_INLINE_ACTION:
        onDelete();
        break;
      default:
        break;
    }
  };

  const menuItems: Item[] = [
    {
      id: CAMPAIGN_SCHEDULED_EDIT_INLINE_ACTION,
      label: t("table.campaignScheduled.moreActions.edit"),
      iconLeft: "edit-02",
    },
    {
      id: CAMPAIGN_SCHEDULED_DELETE_INLINE_ACTION,
      label: t("table.campaignScheduled.moreActions.delete"),
      iconLeft: "trash-01",
    },
  ];

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
