export const PLAN_KEYS = ["start", "build", "engage", "elevate"] as const;

export type PlanKey = (typeof PLAN_KEYS)[number];

export type Feature = {
  id: string;
  label: string;
  includedIn: Record<PlanKey, boolean>;
};

export type MarketId = "DE" | "GB" | "FR" | "NL" | "IT" | "ES" | "OTHER";

export type Market = {
  id: MarketId;
  currency: "EUR" | "GBP";
  currencySymbol: string;
};

export const MARKETS: Record<MarketId, Market> = {
  DE: { id: "DE", currency: "EUR", currencySymbol: "€" },
  GB: { id: "GB", currency: "GBP", currencySymbol: "£" },
  FR: { id: "FR", currency: "EUR", currencySymbol: "€" },
  NL: { id: "NL", currency: "EUR", currencySymbol: "€" },
  IT: { id: "IT", currency: "EUR", currencySymbol: "€" },
  ES: { id: "ES", currency: "EUR", currencySymbol: "€" },
  OTHER: { id: "OTHER", currency: "EUR", currencySymbol: "€" },
};

export type Plan = {
  id: PlanKey;
  name: string;
  tagline: string;
  highlights: string[];
  pricePerMarket: Record<MarketId, number>;
  learnMoreUrl?: string;
};

export type PlanPageData = {
  plans: Plan[];
  features: Feature[];
  currentPlanId?: PlanKey;
  renewDate?: string;
  marketId: MarketId;
};
