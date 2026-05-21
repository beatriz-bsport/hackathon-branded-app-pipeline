import type { FC } from "react";

import { useTranslation } from "#src/utils/i18n";

import { HIDDEN_PERMISSION_KEYS } from "../constants";
import type { PermissionValue } from "../permission-tree-utils";
import { PermissionTreeSection } from "./permission-tree-section";

type NavigationPermissionSectionProps = {
  path: string;
  value: PermissionValue;
  onChange: (path: string, value: unknown) => void;
  disabled?: boolean;
};

export const NavigationPermissionSection: FC<
  NavigationPermissionSectionProps
> = ({ path, value, onChange, disabled = false }) => {
  const { t } = useTranslation("role-form");

  const getLabel = (labelPath: string): string => {
    const key =
      labelPath === "navigationMenu"
        ? "formFields.navigationMenu.label"
        : `formFields.navigationMenu.${labelPath.replace(/^navigationMenu\./, "")}.label`;
    return t(key as never) as string;
  };

  return (
    <PermissionTreeSection
      path={path}
      value={value}
      onChange={onChange}
      getLabel={getLabel}
      disabled={disabled}
      hiddenKeys={HIDDEN_PERMISSION_KEYS}
    />
  );
};
