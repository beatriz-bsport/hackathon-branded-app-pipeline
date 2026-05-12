import type { FC } from "react";

import {
  Button,
  type Item,
  Menu,
  Popover,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { AccountRow } from "../adapters/account-row";

const EDIT_ACTION_ID = "edit";
const DELETE_ACTION_ID = "delete";
const REACTIVATE_ACTION_ID = "reactivate";

type WellhubRowActionsProps = {
  status: AccountRow["status"];
  onEdit: () => void;
  onDelete: () => void;
  onReactivate: () => void;
};

export const WellhubRowActions: FC<WellhubRowActionsProps> = ({
  status,
  onEdit,
  onDelete,
  onReactivate,
}) => {
  const { t } = useTranslation("common");

  const menuItems: Item[] =
    status === "deactivated"
      ? [
          {
            id: REACTIVATE_ACTION_ID,
            label: t("wellhub.table.actions.reactivate"),
            iconLeft: "refresh-cw-01",
          },
        ]
      : [
          {
            id: EDIT_ACTION_ID,
            label: t("wellhub.table.actions.edit"),
            iconLeft: "edit-02",
          },
          {
            id: DELETE_ACTION_ID,
            label: t("wellhub.table.actions.delete"),
            iconLeft: "trash-01",
          },
        ];

  const handleSelectOption = (id: string) => {
    if (id === EDIT_ACTION_ID) onEdit();
    else if (id === DELETE_ACTION_ID) onDelete();
    else if (id === REACTIVATE_ACTION_ID) onReactivate();
  };

  return (
    <Popover>
      <Popover.Anchor>
        {({ setIsPopoverOpened }) => (
          <Button
            kind="icon-button"
            label={t("wellhub.table.actions.label")}
            icon="dots-vertical"
            color="default"
            intent="flat"
            size="md"
            onClick={() => {
              setIsPopoverOpened((opened) => !opened);
            }}
          />
        )}
      </Popover.Anchor>
      <Popover.Content placement="bottom-right">
        {({ setIsPopoverOpened }) => (
          <Menu
            items={menuItems}
            onSelectOption={(id) => {
              setIsPopoverOpened(false);
              handleSelectOption(id);
            }}
          />
        )}
      </Popover.Content>
    </Popover>
  );
};
