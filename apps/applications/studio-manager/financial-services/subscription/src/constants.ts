import type { Feature, Plan } from "#src/types/plan";
import type { TFunction } from "#src/utils/i18n";

type RawPlan = Omit<Plan, "name" | "tagline" | "highlights"> & {
  nameKey: Parameters<TFunction>[0];
  taglineKey: Parameters<TFunction>[0];
  highlightKeys: Parameters<TFunction>[0][];
};
type RawFeature = Omit<Feature, "label"> & {
  labelKey: Parameters<TFunction>[0];
};

export const RAW_PLANS = [
  {
    id: "start",
    nameKey: "plan.plans.start.name",
    taglineKey: "plan.plans.start.tagline",
    highlightKeys: [
      "plan.plans.start.highlights.0",
      "plan.plans.start.highlights.1",
      "plan.plans.start.highlights.2",
    ],
    pricePerMarket: {
      DE: 169,
      GB: 129,
      FR: 149,
      NL: 149,
      IT: 139,
      ES: 139,
      OTHER: 149,
    },
  },
  {
    id: "build",
    nameKey: "plan.plans.build.name",
    taglineKey: "plan.plans.build.tagline",
    highlightKeys: [
      "plan.plans.build.highlights.0",
      "plan.plans.build.highlights.1",
      "plan.plans.build.highlights.2",
      "plan.plans.build.highlights.3",
      "plan.plans.build.highlights.4",
      "plan.plans.build.highlights.5",
    ],
    pricePerMarket: {
      DE: 259,
      GB: 209,
      FR: 229,
      NL: 229,
      IT: 209,
      ES: 209,
      OTHER: 229,
    },
    learnMoreUrl: "https://app.arcade.software/share/LyY5B0LZneBnCkqMa4ea",
  },
  {
    id: "engage",
    nameKey: "plan.plans.engage.name",
    taglineKey: "plan.plans.engage.tagline",
    highlightKeys: [
      "plan.plans.engage.highlights.0",
      "plan.plans.engage.highlights.1",
      "plan.plans.engage.highlights.2",
      "plan.plans.engage.highlights.3",
      "plan.plans.engage.highlights.4",
      "plan.plans.engage.highlights.5",
    ],
    pricePerMarket: {
      DE: 359,
      GB: 299,
      FR: 319,
      NL: 319,
      IT: 289,
      ES: 289,
      OTHER: 319,
    },
    learnMoreUrl: "https://app.arcade.software/share/IwIH09MZ9rnuuYB6yLOS",
  },
  {
    id: "elevate",
    nameKey: "plan.plans.elevate.name",
    taglineKey: "plan.plans.elevate.tagline",
    highlightKeys: [
      "plan.plans.elevate.highlights.0",
      "plan.plans.elevate.highlights.1",
      "plan.plans.elevate.highlights.2",
      "plan.plans.elevate.highlights.3",
      "plan.plans.elevate.highlights.4",
      "plan.plans.elevate.highlights.5",
      "plan.plans.elevate.highlights.6",
    ],
    pricePerMarket: {
      DE: 449,
      GB: 379,
      FR: 399,
      NL: 399,
      IT: 369,
      ES: 369,
      OTHER: 399,
    },
    learnMoreUrl: "https://app.arcade.software/share/NsARX50a0THToah7M2IF",
  },
] as const satisfies RawPlan[];

export const RAW_FEATURES = [
  {
    id: "platform",
    labelKey: "plan.features.platform",
    includedIn: { start: false, build: true, engage: true, elevate: true },
  },
  {
    id: "stripe-terminal",
    labelKey: "plan.features.stripe-terminal",
    includedIn: { start: true, build: true, engage: true, elevate: true },
  },
  {
    id: "digital-pack",
    labelKey: "plan.features.digital-pack",
    includedIn: { start: false, build: true, engage: true, elevate: true },
  },
  {
    id: "communication-pack",
    labelKey: "plan.features.communication-pack",
    includedIn: { start: false, build: true, engage: true, elevate: true },
  },
  {
    id: "integration-pack",
    labelKey: "plan.features.integration-pack",
    includedIn: { start: false, build: true, engage: true, elevate: true },
  },
  {
    id: "branded-app",
    labelKey: "plan.features.branded-app",
    includedIn: { start: false, build: false, engage: true, elevate: true },
  },
  {
    id: "add-guest",
    labelKey: "plan.features.add-guest",
    includedIn: { start: false, build: false, engage: true, elevate: true },
  },
  {
    id: "fast-payouts",
    labelKey: "plan.features.fast-payouts",
    includedIn: { start: false, build: false, engage: true, elevate: true },
  },
  {
    id: "access-monitoring",
    labelKey: "plan.features.access-monitoring",
    includedIn: { start: false, build: false, engage: true, elevate: true },
  },
  {
    id: "check-in-tablet",
    labelKey: "plan.features.check-in-tablet",
    includedIn: { start: false, build: false, engage: true, elevate: true },
  },
  {
    id: "subteacher-tool",
    labelKey: "plan.features.subteacher-tool",
    includedIn: { start: false, build: false, engage: false, elevate: true },
  },
  {
    id: "audience",
    labelKey: "plan.features.audience",
    includedIn: { start: false, build: false, engage: false, elevate: true },
  },
  {
    id: "clock-in-out",
    labelKey: "plan.features.clock-in-out",
    includedIn: { start: false, build: false, engage: false, elevate: true },
  },
  {
    id: "spot-scheduling",
    labelKey: "plan.features.spot-scheduling",
    includedIn: { start: false, build: false, engage: false, elevate: true },
  },
  {
    id: "autotag-rules",
    labelKey: "plan.features.autotag-rules",
    includedIn: { start: false, build: false, engage: false, elevate: true },
  },
  {
    id: "insights-financial",
    labelKey: "plan.features.insights-financial",
    includedIn: { start: true, build: true, engage: true, elevate: true },
  },
  {
    id: "insights-bookings",
    labelKey: "plan.features.insights-bookings",
    includedIn: { start: true, build: true, engage: true, elevate: true },
  },
  {
    id: "insights-subs",
    labelKey: "plan.features.insights-subs",
    includedIn: { start: false, build: true, engage: true, elevate: true },
  },
  {
    id: "insights-scheduling",
    labelKey: "plan.features.insights-scheduling",
    includedIn: { start: false, build: true, engage: true, elevate: true },
  },
  {
    id: "insights-teachers",
    labelKey: "plan.features.insights-teachers",
    includedIn: { start: false, build: true, engage: true, elevate: true },
  },
  {
    id: "insights-acquisition",
    labelKey: "plan.features.insights-acquisition",
    includedIn: { start: false, build: true, engage: true, elevate: true },
  },
  {
    id: "insights-staff",
    labelKey: "plan.features.insights-staff",
    includedIn: { start: false, build: false, engage: true, elevate: true },
  },
  {
    id: "insights-visits",
    labelKey: "plan.features.insights-visits",
    includedIn: { start: false, build: false, engage: true, elevate: true },
  },
  {
    id: "insights-retention",
    labelKey: "plan.features.insights-retention",
    includedIn: { start: false, build: false, engage: true, elevate: true },
  },
  {
    id: "insights-marketing",
    labelKey: "plan.features.insights-marketing",
    includedIn: { start: false, build: false, engage: true, elevate: true },
  },
  {
    id: "insights-franchise",
    labelKey: "plan.features.insights-franchise",
    includedIn: { start: false, build: false, engage: false, elevate: true },
  },
] as const satisfies RawFeature[];
