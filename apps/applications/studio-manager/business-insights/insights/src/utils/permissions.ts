import { checkHasPermission } from "@bsport/permissions";
import { dataAccessLayer, useFlagsStatus } from "@bsport/sm-backbone";

import { InsightFlags, useInsightFlag } from "#src/utils/featureFlags";

type InsightAccessRequirement = {
  permission: DeepKeys<ObjectLevelPermissions>;
  featureFlag?: (typeof InsightFlags)[keyof typeof InsightFlags];
};

/**
 * Single place to define access requirements for each insight page.
 * - `permission` controls backend/role access
 * - `featureFlag` (optional) controls rollout
 */
export const INSIGHT_ACCESS_REQUIREMENTS = {
  trial: {
    // Keep aligned with existing behavior (used by Trial + Recurring pages today)
    permission: "report.Club.subscription.allowed_actions.read",
    featureFlag: InsightFlags.TRIAL_ANALYSIS,
  },
  recurring: {
    permission: "report.Club.subscription.allowed_actions.read",
  },
  schedule: {
    permission: "report.Bookings.bookings.allowed_actions.read",
    featureFlag: InsightFlags.SCHEDULE_ANALYSIS,
  },
} as const satisfies Record<string, InsightAccessRequirement>;

export type InsightId = keyof typeof INSIGHT_ACCESS_REQUIREMENTS;
export type InsightPermissions = Record<InsightId, boolean>;
export type InsightAccess = Record<InsightId, boolean>;

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

  const isTrialAnalysisEnabled = useInsightFlag(InsightFlags.TRIAL_ANALYSIS);
  const isScheduleAnalysisEnabled = useInsightFlag(
    InsightFlags.SCHEDULE_ANALYSIS,
  );

  const hasPermissionForPath = (path: DeepKeys<ObjectLevelPermissions>) => {
    return checkHasPermission<WithSignature<ObjectLevelPermissions>>({
      permissions: userRole?.object_level_permissions,
      path,
    });
  };

  const permissions: InsightPermissions = {
    trial: hasPermissionForPath(INSIGHT_ACCESS_REQUIREMENTS.trial.permission),
    recurring: hasPermissionForPath(
      INSIGHT_ACCESS_REQUIREMENTS.recurring.permission,
    ),
    schedule: hasPermissionForPath(
      INSIGHT_ACCESS_REQUIREMENTS.schedule.permission,
    ),
  };

  const access: InsightAccess = {
    trial:
      permissions.trial &&
      (INSIGHT_ACCESS_REQUIREMENTS.trial.featureFlag
        ? flagsReady && isTrialAnalysisEnabled
        : true),
    recurring: permissions.recurring,
    schedule:
      permissions.schedule &&
      (INSIGHT_ACCESS_REQUIREMENTS.schedule.featureFlag
        ? flagsReady && isScheduleAnalysisEnabled
        : true),
  };

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
  const requiresFlag = "featureFlag" in requirement;

  return {
    isAllowed: access[insightId],
    isLoading: isLoadingPermissions || (requiresFlag && !flagsReady),
  };
};
