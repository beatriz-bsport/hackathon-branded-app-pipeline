import { useQuery } from "@tanstack/react-query";
import type { FC } from "react";

import { fetchRoleDefinitionsQueryOptions } from "@bsport/api-staff-management/role";
import { FormField } from "@bsport/form";
import { Select, type SelectProps } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

import type { RoleFormData } from "../types";

type RoleFormStarterRoleProps = {
  formId: string;
  disabled?: boolean;
};

export const RoleFormStarterRole: FC<RoleFormStarterRoleProps> = ({
  formId,
  disabled = false,
}) => {
  const { t } = useTranslation("role-form");
  const { data: roles = [], isFetching: isFetchingRoles } = useQuery(
    fetchRoleDefinitionsQueryOptions(fetch),
  );

  const fromScratchItem = {
    id: "",
    label: t("formFields.starterRole.fromScratch"),
  };

  const roleItems = [
    fromScratchItem,
    ...roles
      .filter((role) => role.editable === false)
      .map((role) => ({
        id: String(role.id),
        label: role.name,
      })),
  ];

  return (
    <FormField<RoleFormData, "starterRoleId", SelectProps>
      name="starterRoleId"
      mapProps={({ defaultProps, field, form }) => ({
        ...defaultProps,
        value: field.value ?? undefined,
        items: roleItems,
        onChange: (roleId) => {
          form.setValue("starterRoleId", roleId, {
            shouldDirty: true,
            shouldValidate: true,
          });
        },
        loadingProps: {
          isLoading: isFetchingRoles,
          message: t("formFields.starterRole.loading"),
        },
      })}
    >
      {/** @ts-expect-error items are provided by the wrapper */}
      <Select
        id={`${formId}-starter-role`}
        label={t("formFields.starterRole.label")}
        helperText={t("formFields.starterRole.helperText")}
        disabled={disabled}
        fullWidth
        className="max-w-md"
      />
    </FormField>
  );
};
