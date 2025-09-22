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
 */
export const useObjectLevelPermission = (
  path: DeepKeys<ObjectLevelPermissions>,
) => {
  const userRole = dataAccessLayer.useUserRole();
  return checkHasPermission<WithSignature<ObjectLevelPermissions>>({
    permissions: userRole?.object_level_permissions,
    path,
  });
};

/**
 * Checks if the user has permission to view subscription invoices reports
 * This determines if the Recurring Revenue insight page should be accessible
 */
export const useHasSubscriptionInvoicesPermission = (): boolean => {
  return useObjectLevelPermission(
    "report.Club.subscription.allowed_actions.read",
  );
};
