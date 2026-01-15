import { useCallback, useMemo } from "react";

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
  INSIGHT_ACCESS_REQUIREMENTS,
  INSIGHT_IDS,
  type InsightId,
  useInsightFlagValues,
} from "#src/utils/insightAccessRequirements";

export type { InsightId } from "#src/utils/insightAccessRequirements";

type InsightBooleans = Record<InsightId, boolean>;
export type InsightPermissions = InsightBooleans;
export type InsightAccess = InsightBooleans;

/**
 * Computes access for each insight (permission + optional feature flag).
 * This avoids scattering permission/flag logic across pages and filters.
 */
export const useInsightAccess = (): InsightAccess => {
  const userRole = dataAccessLayer.useUserRole();
  const { flagsReady } = useFlagsStatus();
  const flags = useInsightFlagValues();

  const objectLevelPermissions = userRole?.object_level_permissions;

  const getHasPermission = useCallback(
    (path: DeepKeys<ObjectLevelPermissions>) => {
      return checkHasPermission<WithSignature<ObjectLevelPermissions>>({
        permissions: objectLevelPermissions,
        path,
      });
    },
    [objectLevelPermissions],
  );

  return useMemo(() => {
    return INSIGHT_IDS.reduce<InsightAccess>((acc, insightId) => {
      const requirement = INSIGHT_ACCESS_REQUIREMENTS[insightId];

      const isFeatureEnabled = requirement.featureFlag
        ? Boolean(flags[insightId]) && flagsReady
        : true;

      const hasPermission = getHasPermission(requirement.permission);

      acc[insightId] = isFeatureEnabled && hasPermission;

      return acc;
    }, {} as InsightAccess);
  }, [flags, flagsReady, getHasPermission]);
};

/**
 * Convenience hook for pages: returns { isAllowed, isLoading } for a given insight.
 * Centralizes permission + flag gating per insight.
 */
export const useInsightGate = (
  insightId: InsightId,
): { isAllowed: boolean; isLoading: boolean } => {
  const userRole = dataAccessLayer.useUserRole();
  const { flagsReady } = useFlagsStatus();
  const flags = useInsightFlagValues();

  const requirement = INSIGHT_ACCESS_REQUIREMENTS[insightId];
  const requiresFlag = Boolean(requirement.featureFlag);
  const isFeatureEnabled = requiresFlag ? Boolean(flags[insightId]) : true;

  const hasPermission = checkHasPermission<
    WithSignature<ObjectLevelPermissions>
  >({
    permissions: userRole?.object_level_permissions,
    path: requirement.permission,
  });

  return {
    isAllowed:
      hasPermission && (requiresFlag ? flagsReady && isFeatureEnabled : true),
    isLoading: requiresFlag && !flagsReady,
  };
};
