// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import { FranchiseState, FranchiseTheme } from './types';
import { getHexaColorFromNumbers } from './utils';
import { fetchFranchiseActions } from './actions';

const initialState: Immutable.Immutable<FranchiseState> = Immutable({
  error: false,
  loading: false,
  id: null,
  ownedCompanies: null,
  name: null,
  theme: {
    primaryRGB: undefined,
    secondaryRGB: undefined,
    cover: undefined,
  },
});

export default handleActions(
  {
    // ME
    [fetchFranchiseActions.isLoading]: (
      state: Immutable.Immutable<FranchiseState>,
    ) => {
      return state.set('loading', true).set('error', null);
    },
    [fetchFranchiseActions.error]: (
      state: Immutable.Immutable<FranchiseState>,
      data: { payload: { error: boolean } },
    ) => {
      const { error } = data.payload;

      return state.set('error', error).set('loading', false);
    },
    [fetchFranchiseActions.success]: (
      state: Immutable.Immutable<FranchiseState>,
      data: {
        payload: {
          item: FranchiseTheme & {
            id: number;
            name: string;
            companies: number[];
          };
        };
      },
    ) => {
      const { item } = data.payload;

      return state
        .set('loading', false)
        .set('error', null)
        .set('id', item.id)
        .set('name', item.name)
        .set('ownedCompanies', item.companies)
        .set('theme', {
          secondaryRGB: getHexaColorFromNumbers(item.secondaryRGB),
          primaryRGB: getHexaColorFromNumbers(item.primaryRGB),
          cover: item.cover,
        });
    },
  },
  initialState,
);
