import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';
import uniq from 'lodash/uniq';

import {
  fetchFranchiseActions,
  fetchFranchiseThemeActions,
  fetchFranchiseUsersActions,
  fetchFranchiseUserActions,
  listCompanyGroupActions,
  createOrUpdateCompanyGroupActions,
  themeUpdate,
  searchFranchiseUsersActions,
  fetchFranchiseUserPassesActions,
} from './actions';
import type {
  FranchiseCompany,
  FranchiseState,
  FranchiseUser,
  CompanyGroup,
  FranchiseUserPass,
} from './types';
import type { PaginatedResponse } from '#state/types';

const initialState: Immutable.Immutable<FranchiseState> =
  Immutable<FranchiseState>({
    error: false,
    // @ts-expect-error
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
      passes: {
        page: 1,
        next_page: null,
        count: 0,
        allIds: [],
        byId: {},
        loading: false,
        error: null,
      },
    },
  });

export default handleActions<Immutable.Immutable<FranchiseState>>(
  {
    // FRANCHISE
    [fetchFranchiseActions.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [fetchFranchiseActions.error.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [fetchFranchiseActions.success.toString()]: (state, { payload }: any) => {
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

    [fetchFranchiseThemeActions.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload).set('error', null);
    },
    [fetchFranchiseThemeActions.error.toString()]: (state, { payload }) => {
      return state.set('error', payload).set('loading', false);
    },
    [fetchFranchiseThemeActions.success.toString()]: (
      state,
      { payload }: any,
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

    [themeUpdate.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload).set('error', null);
    },
    [themeUpdate.error.toString()]: (state, { payload }) => {
      return state.set('error', payload).set('loading', false);
    },
    [themeUpdate.success.toString()]: (state, { payload }: any) => {
      return state
        .set('loading', false)
        .set('error', null)
        .set('franchisor', payload);
    },

    // USERS
    [fetchFranchiseUsersActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['users', 'loading'], payload).set('error', null);
    },
    [fetchFranchiseUsersActions.error.toString()]: (state, { payload }) => {
      return state.set('error', payload).set('loading', false);
    },
    [fetchFranchiseUsersActions.success.toString()]: (
      state: Immutable.Immutable<FranchiseState>,
      { payload }: any,
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
      { payload },
    ) => {
      return (
        state
          // @ts-expect-error
          .setIn(['companyGroup', 'byId', payload.id], payload)
          .setIn(
            ['companyGroup', 'allIds'],
            // @ts-expect-error
            [payload.id, ...state.companyGroup.allIds],
          )
      );
    },
    [listCompanyGroupActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['companyGroup', 'loading'], payload);
    },
    [listCompanyGroupActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['companyGroup', 'error'], payload);
    },
    [listCompanyGroupActions.success.toString()]: (
      state,
      // @ts-expect-error
      { payload }: Array<CompanyGroup>,
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
    [themeUpdate.error.toString()]: (state, { payload }) => {
      return state.set('error', payload).set('loading', false);
    },

    [fetchFranchiseUserActions.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload).set('error', null);
    },
    [fetchFranchiseUserActions.error.toString()]: (state, { payload }) => {
      return state.set('error', payload).set('loading', false);
    },
    [fetchFranchiseUserActions.success.toString()]: (
      state: Immutable.Immutable<FranchiseState>,
      { payload }: any,
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
      { payload },
    ) => {
      return state.setIn(['searchedUsers', 'previousURI'], payload);
    },
    [searchFranchiseUsersActions.isLoading.toString()]: (
      state: Immutable.Immutable<FranchiseState>,
      { payload },
    ) => {
      return state.setIn(['searchedUsers', 'loading'], payload);
    },
    [searchFranchiseUsersActions.error.toString()]: (
      state: Immutable.Immutable<FranchiseState>,
      { payload },
    ) => {
      return state.setIn(['searchedUsers', 'error'], payload);
    },
    [searchFranchiseUsersActions.success.toString()]: (
      state: Immutable.Immutable<FranchiseState>,
      { payload },
    ) => {
      return state.setIn(['searchedUsers', 'results'], payload);
    },

    // ---- User profile ----
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
        .merge(
          {
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
          },
          { deep: true },
        );
    },
  },
  initialState,
);
