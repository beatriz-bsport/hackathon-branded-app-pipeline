import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import uniq from 'lodash/uniq';
import {
  fetchLevelListActions,
  fetchLevelActions,
  updateLevelActions,
  createLevelActions,
  deleteLevelActions,
  resetAction,
  fetchLevelBulkActions,
} from './actions';
import { Level, LevelState } from './types';

const initialState: Immutable.Immutable<LevelState> = Immutable<LevelState>({
  error: null,
  loading: false,
  byId: {},
  allIds: [],
});

export default handleActions<Immutable.Immutable<LevelState>>(
  {
    [fetchLevelListActions.loading.toString()]: (state, { payload }) =>
      state.set('loading', payload),
    [fetchLevelListActions.error.toString()]: (state, { payload }) =>
      state.set('error', payload),
    [fetchLevelListActions.success.toString()]: (state, { payload }) =>
      state
        .merge(
          {
            // @ts-expect-error
            byId: payload.reduce((acc: any, l: Level) => {
              acc[l.id] = l;
              return acc;
            }, {}),
          },
          { deep: true },
        )
        .setIn(
          ['allIds'],
          // @ts-expect-error
          payload.map((l: Level) => l.id),
        ),
    [fetchLevelBulkActions.loading.toString()]: (state, { payload }) =>
      state.set('loading', payload),
    [fetchLevelBulkActions.error.toString()]: (state, { payload }) =>
      state.set('error', payload),
    [fetchLevelBulkActions.success.toString()]: (state, { payload }) =>
      state
        .merge(
          {
            // @ts-expect-error
            byId: payload.reduce((acc: any, l: Level) => {
              acc[l.id] = l;
              return acc;
            }, {}),
          },
          { deep: true },
        )
        .setIn(
          ['allIds'],
          // @ts-expect-error
          uniq([...state.allIds, ...payload.map((l: Level) => l.id)]),
        ),

    [fetchLevelActions.loading.toString()]: (state, { payload }) =>
      state.set('loading', payload),
    [fetchLevelActions.error.toString()]: (state, { payload }) =>
      state.set('error', payload),
    [fetchLevelActions.success.toString()]: (state, { payload }) =>
      state.merge(
        {
          byId: {
            // @ts-expect-error
            [payload.id]: payload,
          },
        },
        { deep: true },
      ),

    [updateLevelActions.loading.toString()]: (state, { payload }) =>
      state.set('loading', payload),
    [updateLevelActions.error.toString()]: (state, { payload }) =>
      state.set('error', payload),
    [updateLevelActions.success.toString()]: (state, { payload }) =>
      state.merge(
        {
          byId: {
            // @ts-expect-error
            [payload.id]: payload,
          },
        },
        { deep: true },
      ),

    [resetAction.toString()]: (state) => {
      return state.set('allIds', []);
    },

    [createLevelActions.loading.toString()]: (state, { payload }) =>
      state.set('loading', payload),
    [createLevelActions.error.toString()]: (state, { payload }) =>
      state.set('error', payload),
    [createLevelActions.success.toString()]: (state, { payload }) =>
      state
        .merge(
          {
            byId: {
              // @ts-expect-error
              [payload.id]: payload,
            },
          },
          { deep: true },
        )
        // @ts-expect-error
        .setIn(['allIds'], [...state.allIds, payload.id]),

    [deleteLevelActions.loading.toString()]: (state, { payload }) =>
      state.set('loading', payload),
    [deleteLevelActions.error.toString()]: (state, { payload }) =>
      state.set('error', payload),
    [deleteLevelActions.success.toString()]: (state, { payload }) =>
      state.merge(
        {
          byId: {
            // @ts-expect-error
            [payload.id]: {
              enabled: false,
            },
          },
        },
        { deep: true },
      ),
  },
  initialState,
);
