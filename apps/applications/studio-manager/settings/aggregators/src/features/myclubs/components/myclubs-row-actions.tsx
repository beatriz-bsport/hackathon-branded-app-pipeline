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

type MyclubsRowActionsProps = {
  status: AccountRow["status"];
};

export const MyclubsRowActions: FC<MyclubsRowActionsProps> = ({ status }) => {
  const { t } = useTranslation("common");

  const menuItems: Item[] =
    status === "deactivated"
      ? [
          {
            id: REACTIVATE_ACTION_ID,
            label: t("myclubs.table.actions.reactivate"),
            iconLeft: "refresh-cw-01",
          },
        ]
      : [
          {
            id: EDIT_ACTION_ID,
            label: t("myclubs.table.actions.edit"),
            iconLeft: "edit-02",
          },
          {
            id: DELETE_ACTION_ID,
            label: t("myclubs.table.actions.delete"),
            iconLeft: "trash-01",
          },
        ];

  return (
    <Popover>
      <Popover.Anchor>
        {({ setIsPopoverOpened }) => (
          <Button
            kind="icon-button"
            label={t("myclubs.table.actions.label")}
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
            onSelectOption={() => {
              setIsPopoverOpened(false);
            }}
          />
        )}
      </Popover.Content>
    </Popover>
  );
};
