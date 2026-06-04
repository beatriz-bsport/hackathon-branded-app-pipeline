import { makeFeatureFlags } from "@bsport/sm-backbone";

const FEATURE_FLAGS = {
  widgetsSettingsPage: "booking_widgets_settings_page",
};

export const { flags, useFlag } = makeFeatureFlags(FEATURE_FLAGS);
