import { makeFeatureFlags } from "@bsport/sm-backbone";

export const { flags: AggregatorFlags, useFlag: useAggregatorFlag } =
  makeFeatureFlags({
    BOOKING_ACTIVATE_NEW_WELLPASS_CONFIGURATION:
      "booking_activate_new_wellpass_configuration",
  });
