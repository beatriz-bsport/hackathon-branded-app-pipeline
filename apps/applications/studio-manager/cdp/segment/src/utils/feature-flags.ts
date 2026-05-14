import { getEnv } from "@bsport/envs";
import { makeFeatureFlags } from "@bsport/sm-backbone";

const FEATURE_FLAGS = {
  smartlist: "smartlist",
  prebuiltSegments: "prebuilt_segments",
} as const;

export type FlagName = (typeof flags)[keyof typeof flags];

const { flags, useFlag: useFeatureFlag } = makeFeatureFlags(FEATURE_FLAGS);

function useFlag(flag: FlagName) {
  const isEnabled = useFeatureFlag(flag);
  const isLocalEnv = import.meta.env.DEV || getEnv() === "local";

  return isLocalEnv ? true : isEnabled;
}

export { flags, useFlag };
