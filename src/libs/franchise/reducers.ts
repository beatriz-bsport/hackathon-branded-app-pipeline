import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';
import uniq from 'lodash/uniq';

import type { PaginatedResponse } from '#src/state/types';
import {
  fetchFranchiseActions,
  fetchFranchiseThemeActions,
  fetchFranchiseUsersActions,
  fetchFranchiseUserActions,
  listCompanyGroupActions,
  createOrUpdateCompanyGroupActions,
  updateFranchiseThemeActions,
  searchFranchiseUsersActions,
  fetchFranchiseUserPassesActions,
  fetchFranchiseUserMembersActions,
  fetchFranchiseUserInfoActions,
  fetchReceivedSharedConsumerGiftcardsActions,
  fetchSentSharedConsumerGiftcardsActions,
} from '#src/libs/franchise/actions';

import type {
  FranchiseDetails,
  FranchiseCompany,
  FranchiseState,
  FranchiseUser,
  CompanyGroup,
  FranchiseUserPass,
  FranchiseUserMember,
  SharedConsumerGiftcard,
} from '#src/libs/franchise/types';

const initialState: Immutable.Immutable<FranchiseState> =
  Immutable<FranchiseState>({
    error: false,
    loading: false,
    franchisor: undefined,
    users: {
      page: 1,
      count: 0,
      allIds: [],
      byId: {},
      loading: false,
    },
    searchedUsers: {
      results: [],
      loading: false,
      error: null,
      previousURI: '',
    },
    companies: {
      byId: {},
      allIds: [],
    },
    companyGroup: {
      allIds: [],
      byId: {},
      loading: false,
      error: null,
    },
    userProfile: {
      generalInformation: {
        franchiseUser: {
          companies: [],
          company_member: {},
          email: null,
          id: null,
          name: null,
          phone: null,
          photo: null,
        },
        loading: false,
        error: null,
      },
      associatedMembers: {
        page: 1,
        next_page: null,
        count: 0,
        allIds: [],
        byId: {},
        loading: false,
        error: null,
      },
      passes: {
        page: 1,
        next_page: null,
        count: 0,
        allIds: [],
        byId: {},
        loading: false,
        error: null,
      },
      sharedConsumerGiftcards: {
        asReceiver: {
          allIds: [],
          byId: {},
          loading: false,
          error: null,
          count: 0,
          page: 1,
        },
        asSender: {
          allIds: [],
          byId: {},
          loading: false,
          error: null,
          count: 0,
          page: 1,
        },
      },
    },
  });

