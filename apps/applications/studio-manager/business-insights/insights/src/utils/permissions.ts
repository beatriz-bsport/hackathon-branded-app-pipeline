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
 * Returns boolean indicating if user has the permission
 */
export const useObjectLevelPermission = (
  path: DeepKeys<ObjectLevelPermissions>,
): boolean => {
  const userRole = dataAccessLayer.useUserRole();

  const hasPermission = checkHasPermission<
    WithSignature<ObjectLevelPermissions>
  >({
    permissions: userRole?.object_level_permissions,
    path,
  });

  return hasPermission;
};

/**
 * Maps each insight to its required permission path(s)
 */
const INSIGHT_PERMISSIONS: { [key: string]: DeepKeys<ObjectLevelPermissions> } =
  {
    trial: "report.Payments.invoices.allowed_actions.read",
    recurring: "report.Club.subscription.allowed_actions.read",
  } as const;

export type InsightId = keyof typeof INSIGHT_PERMISSIONS;
export type InsightPermissions = Record<InsightId, boolean>;

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
 * Hook that returns permission state for all insights
 * Returns simple object: { trial: boolean, recurring: boolean }
 */
export const useInsightPermissions = () => {
  const trial = useTrialPermission();
  const recurring = useRecurringPermission();

  return { trial, recurring };
};
