import {
  Button,
  type Item,
  Menu,
  Popover,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

const PREVIEW_ACTION_ID = "preview";

type CampaignSentActionsMenuProps = {
  campaignUuid: string;
  onPreview: (campaignUuid: string) => void;
};

export const CampaignSentActionDropdown = ({
  onPreview,
  campaignUuid,
}: CampaignSentActionsMenuProps) => {
  const { t } = useTranslation("campaign");

  const handleMenuItemClick = (itemId: string) => {
    switch (itemId) {
      case PREVIEW_ACTION_ID:
        onPreview(campaignUuid);
        break;
      default:
        break;
    }
  };

  const menuItems: Item[] = [
    {
      id: PREVIEW_ACTION_ID,
      label: t("table.campaignSent.moreActions.preview"),
      iconLeft: "eye",
    },
  ];

  return (
    <Popover>
      <Popover.Anchor>
        {({ setIsPopoverOpened }) => (
          <Button
            kind="icon-button"
            label={t("table.campaignSent.moreActions.label")}
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
