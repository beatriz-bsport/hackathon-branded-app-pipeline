import SeamlessImmutable, { ImmutableObject } from 'seamless-immutable';
import type { FranchiseCompany } from '#src/libs/franchise/types';
import type { SmartList } from '#src/libs/smart-list/types';
import type {
  CompanyWithSmartList,
  CommunicationSentGroupConfig,
} from './types';

/**
 * Given a CommunicationSentGroupConfig object, this function finds the company associated with each smartlist
  within the campaign. It returns an array of objects, where each object contains a smartlist and the
  company that is associated with it (companiesWithSmartLists.)

  *@param {FranchiseCompany} companies - A list of all the companies related to the franchise
  *@param {SeamlessImmutable.ImmutableArray<SmartList>;[]} smartLists - A list of all the smartlist retrieved
  *@param {CommunicationSentGroupConfig} communicationSentGroupConfig - The selected communicationSentGroupConfig
  *@returns {CompanyWithSmartList[]} companiesWithSmartLists as needed
*/

export const getCompaniesWithSmartLists = (
  companies: FranchiseCompany[],
  smartLists: SeamlessImmutable.ImmutableArray<SmartList>,
  communicationSentGroupConfig: CommunicationSentGroupConfig,
): CompanyWithSmartList[] => {
  const companiesWithSmartLists = ((companies as FranchiseCompany[]) ?? []).map(
    (company: FranchiseCompany) => {
      const smartListAssociatedWithCompany = (smartLists ?? []).find(
        (smartList: SmartList) =>
          company.id === smartList.company &&
          communicationSentGroupConfig.smartlists.includes(smartList.id),
      )?.id;
      return {
        companyId: company.id,
        companyName: company.name,
        smartListId: smartListAssociatedWithCompany,
        toggleSend: !!smartListAssociatedWithCompany,
      };
    },
  );
  return companiesWithSmartLists;
};

// This function is helpful when using Fuse. The result of fuse.search has the type
// ```
// X[] | Fuse.FuseResultWithMatches<X>[] | Fuse.FuseResultWithScore<X>[] |
// (Fuse.FuseResultWithMatches<...> & Fuse.FuseResultWithScore<...>)[]
// ```
// according to TS (where X is the type of the items you give to the search),
// but it's actually never X[] directly, so this is used to make TS understand that.
// (thanks Teo Chaillou for that)
export function isNotCommunicationSentGroupConfigList<T extends Object[]>(
  object: T,
): object is Exclude<T, ImmutableObject<CommunicationSentGroupConfig>[]> {
  return object.length > 0 && 'item' in object[0];
}
