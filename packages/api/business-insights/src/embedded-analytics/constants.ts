import { API_V1_URL } from "#src/constants";

export const API_V1_URL_EMBEDDED_ANALYTICS = `${API_V1_URL}/embedded_analytics`;

export const DASHBOARD_TYPES = {
  HOME_KEY_METRICS: "home_key_metrics",
  HOME_INSIGHTS_PANEL: "home_insights_panel",
  TRIAL_ANALYSIS: "trial_analysis",
  RECURRING_REVENUE: "recurring_revenue",
  BOOKING: "booking",
  SCHEDULE_ANALYSIS: "schedule_analysis",
  COMMUNITY_HEALTH: "community_health",
  FINANCIAL_COCKPIT: "financial_cockpit",
  PASS_USAGE: "pass_usage",
} as const;
