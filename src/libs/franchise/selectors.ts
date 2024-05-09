import { createSelector } from 'reselect';
import memoize from 'memoize-one';
import Immutable from 'seamless-immutable';
// @ts-expect-error
import { OWNER_ROLE, ADMIN_ROLE } from '#src/libs/role/role-types';
import { sortCompanyListByIsAllowedAndName } from '#src/libs/franchise/utils';
import { RootState } from '#src/reducers';
import type {
  FranchiseCompany,
  FranchiseState,
} from '#src/libs/franchise/types';

const getState = (state: RootState): FranchiseState => state.franchise;

type FranchiseCompanyWithAllowed =
  | Immutable.ImmutableArray<FranchiseCompany & { isAllowed: boolean }>
  | (FranchiseCompany & { isAllowed: boolean })
  | [];

// Franchise

export const getFranchiseId = (state: RootState) => {
  if (getState(state)?.franchisor?.id) {
    return getState(state)?.franchisor?.id;
  }
  return null;
};

export const getFranchisor = (state: RootState) => {
  if (getState(state)?.franchisor) {
    return getState(state)?.franchisor;
  }
  return null;
};

export const getFranchisorCompaniesAvailableOnMarketplace = (
  state: RootState,
) => {
  if (getState(state)?.franchisor) {
    return (getState(state)?.franchisor?.companies ?? []).filter(
      (company) => !!company && !company.hidden_from_marketplace,
    );
  }
  return [];
};

export const getFranchiseTheme = (state: RootState) => {
  if (getState(state)?.franchisor) {
    return {
      cover: getState(state)?.franchisor.cover,
      primaryRGB: getState(state)?.franchisor.primaryRGB,
      secondaryRGB: getState(state)?.franchisor.secondaryRGB,
    };
  }
  return null;
};

export const getFranchiseThemeLoading = (state: RootState) => {
  if (getState(state)?.franchisor) {
    return getState(state).loading;
  }
  return null;
};

export const getAllowedFranchisees = (state: RootState) => {
  if ([OWNER_ROLE, ADMIN_ROLE].includes(state.auth.franchise_role_identifier)) {
    return [];
  }
  return state.auth.allowed_franchisees;
};

export const withAllowed = memoize(
  (
    companies: number | number[],
    allowed_franchisee_ids: number[],
    companyById: Record<number, FranchiseCompany>,
  ): FranchiseCompanyWithAllowed => {
    if (!companies) return null;
    if (Array.isArray(companies)) {
      return sortCompanyListByIsAllowedAndName(
        companies
          .filter((id: number) => !!companyById?.[id])
          .map((id: number) => ({
            ...companyById?.[id],
            isAllowed:
              allowed_franchisee_ids?.length === 0 ||
              allowed_franchisee_ids.includes(id),
          })),
      );
    }

    if (!companyById?.[companies]) return null;

    return {
      ...companyById?.[companies],
      isAllowed:
        !allowed_franchisee_ids?.length ||
        allowed_franchisee_ids.includes(companies),
    };
  },
);

// Users

export const getFranchiseUserPage = (state: RootState) => {
  if (getState(state).users?.page) {
    return getState(state).users?.page;
  }
  return null;
};

export const getFranchiseUserCount = (state: RootState) => {
  if (getState(state).users?.count) {
    return getState(state).users?.count;
  }
  return null;
};

export const getFranchiseUsers = (state: RootState) => {
  if (getState(state).users?.allIds) {
    const byId = getState(state).users?.byId ?? {};
    return getState(state).users?.allIds.map((id) => byId[id]);
  }
  return [];
};

export const withAllowedFranchisees = memoize((selector) =>
  createSelector(
    [selector, getAllowedFranchisees, getFranchiseCompanyById],
    (objects, allowed_franchisee_ids, companyById) => {
      if (!objects) return null;
      if (!Array.isArray(objects)) {
        return {
          ...objects,
          companies: withAllowed(
            objects.companies || [],
            allowed_franchisee_ids,
            companyById,
          ),
        };
      }
      return objects.map((obj) => ({
        ...obj,
        companies: withAllowed(
          obj.companies || [],
          allowed_franchisee_ids,
          companyById,
        ),
      }));
    },
  ),
);

