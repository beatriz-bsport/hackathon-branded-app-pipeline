import { makeFeatureFlags } from "@bsport/sm-backbone";

export const { flags: InsightFlags, useFlag: useInsightFlag } =
  makeFeatureFlags({
    TRIAL_ANALYSIS: "insights_trial_analysis_page",
  } as const);
