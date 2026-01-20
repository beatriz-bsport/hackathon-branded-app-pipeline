import { makeFeatureFlags } from "@bsport/sm-backbone";

const FEATURE_FLAGS = {
  smartlist: "smartlist",
} as const;

export type FlagName = (typeof flags)[keyof typeof flags];

const { flags, useFlag: useFeatureFlag } = makeFeatureFlags(FEATURE_FLAGS);

function useFlag(flag: FlagName) {
  const isEnabled = useFeatureFlag(flag);
  const isLocalEnv = import.meta.env.DEV;

  return isLocalEnv ? true : isEnabled;
}

export { flags, useFlag };
