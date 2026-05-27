import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import {
  type Role,
  type UpdateRoleDefinitionParams,
  roleDefinitionKeys,
  updateRoleDefinitionAPI,
} from "@bsport/api-staff-management/role";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

type UpdateRoleCallbacks = {
  onSuccess?: (role: Role) => void;
};

export const useUpdateRole = () => {
  const { t, i18n } = useTranslation("role-form");
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (params: UpdateRoleDefinitionParams) =>
      updateRoleDefinitionAPI(fetch, params),
  });

  const updateRole = useCallback(
    async (
      { id, data }: UpdateRoleDefinitionParams,
      { onSuccess }: UpdateRoleCallbacks = {},
    ) => {
      let updatedRole: Role;

      try {
        updatedRole = await mutateAsync({ id, data });
      } catch {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: t("updateSubmitResponse.error"),
          buttonIcon: "x-close",
        });
        return undefined;
      }

      queryClient.invalidateQueries({
        queryKey: roleDefinitionKeys.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: roleDefinitionKeys.lists() });

      toast({
        status: "default",
        icon: "check",
        title: t("updateSubmitResponse.success"),
      });

      onSuccess?.(updatedRole);

      return updatedRole;
    },
    [mutateAsync, queryClient, i18n.language],
  );

  return { updateRole, isUpdating: isPending };
};
