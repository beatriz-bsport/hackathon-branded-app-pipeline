import type { FC } from "react";

import type { CompanyRolePermissions } from "@bsport/api-staff-management";

import { useTranslation } from "#src/utils/i18n";

import type { PermissionValue } from "../permission-tree-utils";
import { PermissionTreeSection } from "./permission-tree-section";

type AppBarPermissionSectionProps = {
  appbarButtons: CompanyRolePermissions["appbarButtons"];
  onChange: (path: string, value: unknown) => void;
  disabled?: boolean;
};

export const AppBarPermissionSection: FC<AppBarPermissionSectionProps> = ({
  appbarButtons,
  onChange,
  disabled = false,
}) => {
  const { t } = useTranslation("role-form");

  const getLabel = (path: string): string => {
    const key =
      path === "appbarButtons"
        ? "formFields.appbarButtons.label"
        : `formFields.appbarButtons.${path.replace(/^appbarButtons\./, "")}.label`;
    return t(key as never) as string;
  };

  return (
    <PermissionTreeSection
      path="appbarButtons"
      value={appbarButtons as unknown as PermissionValue}
      onChange={onChange}
      getLabel={getLabel}
      disabled={disabled}
    />
  );
};
