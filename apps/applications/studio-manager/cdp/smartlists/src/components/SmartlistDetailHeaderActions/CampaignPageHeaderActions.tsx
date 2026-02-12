import {
  Button,
  type Item,
  Menu,
  Popover,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export const GENERATE_REPORT_ACTION_ID = "generateReport";

type CampaignPageHeaderActionsProps = {
  onGenerateReport: () => void;
};

export const CampaignPageHeaderActions = ({
  onGenerateReport,
}: CampaignPageHeaderActionsProps) => {
  const { t } = useTranslation("campaign");

  const handleMenuItemClick = (itemId: string) => {
    switch (itemId) {
      case GENERATE_REPORT_ACTION_ID:
        onGenerateReport();
        break;
      default:
        break;
    }
  };

  const menuItems: Item[] = [
    {
      id: GENERATE_REPORT_ACTION_ID,
      label: t("actions.generateReport"),
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
