import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type UpdateUserRoleParams,
  staffRoleKeys,
  updateUserRoleAPI,
} from "@bsport/api-staff-management/role";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

import type { StaffFormData } from "./types";

type StaffFormDirtyFields = Partial<Record<keyof StaffFormData, unknown>>;

export const transformStaffUpdateFormData = (
  formData: StaffFormData,
  dirtyFields: StaffFormDirtyFields,
): UpdateUserRoleParams["data"] => {
  const data: UpdateUserRoleParams["data"] = {};

  if (dirtyFields.role) {
    data.role = Number(formData.role);
  }

  if (dirtyFields.commissionPercentage) {
    data.staff_commission_percentage = formData.commissionPercentage;
  }

  if (dirtyFields.coachesInRoleIds) {
    data.coaches_in_role_ids = formData.coachesInRoleIds.map(Number);
  }

  if (dirtyFields.staffEstablishmentBillingGroup) {
    data.staff_establishment_billing_group =
      formData.staffEstablishmentBillingGroup !== ""
        ? Number(formData.staffEstablishmentBillingGroup)
        : null;
  }

  return data;
};

export const useUpdateStaff = () => {
  const { t } = useTranslation("staff-details");
  const queryClient = useQueryClient();

  const { mutate: updateStaff, isPending: isLoading } = useMutation({
    mutationFn: (params: UpdateUserRoleParams) =>
      updateUserRoleAPI(fetch, params),
    onSuccess: (updatedStaff) => {
      queryClient.invalidateQueries({
        queryKey: staffRoleKeys.detail(updatedStaff.id),
      });
      queryClient.invalidateQueries({ queryKey: staffRoleKeys.lists() });
      toast({
        status: "default",
        icon: "check",
        title: t("submitResponse.success"),
      });
    },
    onError: () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("submitResponse.error"),
        buttonIcon: "x-close",
      });
    },
  });

  return { updateStaff, isLoading };
};
