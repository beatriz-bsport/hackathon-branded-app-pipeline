import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type CreateRoleDefinitionParams,
  createRoleDefinitionAPI,
  roleDefinitionKeys,
} from "@bsport/api-staff-management/role";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

import type { RoleFormData } from "../role-form/types";

const transformRoleCreateFormData = (
  formData: RoleFormData,
): CreateRoleDefinitionParams => ({
  name: formData.name.trim(),
  description: formData.description.trim(),
  permissions: formData.permissions,
  object_level_permissions: formData.objectLevelPermissions,
  has_booking_override_control: formData.hasBookingOverrideControl,
});

export const useCreateRole = () => {
  const { t } = useTranslation("role-form");
  const queryClient = useQueryClient();

  const { mutate: createRole, isPending: isLoading } = useMutation({
    mutationFn: (formData: RoleFormData) =>
      createRoleDefinitionAPI(fetch, transformRoleCreateFormData(formData)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleDefinitionKeys.lists() });
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

  return { createRole, isLoading };
};