export const getFranchiseUserById = (state: RootState, userId: number) => {
  return getState(state).users?.byId?.[userId];
};

export const getFranchiseIsLoading = (state: RootState) => {
  return getState(state).loading;
};

// Companies
export const getFranchiseCompanyById = (state: RootState) => {
  if (getState(state).companies?.byId) {
    return getState(state).companies?.byId ?? null;
  }
  return null;
};

export const getFranchiseCompany = (companyId: number) =>
  createSelector(
    [getFranchiseCompanyById],
    (companiesById) => companiesById[companyId],
  );

// @ts-expect-error
export const getFranchiseCompanies = (state: RootState) => {
  if (getState(state).companies?.allIds) {
    const companies = getState(state).companies?.allIds;
    return withAllowed(
      companies,
      getAllowedFranchisees(state),
      getFranchiseCompanyById(state),
    );
  }
  return [];
};

export const getAllowedFranchiseCompanies = (state: RootState) => {
  const companies = getFranchiseCompanies(state);
  if (Array.isArray(companies)) {
    return companies.filter((c: FranchiseCompany) => c.isAllowed);
  }
  return [companies].filter((c: FranchiseCompany) => c.isAllowed);
};

export const getAllFranchiseCompanies = (
  state: RootState,
): FranchiseCompanyWithAllowed => {
  if (getState(state).companies?.allIds) {
    const companies = getState(state).companies?.allIds;
    return withAllowed(companies, [], getFranchiseCompanyById(state));
  }
  return [];
};

export const _getCompanyGroupById = (state: RootState) =>
  getState(state).companyGroup.byId;

export const _getCompanyGroupAllIds = (state: RootState) =>
  getState(state).companyGroup.allIds;

export const getCompanyGroupList = createSelector(
  [_getCompanyGroupAllIds, _getCompanyGroupById],
  (ids, data) => ids.map((id) => data[id]),
);

export const getFranchiseUserInfo = (state: RootState) =>
  getState(state).userProfile.generalInformation.franchiseUser;

export const getFranchiseUserMembersLoading = (state: RootState) =>
  getState(state).userProfile.associatedMembers.loading;

export const getFranchiseUserMembersCount = (state: RootState) =>
  getState(state).userProfile.associatedMembers.count;

export const getFranchiseUserMembersPage = (state: RootState) =>
  getState(state).userProfile.associatedMembers.page;

export const _getFranchiseUserMembersById = (state: RootState) =>
  getState(state).userProfile.associatedMembers.byId;

export const _getFranchiseUserMembersAllIds = (state: RootState) =>
  getState(state).userProfile.associatedMembers.allIds;

/** Selector to get the list of the Members related to a User in a Franchise */
export const getFranchiseUserMembersList = createSelector(
  [_getFranchiseUserMembersAllIds, _getFranchiseUserMembersById],
  (membersIds, membersData) =>
    (membersIds ?? [])
      .map((memberId) => membersData[memberId])
      .filter((member) => !!member),
);

export const _getFranchiseUserPassesById = (state: RootState) =>
  getState(state).userProfile.passes.byId;

export const _getFranchiseUserPassesAllIds = (state: RootState) =>
  getState(state).userProfile.passes.allIds;

export const getFranchiseUserPassesList = createSelector(
  [_getFranchiseUserPassesAllIds, _getFranchiseUserPassesById],
  (passesIds, passesData) =>
    (passesIds ?? [])
      .map((passId) => passesData[passId])
      .filter((pass) => !!pass),
);
const _getSentSharedConsumerGiftcardsById = (state: RootState) =>
  getState(state).userProfile.sharedConsumerGiftcards.asSender.byId;

const _getSentSharedConsumerGiftcardsAllIds = (state: RootState) =>
  getState(state).userProfile.sharedConsumerGiftcards.asSender.allIds;

export const getSentSharedConsumerGiftcardList = createSelector(
  [_getSentSharedConsumerGiftcardsAllIds, _getSentSharedConsumerGiftcardsById],
  (ids, data) => ids.map((id) => data[id]),
);

const _getReceivedSharedConsumerGiftcardsById = (state: RootState) =>
  getState(state).userProfile.sharedConsumerGiftcards.asReceiver.byId;

