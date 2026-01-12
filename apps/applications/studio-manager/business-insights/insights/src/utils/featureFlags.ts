import { makeFeatureFlags } from "@bsport/sm-backbone";

export const { flags: InsightFlags, useFlag: useInsightFlag } =
  makeFeatureFlags({
    TRIAL_ANALYSIS: "insights_trial_analysis_page",
    SCHEDULE_ANALYSIS: "insights_schedule_analysis_page",
  } as const);

export type InsightFlagId = (typeof InsightFlags)[keyof typeof InsightFlags];

export const useInsightFlagValues = (): Record<InsightFlagId, boolean> => {
  return {
    [InsightFlags.TRIAL_ANALYSIS]: useInsightFlag(InsightFlags.TRIAL_ANALYSIS),
    [InsightFlags.SCHEDULE_ANALYSIS]: useInsightFlag(
      InsightFlags.SCHEDULE_ANALYSIS,
    ),
  };
};
