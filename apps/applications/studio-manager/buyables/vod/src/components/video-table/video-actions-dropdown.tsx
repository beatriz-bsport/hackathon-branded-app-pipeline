import type { FC } from "react";

import {
  Button,
  type Item,
  Menu,
  Popover,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

const DUPLICATE_ACTION_ID = "duplicate";

type VideoActionsDropdownProps = {
  onDuplicate: () => void;
};

export const VideoActionsDropdown: FC<VideoActionsDropdownProps> = ({
  onDuplicate,
}) => {
  const { t } = useTranslation("media-list");

  const menuItems: Item[] = [
    {
      id: DUPLICATE_ACTION_ID,
      label: t("table.actions.duplicate"),
      iconLeft: "copy-03",
    },
  ];

  return (
    <Popover>
      <Popover.Anchor>
        {({ setIsPopoverOpened }) => (
          <Button
            kind="icon-button"
            label={t("table.actions.moreActions")}
            icon="dots-vertical"
            color="default"
            intent="flat"
            size="md"
            onClick={(event) => {
              event.preventDefault();
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

                if (value === DUPLICATE_ACTION_ID) {
                  onDuplicate();
                }
              }}
            />
          </div>
        )}
      </Popover.Content>
    </Popover>
  );
};