export default handleActions<Immutable.Immutable<FranchiseState>, any>(
  {
    // FRANCHISE
    [fetchFranchiseActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.set('loading', payload);
    },
    [fetchFranchiseActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.set('error', payload);
    },
    [fetchFranchiseActions.success.toString()]: (
      state,
      {
        payload,
      }: {
        payload: {
          franchisor: FranchiseDetails;
        };
      },
    ) => {
      const { franchisor } = payload;

      return state
        .set('loading', false)
        .set('error', null)
        .set('franchisor', franchisor)
        .setIn(
          ['companies', 'allIds'],
          franchisor.companies.map((company: FranchiseCompany) => company.id),
        )
        .merge(
          {
            companies: {
              byId: franchisor.companies.reduce(
                (
                  acc: Record<number, FranchiseCompany>,
                  company: FranchiseCompany,
                ) => {
                  acc[company.id] = company;
                  return acc;
                },
                {},
              ),
            },
          },
          { deep: true },
        );
    },

    [fetchFranchiseThemeActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.set('loading', payload).set('error', null);
    },
    [fetchFranchiseThemeActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.set('error', payload).set('loading', false);
    },
    [fetchFranchiseThemeActions.success.toString()]: (
      state,
      { payload }: { payload: { franchisor: FranchiseDetails } },
    ) => {
      const { franchisor } = payload;

      return state
        .set('loading', false)
        .set('error', null)
        .set('franchisor', franchisor)
        .setIn(
          ['companies', 'allIds'],
          franchisor.companies.map((company: FranchiseCompany) => company.id),
        )
        .merge(
          {
            companies: {
              byId: franchisor.companies.reduce(
                (
                  acc: Record<number, FranchiseCompany>,
                  company: FranchiseCompany,
                ) => {
                  acc[company.id] = company;
                  return acc;
                },
                {},
              ),
            },
          },
          { deep: true },
        );
    },

    [updateFranchiseThemeActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.set('loading', payload).set('error', null);
    },
    [updateFranchiseThemeActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.set('error', payload).set('loading', false);
    },
    [updateFranchiseThemeActions.success.toString()]: (
      state,
      { payload }: { payload: FranchiseDetails },
    ) => {
      return state
        .set('loading', false)
        .set('error', null)
        .set('franchisor', payload);
    },

    // USERS
    [fetchFranchiseUsersActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['users', 'loading'], payload).set('error', null);
    },
    [fetchFranchiseUsersActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.set('error', payload).set('loading', false);
    },
    [fetchFranchiseUsersActions.success.toString()]: (
      state: Immutable.Immutable<FranchiseState>,
      { payload }: { payload: PaginatedResponse<FranchiseUser> },
    ) => {
      const { page, count, results } = payload;

      return state
        .set('loading', false)
        .set('error', null)
        .setIn(['users', 'page'], page)
        .setIn(['users', 'count'], count)
        .setIn(
          ['users', 'allIds'],
          results.map((b: FranchiseUser) => b.id),
        )
        .merge(
          {
            users: {
              byId: results.reduce(
                (acc: Record<number, FranchiseUser>, user: FranchiseUser) => {
                  acc[user.id] = user;
                  return acc;
                },
                {},
              ),
            },
          },
          { deep: true },
        );
    },
    [createOrUpdateCompanyGroupActions.success.toString()]: (
      state,
      { payload }: { payload: CompanyGroup },
    ) => {
      return state
        .setIn(['companyGroup', 'byId', payload.id], payload)
        .setIn(
          ['companyGroup', 'allIds'],
          [payload.id, ...state.companyGroup.allIds],
        );
    },
    [listCompanyGroupActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['companyGroup', 'loading'], payload);
    },
    [listCompanyGroupActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['companyGroup', 'error'], payload);
    },
    [listCompanyGroupActions.success.toString()]: (
      state,
      { payload }: { payload: CompanyGroup[] },
    ) => {
      return state
        .setIn(
          ['companyGroup', 'allIds'],
          payload.map((b: CompanyGroup) => b.id),
        )
        .merge(
          {
            companyGroup: {
              byId: payload.reduce(
                (acc: Record<number, CompanyGroup>, cg: CompanyGroup) => {
                  acc[cg.id] = cg;
                  return acc;
                },
                {},
              ),
            },
          },
          { deep: true },
        );
    },

    [fetchFranchiseUserActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.set('loading', payload).set('error', null);
    },
    [fetchFranchiseUserActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.set('error', payload).set('loading', false);
    },
    [fetchFranchiseUserActions.success.toString()]: (
      state,
      {
        payload,
      }: {
        payload: {
          results: FranchiseUser;
          userId: number;
        };
      },
    ) => {
      const { userId, results } = payload;

      return state
        .set('loading', false)
        .set('error', null)
        .merge(
          {
            users: {
              byId: { [userId]: results },
            },
          },
          { deep: true },
        );
    },
    [searchFranchiseUsersActions.previousURI.toString()]: (
      state: Immutable.Immutable<FranchiseState>,
      { payload }: { payload: string },
    ) => {
      return state.setIn(['searchedUsers', 'previousURI'], payload);
    },
    [searchFranchiseUsersActions.isLoading.toString()]: (
      state: Immutable.Immutable<FranchiseState>,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['searchedUsers', 'loading'], payload);
    },
    [searchFranchiseUsersActions.error.toString()]: (
      state: Immutable.Immutable<FranchiseState>,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['searchedUsers', 'error'], payload);
    },
    [searchFranchiseUsersActions.success.toString()]: (
      state: Immutable.Immutable<FranchiseState>,
      { payload }: { payload: FranchiseUser[] },
    ) => {
      return state.setIn(['searchedUsers', 'results'], payload);
    },

    // ---- User profile ----
    // User general information
    [fetchFranchiseUserInfoActions.isLoading.toString()]: (
      state: Immutable.Immutable<FranchiseState>,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['userProfile', 'generalInformation', 'loading'],
        payload,
      );
    },
    [fetchFranchiseUserInfoActions.error.toString()]: (
      state: Immutable.Immutable<FranchiseState>,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['userProfile', 'generalInformation', 'error'],
        payload,
      );
    },
    [fetchFranchiseUserInfoActions.success.toString()]: (
      state: Immutable.Immutable<FranchiseState>,
      { payload }: { payload: FranchiseUser },
    ) => {
      return state.setIn(
        ['userProfile', 'generalInformation', 'franchiseUser'],
        payload,
      );
    },

    // User members
    [fetchFranchiseUserMembersActions.isLoading.toString()]: (
      state: Immutable.Immutable<FranchiseState>,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['userProfile', 'associatedMembers', 'loading'],
        payload,
      );
    },
    [fetchFranchiseUserMembersActions.error.toString()]: (
      state: Immutable.Immutable<FranchiseState>,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['userProfile', 'associatedMembers', 'error'],
        payload,
      );
    },
    [fetchFranchiseUserMembersActions.success.toString()]: (
      state: Immutable.Immutable<FranchiseState>,
      { payload }: { payload: PaginatedResponse<FranchiseUserMember> },
    ) => {
      const { page, next_page, count, results } = payload;

      return state
        .setIn(['userProfile', 'associatedMembers', 'page'], page)
        .setIn(['userProfile', 'associatedMembers', 'next_page'], next_page)
        .setIn(['userProfile', 'associatedMembers', 'count'], count)
        .setIn(
          ['userProfile', 'associatedMembers', 'allIds'],
          uniq((results || []).map((member) => member.id)),
        )
        .merge(
          {
            userProfile: {
              associatedMembers: {
                byId: results.reduce(
                  (acc: Record<number, FranchiseUserMember>, member) => {
                    acc[member.id] = member;
                    return acc;
                  },
                  {},
                ),
              },
            },
          },
          { deep: true },
        );
    },

    // User passes
    [fetchFranchiseUserPassesActions.isLoading.toString()]: (
      state: Immutable.Immutable<FranchiseState>,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['userProfile', 'passes', 'loading'], payload);
    },
    [fetchFranchiseUserPassesActions.error.toString()]: (
      state: Immutable.Immutable<FranchiseState>,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['userProfile', 'passes', 'error'], payload);
    },
    [fetchFranchiseUserPassesActions.success.toString()]: (
      state: Immutable.Immutable<FranchiseState>,
      { payload }: { payload: PaginatedResponse<FranchiseUserPass> },
    ) => {
      const { page, next_page, count, results } = payload;

      return state
        .setIn(['userProfile', 'passes', 'page'], page)
        .setIn(['userProfile', 'passes', 'next_page'], next_page)
        .setIn(['userProfile', 'passes', 'count'], count)
        .setIn(
          ['userProfile', 'passes', 'allIds'],
          uniq((results || []).map((pass) => pass.id)),
        )
        .merge({
          userProfile: {
            passes: {
              byId: results.reduce(
                (acc: Record<number, FranchiseUserPass>, pass) => {
                  acc[pass.id] = pass;
                  return acc;
                },
                {},
              ),
            },
          },
        });
    },
    // Consumer Giftcards
    [fetchReceivedSharedConsumerGiftcardsActions.isLoading.toString()]: (
      state: Immutable.Immutable<FranchiseState>,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['userProfile', 'sharedConsumerGiftcards', 'asReceiver', 'loading'],
        payload,
      );
    },
    [fetchReceivedSharedConsumerGiftcardsActions.error.toString()]: (
      state: Immutable.Immutable<FranchiseState>,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['userProfile', 'sharedConsumerGiftcards', 'asReceiver', 'error'],
        payload,
      );
    },
    [fetchReceivedSharedConsumerGiftcardsActions.success.toString()]: (
      state: Immutable.Immutable<FranchiseState>,
      { payload }: { payload: PaginatedResponse<SharedConsumerGiftcard> },
    ) => {
      const { results, page, count } = payload;

      return state
        .setIn(
          ['userProfile', 'sharedConsumerGiftcards', 'asReceiver', 'page'],
          page,
        )
        .setIn(
          ['userProfile', 'sharedConsumerGiftcards', 'asReceiver', 'count'],
          count,
        )
        .setIn(
          ['userProfile', 'sharedConsumerGiftcards', 'asReceiver', 'allIds'],
          results.map((giftcard: SharedConsumerGiftcard) => giftcard.id),
        )
        .merge(
          {
            userProfile: {
              sharedConsumerGiftcards: {
                asReceiver: {
                  byId: results.reduce(
                    (
                      acc: {
                        [consumerGiftcardId: number]: SharedConsumerGiftcard;
                      },
                      consumerGiftcard: SharedConsumerGiftcard,
                    ) => {
                      acc[consumerGiftcard.id] = consumerGiftcard;
                      return acc;
                    },
                    {},
                  ),
                },
              },
            },
          },
          { deep: true },
        );
    },
    [fetchSentSharedConsumerGiftcardsActions.isLoading.toString()]: (
      state: Immutable.Immutable<FranchiseState>,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['userProfile', 'sharedConsumerGiftcards', 'asSender', 'loading'],
        payload,
      );
    },
    [fetchSentSharedConsumerGiftcardsActions.error.toString()]: (
      state: Immutable.Immutable<FranchiseState>,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['userProfile', 'sharedConsumerGiftcards', 'asSender', 'error'],
        payload,
      );
    },
    [fetchSentSharedConsumerGiftcardsActions.success.toString()]: (
      state: Immutable.Immutable<FranchiseState>,
      { payload }: { payload: PaginatedResponse<SharedConsumerGiftcard> },
    ) => {
      const { results, page, count } = payload;

      return state
        .setIn(
          ['userProfile', 'sharedConsumerGiftcards', 'asSender', 'page'],
          page,
        )
        .setIn(
          ['userProfile', 'sharedConsumerGiftcards', 'asSender', 'count'],
          count,
        )
        .setIn(
          ['userProfile', 'sharedConsumerGiftcards', 'asSender', 'allIds'],
          results.map((giftcard: SharedConsumerGiftcard) => giftcard.id),
        )
        .merge(
          {
            userProfile: {
              sharedConsumerGiftcards: {
                asSender: {
                  byId: results.reduce(
                    (
                      acc: {
                        [consumerGiftcardId: number]: SharedConsumerGiftcard;
                      },
                      consumerGiftcard: SharedConsumerGiftcard,
                    ) => {
                      acc[consumerGiftcard.id] = consumerGiftcard;
                      return acc;
                    },
                    {},
                  ),
                },
              },
            },
          },
          { deep: true },
        );
    },
  },
  initialState,
);
