import type { FC } from "react";

import type { CompanyRolePermissions } from "@bsport/api-staff-management";
import { type UseFormControllerOutput, useWatch } from "@bsport/form";
import { Body } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import {
  type PermissionTree,
  type PermissionValue,
  hasSelectedPermission,
  setValueByPath,
} from "../permission-tree-utils";
import type { RoleFormSchema } from "../types";
import { AppBarPermissionSection } from "./app-bar-permission-section";
import { NavigationPermissionSection } from "./navigation-permission-section";
import { RestrictedUrlsSection } from "./restricted-urls-section";

type NavigationPermissionsStepProps = {
  methods: UseFormControllerOutput<RoleFormSchema>;
};

const setNestedFormValueOptions = {
  shouldDirty: true,
  shouldValidate: true,
} as const;

export const NavigationPermissionsStep: FC<NavigationPermissionsStepProps> = ({
  methods,
}) => {
  const { t } = useTranslation("role-form");

  const permissions = useWatch({
    control: methods.control,
    name: "permissions",
  });
  const restrictedPaths = permissions.restrictedPaths ?? [];
  const hasSelectedPermissionValue = hasSelectedPermission(permissions);

  const setPermissionValue = (path: string, value: unknown) => {
    const next = setValueByPath(
      methods.getValues("permissions") as unknown as PermissionTree,
      path,
      value as never,
    );
    methods.setValue("permissions", next as never, setNestedFormValueOptions);
  };

  const setRestrictedPaths = (paths: string[]) => {
    const current = methods.getValues("permissions");
    methods.setValue(
      "permissions",
      { ...current, restrictedPaths: paths },
      setNestedFormValueOptions,
    );
  };

  return (
    <div className="flex w-full min-w-0 flex-col gap-lg">
      <Body htmlVariant="p" color="default">
        {t("steps.navigationPermissions.helperText")}
      </Body>

      <div className="flex flex-col border border-stroke-thin border-stroke-weak rounded-md overflow-clip">
        <NavigationPermissionSection
          path="navigationMenu"
          value={permissions.navigationMenu as unknown as PermissionValue}
          onChange={setPermissionValue}
        />

        <AppBarPermissionSection
          appbarButtons={
            permissions.appbarButtons as CompanyRolePermissions["appbarButtons"]
          }
          onChange={setPermissionValue}
        />
      </div>

      {!hasSelectedPermissionValue && (
        <Body htmlVariant="p" color="critical">
          {t("formFields.permissions.errorRequired")}
        </Body>
      )}

      <RestrictedUrlsSection
        restrictedPaths={restrictedPaths}
        onChange={setRestrictedPaths}
      />
    </div>
  );
};
