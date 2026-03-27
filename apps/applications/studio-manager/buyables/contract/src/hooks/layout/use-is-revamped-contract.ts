import { NavFlags, useNavFlag } from "#src/utils/feature-flags";

export const useIsRevampedContract = () => {
  const isRevampedContractEnabled = useNavFlag(NavFlags.REVAMPED_CONTRACT);

  /**
   * @todo Add another condition related to the contract and its benefits
   */
  return isRevampedContractEnabled;
};
