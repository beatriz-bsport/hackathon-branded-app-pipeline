import {
  type DeepKeys,
  type WithSignature,
  checkHasPermission,
} from "@bsport/permissions";
import {
  type ObjectLevelPermissions,
  dataAccessLayer,
  useFlagsStatus,
} from "@bsport/sm-backbone";

import {
  type InsightFlagId,
  InsightFlags,
  useInsightFlagValues,
} from "#src/utils/featureFlags";

type InsightAccessRequirement = {
  permission: DeepKeys<ObjectLevelPermissions>;
  featureFlag?: InsightFlagId;
};

/**
 * Single place to define access requirements for each insight page.
 * - `permission` controls backend/role access
 * - `featureFlag` (optional) controls rollout
 */
export const INSIGHT_ACCESS_REQUIREMENTS = {
  trial: {
    // Trial Analysis is gated by invoices read
    permission: "report.Payments.invoices.allowed_actions.read",
    featureFlag: InsightFlags.TRIAL_ANALYSIS,
  },
  recurring: {
    permission: "report.Club.subscription.allowed_actions.read",
    featureFlag: undefined,
  },
  schedule: {
    permission: "report.Bookings.bookings.allowed_actions.read",
    featureFlag: InsightFlags.SCHEDULE_ANALYSIS,
  },
} as const satisfies Record<string, InsightAccessRequirement>;

export type InsightId = keyof typeof INSIGHT_ACCESS_REQUIREMENTS;
type InsightBooleans = Record<InsightId, boolean>;
export type InsightPermissions = InsightBooleans;
export type InsightAccess = InsightBooleans;

/**
 * Computes access for each insight (permission + optional feature flag).
 * This avoids scattering permission/flag logic across pages and filters.
 */
export const useInsightAccess = (): {
  access: InsightAccess;
  permissions: InsightPermissions;
  isLoadingPermissions: boolean;
  flagsReady: boolean;
} => {
  const userRole = dataAccessLayer.useUserRole();
  const isLoadingPermissions = userRole === undefined;
  const { flagsReady } = useFlagsStatus();

  const insightFlagValues = useInsightFlagValues();

  const hasPermissionForPath = (path: DeepKeys<ObjectLevelPermissions>) => {
    return checkHasPermission<WithSignature<ObjectLevelPermissions>>({
      permissions: userRole?.object_level_permissions,
      path,
    });
  };

  const insightIds = Object.keys(INSIGHT_ACCESS_REQUIREMENTS) as InsightId[];

  const permissions = insightIds.reduce<InsightPermissions>(
    (acc, insightId) => {
      acc[insightId] = hasPermissionForPath(
        INSIGHT_ACCESS_REQUIREMENTS[insightId].permission,
      );
      return acc;
    },
    {} as InsightPermissions,
  );

  const access = insightIds.reduce<InsightAccess>((acc, insightId) => {
    const requirement = INSIGHT_ACCESS_REQUIREMENTS[insightId];
    const isEnabledByFlag = requirement.featureFlag
      ? flagsReady && insightFlagValues[requirement.featureFlag]
      : true;

    acc[insightId] = permissions[insightId] && isEnabledByFlag;
    return acc;
  }, {} as InsightAccess);

  return {
    access,
    permissions,
    isLoadingPermissions,
    flagsReady,
  };
};

/**
 * Convenience hook for pages: returns { isAllowed, isLoading } for a given insight.
 * Centralizes permission + flag gating per insight.
 */
export const useInsightGate = (
  insightId: InsightId,
): { isAllowed: boolean; isLoading: boolean } => {
  const { access, isLoadingPermissions, flagsReady } = useInsightAccess();
  const requirement = INSIGHT_ACCESS_REQUIREMENTS[insightId];
  const requiresFlag = Boolean(requirement.featureFlag);

  return {
    isAllowed: access[insightId],
    isLoading: isLoadingPermissions || (requiresFlag && !flagsReady),
  };
};
