import type { FC } from "react";

import { Button } from "@bsport/kaizen-primitive-core";

import type { RoleRowData } from "#src/components/role-table/types";
import { useTranslation } from "#src/utils/i18n";

type RoleRowActionsProps = {
  row: RoleRowData;
  onDelete: (role: RoleRowData) => void;
};

export const RoleRowActions: FC<RoleRowActionsProps> = ({ row, onDelete }) => {
  const { t } = useTranslation("role-list");

  if (!row.editable) return null;

  return (
    <Button
      kind="icon-button"
      label={t("table.actions.deleteRole")}
      icon="trash-01"
      color="default"
      intent="flat"
      size="md"
      onClick={(e) => {
        e.stopPropagation();
        onDelete(row);
      }}
    />
  );
};
