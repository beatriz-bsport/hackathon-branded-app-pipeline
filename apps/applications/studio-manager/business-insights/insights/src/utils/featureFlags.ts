import { makeFeatureFlags } from "@bsport/sm-backbone";

export const { flags: InsightFlags, useFlag: useInsightFlag } =
  makeFeatureFlags({
    TRIAL_ANALYSIS: "insights_trial_analysis_page",
    SCHEDULE_ANALYSIS: "insights_schedule_analysis_page",
    BOOKING_INSIGHT: "insights_booking",
    COMMUNITY_HEALTH: "insights_community_health",
    FINANCIAL_COCKPIT: "insights_financial_cockpit",
    PASS_USAGE: "insights_pass_usage",
  } as const);

export type InsightFlagId = (typeof InsightFlags)[keyof typeof InsightFlags];
