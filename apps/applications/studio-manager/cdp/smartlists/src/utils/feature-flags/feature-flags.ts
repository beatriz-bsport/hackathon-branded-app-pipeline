import { makeFeatureFlags } from "@bsport/sm-backbone";

const FEATURE_FLAGS = {
  smartlist: "smartlist",
} as const;

export const { flags, useFlag } = makeFeatureFlags(FEATURE_FLAGS);
