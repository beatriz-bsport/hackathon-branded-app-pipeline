import { useMemo } from "react";

import type { DeepKeys } from "@bsport/permissions";
import type { ObjectLevelPermissions } from "@bsport/sm-backbone";

import {
  type InsightFlagId,
  InsightFlags,
  useInsightFlag,
} from "#src/utils/featureFlags";

export type InsightAccessRequirement = {
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

export const INSIGHT_IDS = Object.keys(
  INSIGHT_ACCESS_REQUIREMENTS,
) as InsightId[];

/**
 * Returns the enabled state of insight feature flags, keyed by InsightId.
 *
 * Hooks cannot be called dynamically (loops/conditionals), so flags are
 * explicitly subscribed here and then exposed as a memoized record.
 */
export const useInsightFlagValues = (): Partial<Record<InsightId, boolean>> => {
  const hasTrialAnalysis = useInsightFlag(InsightFlags.TRIAL_ANALYSIS);
  const hasScheduleAnalysis = useInsightFlag(InsightFlags.SCHEDULE_ANALYSIS);

  return useMemo(
    () =>
      ({
        trial: hasTrialAnalysis,
        schedule: hasScheduleAnalysis,
      }) satisfies Partial<Record<InsightId, boolean>>,
    [hasTrialAnalysis, hasScheduleAnalysis],
  );
};
