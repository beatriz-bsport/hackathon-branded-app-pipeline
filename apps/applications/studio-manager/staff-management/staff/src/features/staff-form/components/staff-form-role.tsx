import { useQuery } from "@tanstack/react-query";
import type { FC } from "react";

import { fetchRoleDefinitionsQueryOptions } from "@bsport/api-staff-management/role";
import { RoleType } from "@bsport/common/lib/master-data/user-role";
import { FormField } from "@bsport/form";
import { Select, type SelectProps } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

import type { StaffFormData } from "../types";

type StaffFormRoleProps = {
  formId: string;
};

export const StaffFormRole: FC<StaffFormRoleProps> = ({ formId }) => {
  const { t } = useTranslation("staff-form");
  const { data: roles = [], isFetching: isFetchingRoles } = useQuery(
    fetchRoleDefinitionsQueryOptions(fetch),
  );

  const roleItems = roles
    .filter((role) => role.id !== RoleType.USER_ROLE_NO_RESTRICTION)
    .map((role) => ({
      id: String(role.id),
      label: role.name,
    }));

  return (
    <FormField<StaffFormData, "role", SelectProps>
      name="role"
      mapProps={({ defaultProps, field, form }) => ({
        ...defaultProps,
        value: field.value || undefined,
        items: roleItems,
        onChange: (roleId) => {
          form.setValue("role", roleId, {
            shouldDirty: true,
            shouldValidate: true,
          });
        },
        loadingProps: {
          isLoading: isFetchingRoles,
          message: t("formFields.role.loading"),
        },
      })}
    >
      {/** @ts-expect-error items are provided by the wrapper */}
      <Select
        id={`${formId}-role`}
        label={t("formFields.role.label")}
        required
        fullWidth
        className="max-w-md"
      />
    </FormField>
  );
};
