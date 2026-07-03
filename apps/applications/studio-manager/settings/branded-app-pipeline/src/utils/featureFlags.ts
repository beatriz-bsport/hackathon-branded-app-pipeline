import { makeFeatureFlags } from "@bsport/sm-backbone";

export const {
  flags: BrandedAppPipelineFlags,
  useFlag: useBrandedAppPipelineFlag,
} = makeFeatureFlags({
  ONBOARDING_TRACKER: "settings_branded_app_pipeline_onboarding_tracker",
});
