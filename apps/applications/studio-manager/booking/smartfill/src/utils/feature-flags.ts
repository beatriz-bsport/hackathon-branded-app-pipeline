import { makeFeatureFlags } from "@bsport/sm-backbone";

const FEATURE_FLAGS = {
  smartfill: "smartfill_page",
} as const;

export const { flags, useFlag } = makeFeatureFlags(FEATURE_FLAGS);
