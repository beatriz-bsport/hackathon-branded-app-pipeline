import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';

import {
  getGymAvailabilityActions,
  createWellhubGymActions,
  fetchWellhubGymsActions,
  getWellhubGymActions,
  updateWellhubGymActions,
  deleteWellhubGymActions,
  configureWellhubGymWebhooksActions,
} from '#src/libs/wellhub/actions';

import type { PaginatedResponse } from '#src/state/types';
import type {
  GymAvailabilityResponse,
  WellhubGym,
  WellhubState,
} from '#src/libs/wellhub/types';

export type ImmutableWellhubState = Immutable.Immutable<WellhubState>;

export const initialWellhubState: ImmutableWellhubState =
  Immutable<WellhubState>({
    allUuids: [],
    byUuid: {},
    loading: false,
    error: null,
    gymAvailability: {
      loading: false,
      error: null,
      record: {},
    },
  });

export default handleActions<ImmutableWellhubState, any>(
  {
    [getGymAvailabilityActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['gymAvailability', 'loading'], payload);
    },
    [getGymAvailabilityActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['gymAvailability', 'error'], payload);
    },
    [getGymAvailabilityActions.success.toString()]: (
      state,
      { payload }: { payload: GymAvailabilityResponse },
    ) => {
      return state.setIn(
        ['gymAvailability', 'record', payload.gym_id],
        payload,
      );
    },

    [createWellhubGymActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.set('loading', payload);
    },
    [createWellhubGymActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.set('error', payload);
    },

    [fetchWellhubGymsActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.set('loading', payload);
    },
    [fetchWellhubGymsActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.set('error', payload);
    },
    [fetchWellhubGymsActions.success.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<WellhubGym> },
    ) => {
      return state
        .set(
          'allUuids',
          payload.results.map((wellhubGym: WellhubGym) => wellhubGym.uuid),
        )
        .merge(
          {
            byUuid: payload.results.reduce<{ [uuid: string]: WellhubGym }>(
              (accumulator, currentWellhubGym) => {
                accumulator[currentWellhubGym.uuid] = currentWellhubGym;
                return accumulator;
              },
              {},
            ),
          },
          { deep: true },
        );
    },

    [getWellhubGymActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.set('loading', payload);
    },
    [getWellhubGymActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.set('error', payload);
    },
    [getWellhubGymActions.success.toString()]: (
      state,
      { payload }: { payload: WellhubGym },
    ) => {
      return state
        .set('allUuids', [payload.uuid])
        .setIn(['byUuid', payload.uuid], payload);
    },

    [updateWellhubGymActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.set('loading', payload);
    },
    [updateWellhubGymActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.set('error', payload);
    },

    [deleteWellhubGymActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.set('loading', payload);
    },
    [deleteWellhubGymActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.set('error', payload);
    },
    [deleteWellhubGymActions.success.toString()]: (
      state,
      { payload }: { payload: { uuid: string } },
    ) => {
      return state.set(
        'allUuids',
        state.allUuids.filter((uuid) => uuid !== payload.uuid),
      );
    },

    [configureWellhubGymWebhooksActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.set('loading', payload);
    },
    [configureWellhubGymWebhooksActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.set('error', payload);
    },
    [configureWellhubGymWebhooksActions.success.toString()]: (
      state,
      { payload }: { payload: WellhubGym },
    ) => {
      return state.setIn(['byUuid', payload.uuid], payload);
    },
  },
  initialWellhubState,
);
