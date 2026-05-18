import { useQuery } from "@tanstack/react-query";
import { type FC, useMemo } from "react";

import {
  type EstablishmentBillingGroup,
  fetchEstablishmentBillingGroups,
} from "@bsport/api-core";
import { fetchRoleDefinitionsQueryOptions } from "@bsport/api-staff-management/role";
import { RoleType } from "@bsport/common/lib/master-data/user-role";
import { FormField, useFormContext } from "@bsport/form";
import { Select, type SelectProps } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

import type { StaffFormData } from "../types";

const BILLING_GROUPS_STALE_TIME = 5 * 60 * 1000;

type StaffFormBillingGroupProps = {
  formId: string;
};

export const StaffFormBillingGroup: FC<StaffFormBillingGroupProps> = ({
  formId,
}) => {
  const { t } = useTranslation("staff-form");
  const companyId = dataAccessLayer.useCompanyTheme()?.company;
  const { watch } = useFormContext<StaffFormData>();
  const selectedRoleId = watch("role");

  const { data: roles = [] } = useQuery(
    fetchRoleDefinitionsQueryOptions(fetch),
  );

  const { data: billingGroups = [], isFetching: isFetchingBillingGroups } =
    useQuery({
      queryKey: [
        "@api-core",
        "establishment-billing-groups",
        "list",
        { company: companyId },
      ] as const,
      queryFn: () =>
        companyId !== undefined
          ? fetchEstablishmentBillingGroups(fetch, { company: companyId })
          : Promise.resolve([] as EstablishmentBillingGroup[]),
      select: (
        data:
          | EstablishmentBillingGroup[]
          | { results: EstablishmentBillingGroup[] },
      ): EstablishmentBillingGroup[] =>
        Array.isArray(data) ? data : (data.results ?? []),
      staleTime: BILLING_GROUPS_STALE_TIME,
    });

  const selectedRole = roles.find((role) => String(role.id) === selectedRoleId);
  const selectedRoleIdNum = Number(selectedRoleId);

  const isCustomRole = selectedRole?.editable === true;
  const isAdminOrStaff =
    selectedRoleIdNum === RoleType.USER_ROLE_ADMIN ||
    selectedRoleIdNum === RoleType.USER_ROLE_ONLY_OFFER_MANAGEMENT;
  const isPosRole = selectedRoleIdNum === RoleType.USER_ROLE_QUICKSALE;

  const shouldShow =
    isPosRole ||
    isCustomRole ||
    (isAdminOrStaff && (isFetchingBillingGroups || billingGroups.length > 0));

  const billingGroupItems = useMemo(
    () =>
      billingGroups
        .filter((billingGroup) => !billingGroup.disabled)
        .map((billingGroup) => ({
          id: String(billingGroup.id),
          label: billingGroup.name,
        })),
    [billingGroups],
  );

  if (!shouldShow) {
    return null;
  }

  return (
    <FormField<StaffFormData, "staffEstablishmentBillingGroup", SelectProps>
      name="staffEstablishmentBillingGroup"
      mapProps={({ defaultProps, field, form }) => ({
        ...defaultProps,
        value: field.value || undefined,
        items: billingGroupItems,
        onChange: (billingGroupId) => {
          form.setValue("staffEstablishmentBillingGroup", billingGroupId, {
            shouldDirty: true,
            shouldValidate: true,
          });
        },
        loadingProps: {
          isLoading: isFetchingBillingGroups,
          message: t("formFields.billingGroup.loading"),
        },
      })}
    >
      {/** @ts-expect-error items are provided by the wrapper */}
      <Select
        id={`${formId}-billing-group`}
        label={t("formFields.billingGroup.label")}
        helperText={t("formFields.billingGroup.description")}
        required={isPosRole}
        fullWidth
        className="max-w-md"
      />
    </FormField>
  );
};
