import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  // STEPS
  retrieveCadenceStepActions,
  fetchCadenceStepListActions,
  updateCadenceStepCanvasPositionActions,
  updateCadenceStepConnectedTriggerCanvasPositionActions,
  updateCadenceStepActions,
  deleteCadenceStepActions,
  // TRIGGERS
  subscribeStepToStepActions,
  updateConnectedTriggerActions,
  deleteConnectedTriggerActions,
} from '#libs/sequential_marketing/actions';

import type {
  CadenceStep,
  CadenceStepState,
  ConnectedTrigger,
} from '#libs/sequential_marketing/types';

import type { PaginatedResponse } from '../../../state/types';

export type ImmutableCadenceStepState = Immutable.Immutable<CadenceStepState>;

type PayloadReduceType<T> = { [id: number]: T };

export const initialCadenceStepState: ImmutableCadenceStepState =
  Immutable<CadenceStepState>({
    allIds: [],
    byId: {},
    loading: false,
    error: null,
    subscribe: {
      loading: false,
      error: null,
    },
    position: {
      loading: false,
      error: null,
    },
    trigger: {
      byId: {},
      allIds: [],
      loading: false,
      error: null,
    },
  });

export default handleActions<ImmutableCadenceStepState, any>(
  {
    [retrieveCadenceStepActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.set('loading', payload);
    },
    [retrieveCadenceStepActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.set('error', payload);
    },
    [retrieveCadenceStepActions.success.toString()]: (
      state,
      { payload }: { payload: CadenceStep },
    ) => {
      return state
        .set('allIds', [payload.id])
        .setIn(['byId', payload.id.toString()], payload);
    },

    [updateCadenceStepActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.set('loading', payload);
    },
    [updateCadenceStepActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.set('error', payload);
    },
    [updateCadenceStepActions.success.toString()]: (
      state,
      { payload }: { payload: { id: number } },
    ) => {
      return state
        .set('allIds', [
          ...state.allIds.filter((id) => id !== payload.id),
          payload.id,
        ])
        .setIn(['byId', payload.id.toString()], payload);
    },

    [deleteCadenceStepActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.set('loading', payload);
    },
    [deleteCadenceStepActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.set('error', payload);
    },
    [deleteCadenceStepActions.success.toString()]: (
      state,
      { payload }: { payload: { id: number } },
    ) => {
      return state.set(
        'allIds',
        state.allIds.filter((step_id) => step_id !== payload.id),
      );
    },

    [fetchCadenceStepListActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.set('loading', payload);
    },
    [fetchCadenceStepListActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.set('error', payload);
    },
    [fetchCadenceStepListActions.success.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<CadenceStep> },
    ) => {
      return state
        .set(
          'allIds',
          payload.results.map((cadence) => cadence.id),
        )
        .merge(
          {
            byId: payload.results.reduce<PayloadReduceType<CadenceStep>>(
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

    /* Commented code for achieving smoother drag and drop with instant position change */
    // [updateCadenceStepCanvasPositionActions.isLoading.toString()]: (
    //   state,
    //   { payload }: { payload: boolean },
    // ) => {
    //   return state.setIn(['position', 'loading'], payload);
    // },
    [updateCadenceStepCanvasPositionActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['position', 'error'], payload);
    },
    [updateCadenceStepCanvasPositionActions.success.toString()]: (
      state,
      { payload }: { payload: CadenceStep },
    ) => {
      return state.setIn(['byId', payload.id.toString()], payload);
    },

    /* Commented code for achieving smoother drag and drop with instant position change */
    // [updateCadenceStepConnectedTriggerCanvasPositionActions.isLoading.toString()]:
    //   (state, { payload }: { payload: boolean }) => {
    //     return state.setIn(['position', 'loading'], payload);
    //   },
    [updateCadenceStepConnectedTriggerCanvasPositionActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['position', 'error'], payload);
    },
    [updateCadenceStepConnectedTriggerCanvasPositionActions.success.toString()]:
      (state, { payload }: { payload: ConnectedTrigger }) => {
        return state.setIn(
          ['byId', payload.destination_config.source_id.toString(), 'exits'],
          [
            ...state.byId[payload.destination_config.source_id].exits.filter(
              (e) => e?.trigger_config?.uuid !== payload.trigger_config?.uuid,
            ),
            payload,
          ],
        );
      },
    [subscribeStepToStepActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['subscribe', 'loading'], payload);
    },
    [subscribeStepToStepActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['subscribe', 'error'], payload);
    },
    // TODO : Handle data to avoid refresh on success (backEnd not working for now)
    // [subscribeStepToStepActions.success.toString()]: (
    //   state,
    //   { payload }: { payload: CadenceStep },
    // ) => {
    //   return state.setIn(['byId', payload.id], payload);
    // },
    [updateConnectedTriggerActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['subscribe', 'loading'], payload);
    },
    [updateConnectedTriggerActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['subscribe', 'error'], payload);
    },
    [deleteConnectedTriggerActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['trigger', 'loading'], payload);
    },
    [deleteConnectedTriggerActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['trigger', 'error'], payload);
    },
    [deleteConnectedTriggerActions.success.toString()]: (
      state,
      {
        payload,
      }: { payload: { connected_trigger_uuid: string; source_id: number } },
    ) => {
      return state.setIn(
        ['byId', payload.source_id?.toString(), 'exits'],
        state.byId[payload.source_id].exits.map((trigger) => {
          if (trigger.trigger_config.uuid === payload.connected_trigger_uuid) {
            const new_trigger: ConnectedTrigger = {
              ...trigger,
              disabled: true,
            };
            return new_trigger;
          }
          return trigger;
        }),
      );
    },
  },
  initialCadenceStepState,
);
