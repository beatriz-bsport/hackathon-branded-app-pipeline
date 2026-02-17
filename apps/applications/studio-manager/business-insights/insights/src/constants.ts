import { URLS } from "./urls";

/**
 * Dashboard types for the embedded analytics API
 */
export const DASHBOARD_TYPES = {
  TRIAL_ANALYSIS: "trial_analysis",
  RECURRING_REVENUE: "recurring_revenue",
  SCHEDULE_ANALYSIS: "schedule_analysis",
  COMMUNITY_HEALTH: "community_health",
} as const;

/**
 * Insight sections with their corresponding icons
 */
export const INSIGHT_SECTIONS = [
  { id: "member", icon: "user-01" },
  { id: "financial", icon: "coins-stacked-01" },
  { id: "booking", icon: "calendar" },
  { id: "teacher", icon: "spacing-width-02" },
  { id: "marketing", icon: "announcement-01" },
] as const;

/**
 * Available insight items with their section assignments and navigation links
 */
export const INSIGHT_ITEMS = [
  {
    id: "trial",
    section: "member",
    dashboardType: DASHBOARD_TYPES.TRIAL_ANALYSIS,
    link: URLS.TRIAL_ANALYSIS,
  },
  {
    id: "community_health",
    section: "member",
    dashboardType: DASHBOARD_TYPES.COMMUNITY_HEALTH,
    link: URLS.COMMUNITY_HEALTH,
  },
  {
    id: "recurring",
    section: "financial",
    dashboardType: DASHBOARD_TYPES.RECURRING_REVENUE,
    link: URLS.RECURRING_REVENUE,
  },
  {
    id: "schedule",
    section: "booking",
    dashboardType: DASHBOARD_TYPES.SCHEDULE_ANALYSIS,
    link: URLS.SCHEDULE_ANALYSIS,
  },
] as const;
