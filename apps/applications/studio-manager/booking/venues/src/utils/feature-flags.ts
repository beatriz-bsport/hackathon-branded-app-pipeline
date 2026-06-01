import { makeFeatureFlags } from "@bsport/sm-backbone";

const FEATURE_FLAGS = {
  venuesDetailsPage: "booking_venues_details_page",
} as const;

export const { flags, useFlag } = makeFeatureFlags(FEATURE_FLAGS);
