import type { FC } from "react";

import {
  Button,
  type Item,
  Menu,
  Popover,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

const DUPLICATE_ACTION_ID = "duplicate";
const DELETE_ACTION_ID = "delete";

type VideoActionsDropdownProps = {
  onDuplicate: () => void;
  onDelete: () => void;
  disabled?: boolean;
};

export const VideoActionsDropdown: FC<VideoActionsDropdownProps> = ({
  onDuplicate,
  onDelete,
  disabled = false,
}) => {
  const { t } = useTranslation("media-list");

  const menuItems: Item[] = [
    {
      id: DUPLICATE_ACTION_ID,
      label: t("table.actions.duplicate"),
      iconLeft: "copy-03",
    },
    {
      id: DELETE_ACTION_ID,
      label: t("table.actions.delete"),
      iconLeft: "trash-01",
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
            disabled={disabled}
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

                if (value === DELETE_ACTION_ID) {
                  onDelete();
                }
              }}
            />
          </div>
        )}
      </Popover.Content>
    </Popover>
  );
};
