import {
  Button,
  type Item,
  Menu,
  Popover,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export const GENERATE_REPORT_ACTION_ID = "generateReport";

type SmartlistHeaderActionDropdownProps = {
  onGenerateReport: () => void;
};

export const SmartlistHeaderActionDropdown = ({
  onGenerateReport,
}: SmartlistHeaderActionDropdownProps) => {
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
      iconLeft: "download-01",
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
