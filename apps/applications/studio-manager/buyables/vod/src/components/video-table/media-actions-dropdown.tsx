import type { FC } from "react";

import {
  Button,
  type Item,
  Menu,
  Popover,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

const EDIT_ACTION_ID = "edit";
const DUPLICATE_ACTION_ID = "duplicate";
const DELETE_ACTION_ID = "delete";

type MediaActionsDropdownProps = {
  onDuplicate: () => void;
  onDelete: () => void;
  onEdit?: () => void;
  disabled?: boolean;
};

export const MediaActionsDropdown: FC<MediaActionsDropdownProps> = ({
  onDuplicate,
  onDelete,
  onEdit,
  disabled = false,
}) => {
  const { t } = useTranslation("media-list");

  const menuItems: Item[] = [
    ...(onEdit
      ? [
          {
            id: EDIT_ACTION_ID,
            label: t("table.actions.edit"),
            iconLeft: "edit-02" as const,
          },
        ]
      : []),
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

                if (value === EDIT_ACTION_ID) {
                  onEdit?.();
                }

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
