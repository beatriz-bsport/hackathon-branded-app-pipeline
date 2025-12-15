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
 * Checks if the user has permission to view subscription invoices reports
 * This determines if the Recurring Revenue insight page should be accessible
 * Returns an object with hasPermission (boolean) and isLoading (boolean)
 */
export const useHasSubscriptionInvoicesPermission = (): {
  hasPermission: boolean;
  isLoading: boolean;
} => {
  return useObjectLevelPermission(
    "report.Club.subscription.allowed_actions.read",
  );
};

/**
 * Checks if the user has permission to view bookings reports (group sessions)
 * This determines if the Schedule Analysis insight page should be accessible
 * Returns an object with hasPermission (boolean) and isLoading (boolean)
 */
export const useHasBookingsPermission = (): {
  hasPermission: boolean;
  isLoading: boolean;
} => {
  return useObjectLevelPermission(
    "report.Bookings.bookings.allowed_actions.read",
  );
};
