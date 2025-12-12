import { flags, useFlag } from "./feature-flags";

export const useSmartlistFlag = () => {
  return useFlag(flags.smartlist);
};
