import { URLS } from "./urls";
import type { InsightsTranslationKeys } from "./utils/i18n";

/**
 * Dashboard types for the embedded analytics API
 */
export const DASHBOARD_TYPES = {
  TRIAL_ANALYSIS: "trial_analysis",
  RECURRING_REVENUE: "recurring_revenue",
  BOOKING_INSIGHT: "booking",
  SCHEDULE_ANALYSIS: "schedule_analysis",
  COMMUNITY_HEALTH: "community_health",
  FINANCIAL_COCKPIT: "financial_cockpit",
  PASS_USAGE: "pass_usage",
} as const;

type DashboardType = (typeof DASHBOARD_TYPES)[keyof typeof DASHBOARD_TYPES];

export const INSIGHT_SECTION = {
  COMMUNITY_MARKETING: "communityMarketing",
  FINANCIAL: "financial",
  OPERATIONS: "operations",
} as const;

type InsightSection = (typeof INSIGHT_SECTION)[keyof typeof INSIGHT_SECTION];

/**
 * Insight sections with their corresponding icons
 */
export const INSIGHT_SECTIONS = [
  { id: INSIGHT_SECTION.COMMUNITY_MARKETING, icon: "user-01" },
  { id: INSIGHT_SECTION.FINANCIAL, icon: "coins-stacked-01" },
  { id: INSIGHT_SECTION.OPERATIONS, icon: "calendar" },
] as const;

export type InsightRegistryItem = {
  id: string;
  section: InsightSection;
  dashboardType: DashboardType;
  link: string;
  titleKey: InsightsTranslationKeys;
};

/**
 * Available insight items with their section assignments and navigation links.
 * This is the single source of truth for all insights — routes and the list page
 * are built automatically from this registry.
 */
export const INSIGHT_REGISTRY: Array<InsightRegistryItem> = [
  {
    id: "trial",
    section: INSIGHT_SECTION.COMMUNITY_MARKETING,
    dashboardType: DASHBOARD_TYPES.TRIAL_ANALYSIS,
    link: URLS.TRIAL_ANALYSIS,
    titleKey: "pages.trialAnalysis.title",
  },
  {
    id: "community_health",
    section: INSIGHT_SECTION.COMMUNITY_MARKETING,
    dashboardType: DASHBOARD_TYPES.COMMUNITY_HEALTH,
    link: URLS.COMMUNITY_HEALTH,
    titleKey: "pages.communityHealth.title",
  },
  {
    id: "recurring",
    section: INSIGHT_SECTION.FINANCIAL,
    dashboardType: DASHBOARD_TYPES.RECURRING_REVENUE,
    link: URLS.RECURRING_REVENUE,
    titleKey: "pages.recurringRevenue.title",
  },
  {
    id: "booking",
    section: INSIGHT_SECTION.OPERATIONS,
    dashboardType: DASHBOARD_TYPES.BOOKING_INSIGHT,
    link: URLS.BOOKING_INSIGHT,
    titleKey: "pages.bookingInsight.title",
  },
  {
    id: "schedule",
    section: INSIGHT_SECTION.OPERATIONS,
    dashboardType: DASHBOARD_TYPES.SCHEDULE_ANALYSIS,
    link: URLS.SCHEDULE_ANALYSIS,
    titleKey: "pages.scheduleAnalysis.title",
  },
  {
    id: "financial_cockpit",
    section: INSIGHT_SECTION.FINANCIAL,
    dashboardType: DASHBOARD_TYPES.FINANCIAL_COCKPIT,
    link: URLS.FINANCIAL_COCKPIT,
    titleKey: "pages.financialCockpit.title",
  },
  {
    id: "pass_usage",
    section: INSIGHT_SECTION.OPERATIONS,
    dashboardType: DASHBOARD_TYPES.PASS_USAGE,
    link: URLS.PASS_USAGE,
    titleKey: "pages.passUsage.title",
  },
];
