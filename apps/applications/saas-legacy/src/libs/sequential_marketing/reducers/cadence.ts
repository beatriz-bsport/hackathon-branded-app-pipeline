import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';

import {
  createCadenceActions,
  updateCadenceActions,
  retrieveCadenceActions,
  fetchCadenceListActions,
  archiveCadenceActions,
  restoreCadenceActions,
  duplicateCadenceActions,
  activateCadenceActions,
  shutOffCadenceActions,
  upsertCadenceInitialConfigurationActions,
  createCadenceFromTemplateActions,
} from '#src/libs/sequential_marketing/actions';

import { Cadence, CadenceState } from '#src/libs/sequential_marketing/types';
import type { PaginatedResponse } from '../../../state/types';

type PayloadReduceType<T> = { [id: number]: T };

export type ImmutableCadenceState = Immutable.Immutable<CadenceState>;

export const initialCadenceState: ImmutableCadenceState =
  Immutable<CadenceState>({
    allIds: [],
    byId: {},
    loading: false,
    error: null,
  });

export default handleActions<ImmutableCadenceState, any>(
  {
    [createCadenceActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.set('loading', payload);
    },
    [createCadenceActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.set('error', payload);
    },
    [createCadenceActions.success.toString()]: (
      state,
      { payload }: { payload: Cadence },
    ) => {
      return state
        .set('allIds', [...state.allIds, payload.id])
        .setIn(['byId', payload.id.toString()], payload);
    },

    [updateCadenceActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.set('loading', payload);
    },
    [updateCadenceActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.set('error', payload);
    },
    [updateCadenceActions.success.toString()]: (
      state,
      { payload }: { payload: Cadence },
    ) => {
      return state.setIn(['byId', payload.id.toString()], payload);
    },

    [upsertCadenceInitialConfigurationActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.set('loading', payload);
    },
    [upsertCadenceInitialConfigurationActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.set('error', payload);
    },
    [upsertCadenceInitialConfigurationActions.success.toString()]: (
      state,
      { payload }: { payload: Cadence },
    ) => {
      return state.setIn(['byId', payload.id.toString()], payload);
    },

    [archiveCadenceActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.set('loading', payload);
    },
    [archiveCadenceActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.set('error', payload);
    },
    [archiveCadenceActions.success.toString()]: (
      state,
      { payload }: { payload: { id: number } },
    ) => {
      return state.setIn(['byId', payload.id.toString()], payload);
    },

    [restoreCadenceActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.set('loading', payload);
    },
    [restoreCadenceActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.set('error', payload);
    },
    [restoreCadenceActions.success.toString()]: (
      state,
      { payload }: { payload: Cadence },
    ) => {
      return state.setIn(['byId', payload.id.toString()], payload);
    },

    [duplicateCadenceActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.set('loading', payload);
    },
    [duplicateCadenceActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.set('error', payload);
    },
    [duplicateCadenceActions.success.toString()]: (
      state,
      { payload }: { payload: Cadence },
    ) => {
      return state
        .set('allIds', [...state.allIds, payload.id])
        .setIn(['byId', payload.id.toString()], payload);
    },

    [activateCadenceActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.set('loading', payload);
    },
    [activateCadenceActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.set('error', payload);
    },
    [activateCadenceActions.success.toString()]: (
      state,
      { payload }: { payload: Cadence },
    ) => {
      return state.setIn(['byId', payload.id.toString()], payload);
    },

    [shutOffCadenceActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.set('loading', payload);
    },
    [shutOffCadenceActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.set('error', payload);
    },
    [shutOffCadenceActions.success.toString()]: (
      state,
      { payload }: { payload: Cadence },
    ) => {
      return state.setIn(['byId', payload.id.toString()], payload);
    },

    [retrieveCadenceActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.set('loading', payload);
    },
    [retrieveCadenceActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.set('error', payload);
    },
    [retrieveCadenceActions.success.toString()]: (
      state,
      { payload }: { payload: Cadence },
    ) => {
      return state
        .set('allIds', [payload.id])
        .setIn(['byId', payload.id.toString()], payload);
    },

    [fetchCadenceListActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.set('loading', payload);
    },
    [fetchCadenceListActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.set('error', payload);
    },
    [fetchCadenceListActions.success.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<Cadence> },
    ) => {
      return state
        .set(
          'allIds',
          payload.results.map((cadence: Cadence) => cadence.id),
        )
        .merge(
          {
            byId: payload.results.reduce<PayloadReduceType<Cadence>>(
              (accumulator, currentValue) => {
                accumulator[currentValue.id] = currentValue;
                return accumulator;
              },
              {},
            ),
          },
          { deep: true },
        );
    },

    [createCadenceFromTemplateActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.set('loading', payload);
    },
    [createCadenceFromTemplateActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.set('error', payload);
    },
    [createCadenceFromTemplateActions.success.toString()]: (
      state,
      { payload }: { payload: Cadence },
    ) => {
      return state
        .set('allIds', [...state.allIds, payload.id])
        .setIn(['byId', payload.id.toString()], payload);
    },
  },
  initialCadenceState,
);
