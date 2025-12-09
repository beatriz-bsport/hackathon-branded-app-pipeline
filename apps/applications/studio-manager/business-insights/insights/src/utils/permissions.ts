import { useMemo } from "react";

import {
  type DeepKeys,
  type WithSignature,
  checkHasPermission,
} from "@bsport/permissions";
import {
  type ObjectLevelPermissions,
  dataAccessLayer,
} from "@bsport/sm-backbone";

/**
 * Generic hook to check object-level permissions
 * Returns an object with hasPermission (boolean) and isLoading (boolean)
 */
export const useObjectLevelPermission = (
  path: DeepKeys<ObjectLevelPermissions>,
): { hasPermission: boolean; isLoading: boolean } => {
  const userRole = dataAccessLayer.useUserRole();

  // If userRole is undefined, permissions are still loading
  const isLoading = userRole === undefined;

  const hasPermission = checkHasPermission<
    WithSignature<ObjectLevelPermissions>
  >({
    permissions: userRole?.object_level_permissions,
    path,
  });

  return { hasPermission, isLoading };
};

/**
 * Maps each insight to its required permission path(s)
 */
const INSIGHT_PERMISSIONS = {
  trial: "report.Payments.invoices.allowed_actions.read",
  recurring: "report.Club.subscription.allowed_actions.read",
} as const;

export type InsightId = keyof typeof INSIGHT_PERMISSIONS;
export type InsightPermissionContext = Record<InsightId, boolean>;

/**
 * Hook to check if user has permission to view trial insights
 */
export const useTrialPermission = () =>
  useObjectLevelPermission(INSIGHT_PERMISSIONS.trial);

/**
 * Hook to check if user has permission to view recurring revenue insights
 */
export const useRecurringPermission = () =>
  useObjectLevelPermission(INSIGHT_PERMISSIONS.recurring);

/**
 * Hook that returns permission context for all insights
 * Context is a simple object: { trial: boolean, recurring: boolean }
 */
export const useInsightPermissionContext = () => {
  const trialPermission = useTrialPermission();
  const recurringPermission = useRecurringPermission();

  const context = useMemo<InsightPermissionContext>(
    () => ({
      trial: trialPermission.hasPermission,
      recurring: recurringPermission.hasPermission,
    }),
    [trialPermission.hasPermission, recurringPermission.hasPermission],
  );

  const isLoading = trialPermission.isLoading || recurringPermission.isLoading;

  return { context, isLoading };
};
