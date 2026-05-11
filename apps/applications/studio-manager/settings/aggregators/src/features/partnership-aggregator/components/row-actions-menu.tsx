import type { FC } from "react";

import {
  Button,
  type Item,
  Menu,
  Popover,
  Tooltip,
} from "@bsport/kaizen-primitive-core";

import { type TFunction, useTranslation } from "#src/utils/i18n";

import type { AccountRow } from "../adapters/account-row";
import type { MutableNamespace } from "../types";

type ReadOnlyNamespace = "usc";

const CRUD_KEYS = {
  myclubs: {
    label: "myclubs.table.actions.label",
    edit: "myclubs.table.actions.edit",
    delete: "myclubs.table.actions.delete",
    reactivate: "myclubs.table.actions.reactivate",
  },
  wellhub: {
    label: "wellhub.table.actions.label",
    edit: "wellhub.table.actions.edit",
    delete: "wellhub.table.actions.delete",
    reactivate: "wellhub.table.actions.reactivate",
  },
} as const satisfies Record<
  MutableNamespace,
  Record<string, Parameters<TFunction>[0]>
>;

const READONLY_KEYS = {
  usc: {
    label: "usc.table.actions.label",
    disabledHint: "usc.table.actions.disabledHint",
  },
} as const satisfies Record<
  ReadOnlyNamespace,
  Record<string, Parameters<TFunction>[0]>
>;

const EDIT_ACTION_ID = "edit";
const DELETE_ACTION_ID = "delete";
const REACTIVATE_ACTION_ID = "reactivate";

type RowActionsMenuProps =
  | {
      namespace: MutableNamespace;
      readOnly?: false;
      status: AccountRow["status"];
      onEdit: () => void;
      onDelete: () => void;
      onReactivate: () => void;
    }
  | {
      namespace: ReadOnlyNamespace;
      readOnly: true;
    };

export const RowActionsMenu: FC<RowActionsMenuProps> = (props) => {
  const { t } = useTranslation("common");

  if (props.readOnly) {
    const keys = READONLY_KEYS[props.namespace];
    return (
      <Tooltip placement="left" label={t(keys.disabledHint)}>
        <Button
          kind="icon-button"
          label={t(keys.label)}
          icon="dots-vertical"
          color="default"
          intent="flat"
          size="md"
          disabled
        />
      </Tooltip>
    );
  }

  const { namespace, status, onEdit, onDelete, onReactivate } = props;
  const keys = CRUD_KEYS[namespace];

  const menuItems: Item[] =
    status === "deactivated"
      ? [
          {
            id: REACTIVATE_ACTION_ID,
            label: t(keys.reactivate),
            iconLeft: "refresh-cw-01",
          },
        ]
      : [
          {
            id: EDIT_ACTION_ID,
            label: t(keys.edit),
            iconLeft: "edit-02",
          },
          {
            id: DELETE_ACTION_ID,
            label: t(keys.delete),
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
            label={t(keys.label)}
            icon="dots-vertical"
            color="default"
            intent="flat"
            size="md"
            onClick={() => setIsPopoverOpened((opened) => !opened)}
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
