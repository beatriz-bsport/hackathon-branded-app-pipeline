import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";

import {
  type UpdateUserRoleParams,
  type UserRole,
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

// The backend rejects role changes combined with advanced fields in the same
// request (mirrors legacy branch A vs branch B). Splits data so they can be
// sent as two sequential PATCHes when both sides are dirty.
const splitUpdateData = (
  data: UpdateUserRoleParams["data"],
): {
  basic: UpdateUserRoleParams["data"];
  advanced: UpdateUserRoleParams["data"];
} => {
  const { coaches_in_role_ids, staff_establishment_billing_group, ...basic } =
    data;

  const advanced: UpdateUserRoleParams["data"] = {};

  if (coaches_in_role_ids !== undefined) {
    advanced.coaches_in_role_ids = coaches_in_role_ids;
  }

  if (staff_establishment_billing_group !== undefined) {
    advanced.staff_establishment_billing_group =
      staff_establishment_billing_group;
  }

  return { basic, advanced };
};

type UpdateStaffCallbacks = {
  onSuccess?: (staff: UserRole) => void;
};

export const useUpdateStaff = () => {
  const { t } = useTranslation("staff-details");
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync } = useMutation({
    mutationFn: (params: UpdateUserRoleParams) =>
      updateUserRoleAPI(fetch, params),
  });

  const updateStaff = useCallback(
    async (
      { id, data }: UpdateUserRoleParams,
      { onSuccess }: UpdateStaffCallbacks = {},
    ) => {
      setIsLoading(true);

      // Tracks whether at least one PATCH landed so caches are invalidated
      // even on partial failure (basic succeeds, advanced fails).
      let serverMutated = false;

      const invalidateCaches = () => {
        queryClient.invalidateQueries({ queryKey: staffRoleKeys.detail(id) });
        queryClient.invalidateQueries({ queryKey: staffRoleKeys.lists() });
      };

      try {
        const { basic, advanced } = splitUpdateData(data);
        const hasBasic = Object.keys(basic).length > 0;
        const hasAdvanced = Object.keys(advanced).length > 0;

        let result: UserRole;

        if (hasBasic && hasAdvanced) {
          await mutateAsync({ id, data: basic });
          serverMutated = true;
          result = await mutateAsync({ id, data: advanced });
        } else {
          result = await mutateAsync({ id, data });
          serverMutated = true;
        }

        invalidateCaches();

        toast({
          status: "default",
          icon: "check",
          title: t("submitResponse.success"),
        });

        onSuccess?.(result);
      } catch {
        if (serverMutated) {
          invalidateCaches();
        }

        toast({
          status: "critical",
          icon: "alert-circle",
          title: t("submitResponse.error"),
          buttonIcon: "x-close",
        });
      } finally {
        queryClient.invalidateQueries({
          queryKey: staffRoleKeys.detail(id),
        });
        queryClient.invalidateQueries({ queryKey: staffRoleKeys.lists() });
        setIsLoading(false);
      }
    },
    [mutateAsync, queryClient, t],
  );

  return { updateStaff, isLoading };
};
