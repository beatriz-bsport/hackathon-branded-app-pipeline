// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  fetchFranchiseActions,
  fetchFranchiseThemeActions,
  fetchFranchiseUsersActions,
  fetchFranchiseUserActions,
  themeUpdate,
} from './actions';
import { FranchiseCompany, FranchiseState, FranchiseUser } from './types';

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
    },
    companies: {
      byId: {},
      allIds: [],
    },
  });

export default handleActions<Immutable.Immutable<FranchiseState>>(
  {
    // FRANCHISE
    [fetchFranchiseActions.isLoading.toString()]: (state, payload) => {
      return state.set('loading', payload).set('error', null);
    },
    [fetchFranchiseActions.error.toString()]: (state, payload) => {
      return state.set('error', payload).set('loading', false);
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

    [fetchFranchiseThemeActions.isLoading.toString()]: (state, payload) => {
      return state.set('loading', payload).set('error', null);
    },
    [fetchFranchiseThemeActions.error.toString()]: (state, payload) => {
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

    [themeUpdate.isLoading.toString()]: (state, payload) => {
      return state.set('loading', payload).set('error', null);
    },
    [themeUpdate.error.toString()]: (state, payload) => {
      return state.set('error', payload).set('loading', false);
    },
    [themeUpdate.success.toString()]: (state, { payload }: any) => {
      return state
        .set('loading', false)
        .set('error', null)
        .set('franchisor', payload);
    },

    // USERS
    [fetchFranchiseUsersActions.isLoading.toString()]: (state, payload) => {
      return state.set('loading', payload).set('error', null);
    },
    [fetchFranchiseUsersActions.error.toString()]: (state, payload) => {
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

    [fetchFranchiseUserActions.isLoading.toString()]: (state, payload) => {
      return state.set('loading', payload).set('error', null);
    },
    [fetchFranchiseUserActions.error.toString()]: (state, payload) => {
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
  },
  initialState,
);
