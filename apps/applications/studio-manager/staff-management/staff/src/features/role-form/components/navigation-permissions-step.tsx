import type { FC } from "react";

import type { CompanyRolePermissions } from "@bsport/api-staff-management";
import {
  FormField,
  FormProvider,
  type UseFormControllerOutput,
  useWatch,
} from "@bsport/form";
import {
  Body,
  Checkbox,
  type CheckboxProps,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { SET_NESTED_FORM_VALUE_OPTIONS } from "../constants";
import {
  type PermissionTree,
  type PermissionValue,
  hasSelectedPermission,
  setValueByPath,
} from "../permission-tree-utils";
import type { RoleFormData, RoleFormSchema } from "../types";
import { AppBarPermissionSection } from "./app-bar-permission-section";
import { NavigationPermissionSection } from "./navigation-permission-section";
import { RestrictedUrlsSection } from "./restricted-urls-section";

type NavigationPermissionsStepProps = {
  methods: UseFormControllerOutput<RoleFormSchema>;
};

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
    methods.setValue(
      "permissions",
      next as never,
      SET_NESTED_FORM_VALUE_OPTIONS,
    );
  };

  const setRestrictedPaths = (paths: string[]) => {
    const current = methods.getValues("permissions");
    methods.setValue(
      "permissions",
      { ...current, restrictedPaths: paths },
      SET_NESTED_FORM_VALUE_OPTIONS,
    );
  };

  return (
    <FormProvider {...methods}>
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

        <div className="flex flex-col gap-2xs border border-stroke-thin border-stroke-weak rounded-md p-md">
          <FormField<RoleFormData, "hasBookingOverrideControl", CheckboxProps>
            name="hasBookingOverrideControl"
            mapProps={({
              defaultProps: { value, onChange, statusText: _, ...otherProps },
            }) => ({
              ...otherProps,
              value: value ? "checked" : "unchecked",
              onChange,
            })}
          >
            {/* @ts-expect-error value and onChange are provided by FormField */}
            <Checkbox
              id="role-has-booking-override-control"
              label={t("formFields.hasBookingOverrideControl.label")}
              helperText={t("formFields.hasBookingOverrideControl.helperText")}
            />
          </FormField>
        </div>
      </div>
    </FormProvider>
  );
};
