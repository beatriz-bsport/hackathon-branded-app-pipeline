import { makeFeatureFlags } from "@bsport/sm-backbone";

export const { flags: ClassFlags, useFlag: useClassFlag } = makeFeatureFlags({
  CLASSES_MERGED_VIEW: "booking_classes_merged_view",
} as const);