export const getReceivedSharedConsumerGiftcardsAllIds = (state: RootState) =>
  getState(state).userProfile.sharedConsumerGiftcards.asReceiver.allIds;

export const getReceivedSharedConsumerGiftcardList = createSelector(
  [
    getReceivedSharedConsumerGiftcardsAllIds,
    _getReceivedSharedConsumerGiftcardsById,
  ],
  (ids, data) => ids.map((id) => data[id]),
);
export const getAllDistinctGiftcardIds = createSelector(
  [
    _getSentSharedConsumerGiftcardsAllIds,
    _getSentSharedConsumerGiftcardsById,
    getReceivedSharedConsumerGiftcardsAllIds,
    _getReceivedSharedConsumerGiftcardsById,
  ],
  (
    sentSharedConsumerGiftcardAllIds,
    sentSharedConsumerGiftcards,
    receivedSharedConsumerGiftcardAllIds,
    receivedSharedConsumerGiftcards,
  ) => {
    const allGiftcardIds = [
      ...sentSharedConsumerGiftcardAllIds,
      ...receivedSharedConsumerGiftcardAllIds,
    ]
      .map(
        (id) =>
          sentSharedConsumerGiftcards[id]?.giftcard ||
          receivedSharedConsumerGiftcards[id]?.giftcard,
      )
      .filter(Boolean);
    return Immutable([...new Set(allGiftcardIds)]);
  },
);

export const getAllDistinctMemberIds = createSelector(
  [
    _getSentSharedConsumerGiftcardsAllIds,
    _getSentSharedConsumerGiftcardsById,
    getReceivedSharedConsumerGiftcardsAllIds,
    _getReceivedSharedConsumerGiftcardsById,
  ],
  (
    sentSharedConsumerGiftcardAllIds,
    sentSharedConsumerGiftcards,
    receivedSharedConsumerGiftcardAllIds,
    receivedSharedConsumerGiftcards,
  ) => {
    const allSharedConsumerGiftcardIds = [
      ...sentSharedConsumerGiftcardAllIds,
      ...receivedSharedConsumerGiftcardAllIds,
    ];
    const allMemberIds = allSharedConsumerGiftcardIds
      .flatMap((id) => {
        const sentSharedConsumerGiftcard = sentSharedConsumerGiftcards[id];
        const receivedSharedConsumerGiftcard =
          receivedSharedConsumerGiftcards[id];
        const members = [];
        if (sentSharedConsumerGiftcard) {
          members.push(
            sentSharedConsumerGiftcard.src_member,
            sentSharedConsumerGiftcard.dst_member,
          );
        }
        if (receivedSharedConsumerGiftcard) {
          members.push(
            receivedSharedConsumerGiftcard.src_member,
            receivedSharedConsumerGiftcard.dst_member,
          );
        }
        return members;
      })
      .filter(Boolean);
    return Immutable([...new Set(allMemberIds)]);
  },
);

export const getAllDistinctInvoiceIds = createSelector(
  [
    _getSentSharedConsumerGiftcardsAllIds,
    _getSentSharedConsumerGiftcardsById,
    getReceivedSharedConsumerGiftcardsAllIds,
    _getReceivedSharedConsumerGiftcardsById,
  ],
  (
    sentSharedConsumerGiftcardAllIds,
    sentSharedConsumerGiftcards,
    receivedSharedConsumerGiftcardAllIds,
    receivedSharedConsumerGiftcards,
  ) => {
    const allInvoiceIds = [
      ...sentSharedConsumerGiftcardAllIds,
      ...receivedSharedConsumerGiftcardAllIds,
    ]
      .map(
        (id) =>
          sentSharedConsumerGiftcards[id]?.invoice_id ||
          receivedSharedConsumerGiftcards[id]?.invoice_id,
      )
      .filter(Boolean);
    return Immutable([...new Set(allInvoiceIds)]);
  },
);

export const getSharedConsumerGiftcardById = (state: RootState, id: number) => {
  return (
    getState(state).userProfile.sharedConsumerGiftcards.asSender.byId[id] ||
    getState(state).userProfile.sharedConsumerGiftcards.asReceiver.byId[id]
  );
};
