import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  // STEPS
  convertCadenceStepIntoExitActions,
  deleteCadenceStepActions,
  fetchCadenceStepListActions,
  retrieveCadenceStepActions,
  updateCadenceStepActions,
  updateCadenceStepCanvasPositionActions,
  // TRIGGERS
  convertCadenceExitIntoStepActions,
  deleteConnectedTriggerActions,
  subscribeStepToStepActions,
  updateCadenceStepConnectedTriggerCanvasPositionActions,
  updateConnectedTriggerActions,
} from '#libs/sequential_marketing/actions';
import { updatedSourceStep } from '#libs/sequential_marketing/utils';

import type {
  CadenceStep,
  CadenceStepState,
  ConnectedTrigger,
  UpdatedTrigger,
  UpdatedTriggersList,
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

    [convertCadenceStepIntoExitActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['trigger', 'loading'], payload);
    },
    [convertCadenceStepIntoExitActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['trigger', 'error'], payload);
    },
    [convertCadenceStepIntoExitActions.success.toString()]: (
      state,
      { payload }: { payload: UpdatedTriggersList },
    ) => {
      if (payload.triggers && payload.step)
        return (
          state
            .set(
              'allIds',
              state.allIds.filter((id) => id !== payload.step.id),
            )
            // Revising the 'exits' property for each ConnectedTrigger source step,
            // as this is where all the ConnectedTriggers are retrieved.
            .merge(
              {
                byId: payload.triggers.reduce<{ [id: number]: CadenceStep }>(
                  (acc, updatedTrigger) => {
                    if (updatedTrigger?.destination_config?.source_id)
                      return {
                        ...acc,
                        [updatedTrigger.destination_config.source_id]:
                          updatedSourceStep(
                            updatedTrigger,
                            state.byId[
                              updatedTrigger.destination_config.source_id
                            ],
                            acc[updatedTrigger.destination_config.source_id]
                              ?.exits,
                          ),
                      };
                    return acc;
                  },
                  {},
                ),
              },
              { deep: true },
            )
        );
      return state;
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
        if (
          !!payload?.destination_config?.source_id ||
          payload.destination_config.source_id === 0
        )
          return state.setIn(
            ['byId', payload.destination_config.source_id.toString(), 'exits'],
            [
              ...(state.byId[payload.destination_config.source_id].exits.filter(
                (trigger) =>
                  trigger?.trigger_config?.uuid !==
                  payload?.trigger_config?.uuid,
              ) ?? []),
              payload,
            ],
          );
        return state;
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
      return state.setIn(['trigger', 'loading'], payload);
    },
    [updateConnectedTriggerActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['trigger', 'error'], payload);
    },
    [updateConnectedTriggerActions.success.toString()]: (
      state,
      { payload }: { payload: ConnectedTrigger },
    ) => {
      if (payload?.destination_config?.source_id)
        return state.setIn(
          ['byId', payload.destination_config.source_id.toString(), 'exits'],
          [
            ...(state.byId[payload.destination_config.source_id].exits.filter(
              (trigger) =>
                trigger?.trigger_config?.uuid !== payload.trigger_config?.uuid,
            ) ?? []),
            payload,
          ],
        );
      return state;
    },
    [convertCadenceExitIntoStepActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['trigger', 'loading'], payload);
    },
    [convertCadenceExitIntoStepActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['trigger', 'error'], payload);
    },
    [convertCadenceExitIntoStepActions.success.toString()]: (
      state,
      { payload }: { payload: UpdatedTrigger },
    ) => {
      if (
        !!payload?.trigger?.destination_config?.source_id ||
        payload.trigger.destination_config.source_id === 0
      ) {
        return state
          .set('allIds', [...state.allIds, payload.step.id])
          .setIn(
            [
              'byId',
              payload.trigger.destination_config.source_id.toString(),
              'exits',
            ],
            [
              ...(state.byId[
                payload.trigger.destination_config.source_id
              ].exits.filter(
                (trigger) =>
                  trigger?.trigger_config?.uuid !==
                  payload.trigger?.trigger_config?.uuid,
              ) ?? []),
              payload.trigger,
            ],
          )
          .setIn(['byId', payload.step.id.toString()], payload.step);
      }
      return state;
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
