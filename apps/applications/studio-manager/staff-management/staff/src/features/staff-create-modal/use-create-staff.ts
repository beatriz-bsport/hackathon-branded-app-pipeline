import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type CreateUserRoleParams,
  createUserRoleAPI,
  staffRoleKeys,
} from "@bsport/api-staff-management/role";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

import type { StaffFormData } from "../staff-form/types";

const transformStaffCreateFormData = (
  formData: StaffFormData,
): CreateUserRoleParams => ({
  email: formData.email.trim().toLowerCase(),
  password: formData.password,
  first_name: formData.firstName.trim(),
  last_name: formData.lastName.trim(),
  role: Number(formData.role),
  staff_commission_percentage: formData.commissionPercentage,
});

export const useCreateStaff = () => {
  const { t } = useTranslation("staff-form");
  const queryClient = useQueryClient();

  const { mutate: createStaff, isPending: isLoading } = useMutation({
    mutationFn: (formData: StaffFormData) =>
      createUserRoleAPI(fetch, transformStaffCreateFormData(formData)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffRoleKeys.lists() });
      toast({
        status: "default",
        icon: "check",
        title: t("createModal.submitResponse.success"),
      });
    },
    onError: () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        title: t("createModal.submitResponse.error"),
        buttonIcon: "x-close",
      });
    },
  });

  return { createStaff, isLoading };
};
