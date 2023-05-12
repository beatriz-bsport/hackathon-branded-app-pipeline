// @ts-nocheck
import uniq from 'lodash/uniq';
import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';
import type {
  Cadence,
  CadenceStep,
  CadenceState,
  StepMarketingActions,
  StepConnectedTriggerConfig,
} from './types';
import type { PaginatedResponse } from '../../state/types';
import {
  // CADENCE
  createCadenceActions,
  updateCadenceActions,
  retrieveCadenceActions,
  fetchCadenceListActions,
  archiveCadenceActions,
  restoreCadenceActions,
  activateCadenceActions,
  shutOffCadenceActions,
  upsertInitialCadenceConfigurationActions,

  // STEPS
  retrieveCadenceStepActions,
  fetchCadenceStepListActions,
  updateCadenceStepCanvasPositionActions,
  updateCadenceStepConnectedTriggerCanvasPositionActions,
  subscribeStepToStepActions,
  updateCadenceStepActions,
  deleteCadenceStepActions,

  // MARKETING ACTIONS
  fetchStepMarketingActions,
  upsertStepMarketingActionsActions,
  deleteStepMarketingActionsActions,

  // TRIGGERS
  deleteConnectedTriggerActions,
} from './actions';

type ImmutableCadenceState = Immutable.Immutable<CadenceState>;

type PayloadReduceType<T> = { [id: number]: T };
const initialState: ImmutableCadenceState = Immutable<CadenceState>({
  cadence: {
    allIds: [],
    byId: {},
    loading: false,
    error: null,
  },
  step: {
    allIds: [],
    byId: {},
    loading: false,
    error: null,
    subscribe: {
      error: null,
      loading: false,
    },
  },
  marketingActions: {
    allIds: [],
    byId: {},
    byStepId: {},
    loading: false,
    error: null,
    upsert: {
      loading: false,
      error: null,
    },
  },
  trigger: {
    allIds: [],
    byId: {},
    loading: false,
    error: null,
  },
  loading: false,
  error: null,
});

export default handleActions<ImmutableCadenceState, any>(
  {
    [createCadenceActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['cadence', 'loading'], payload);
    },
    [createCadenceActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['cadence', 'error'], payload);
    },
    [createCadenceActions.success.toString()]: (
      state,
      { payload }: { payload: Cadence },
    ) => {
      return state
        .setIn(['cadence', 'allIds'], [...state.cadence.allIds, payload.id])
        .setIn(['cadence', 'byId', payload.id], payload);
    },

    [updateCadenceActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['cadence', 'loading'], payload);
    },
    [updateCadenceActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['cadence', 'error'], payload);
    },
    [updateCadenceActions.success.toString()]: (
      state,
      { payload }: { payload: Cadence },
    ) => {
      return state.setIn(['cadence', 'byId', payload.id], payload);
    },
    [upsertInitialCadenceConfigurationActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['cadence', 'loading'], payload);
    },
    [upsertInitialCadenceConfigurationActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['cadence', 'error'], payload);
    },
    [upsertInitialCadenceConfigurationActions.success.toString()]: (
      state,
      { payload }: { payload: Cadence },
    ) => {
      return state.setIn(['cadence', 'byId', payload.id], payload);
    },

    [archiveCadenceActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['cadence', 'loading'], payload);
    },
    [archiveCadenceActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['cadence', 'error'], payload);
    },
    [archiveCadenceActions.success.toString()]: (
      state,
      { payload }: { payload: { id: number } },
    ) => {
      return state.setIn(['cadence', 'byId', payload.id], payload);
    },

    [restoreCadenceActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['cadence', 'loading'], payload);
    },
    [restoreCadenceActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['cadence', 'error'], payload);
    },
    [restoreCadenceActions.success.toString()]: (
      state,
      { payload }: { payload: Cadence },
    ) => {
      return state.setIn(['cadence', 'byId', payload.id], payload);
    },

    [activateCadenceActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['cadence', 'loading'], payload);
    },
    [activateCadenceActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['cadence', 'error'], payload);
    },
    [activateCadenceActions.success.toString()]: (
      state,
      { payload }: { payload: Cadence },
    ) => {
      return state.setIn(['cadence', 'byId', payload.id], payload);
    },

    [shutOffCadenceActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['cadence', 'loading'], payload);
    },
    [shutOffCadenceActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['cadence', 'error'], payload);
    },
    [shutOffCadenceActions.success.toString()]: (
      state,
      { payload }: { payload: Cadence },
    ) => {
      return state.setIn(['cadence', 'byId', payload.id], payload);
    },

    [retrieveCadenceActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['cadence', 'loading'], payload);
    },
    [retrieveCadenceActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['cadence', 'error'], payload);
    },
    [retrieveCadenceActions.success.toString()]: (
      state,
      { payload }: { payload: Cadence },
    ) => {
      return state
        .setIn(['cadence', 'allIds'], [payload.id])
        .setIn(['cadence', 'byId', payload.id], payload);
    },

    [fetchCadenceListActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['cadence', 'loading'], payload);
    },
    [fetchCadenceListActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['cadence', 'error'], payload);
    },
    [fetchCadenceListActions.success.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<Cadence> },
    ) => {
      return state
        .setIn(
          ['cadence', 'allIds'],
          payload.results.map((cadence: Cadence) => cadence.id),
        )
        .merge(
          {
            cadence: {
              byId: payload.results.reduce<PayloadReduceType<Cadence>>(
                (acc, cV) => {
                  acc[cV.id] = cV;
                  return acc;
                },
                {},
              ),
            },
          },
          { deep: true },
        );
    },

    [retrieveCadenceStepActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['step', 'loading'], payload);
    },
    [retrieveCadenceStepActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['step', 'error'], payload);
    },
    [retrieveCadenceStepActions.success.toString()]: (
      state,
      { payload }: { payload: CadenceStep },
    ) => {
      return state
        .setIn(['step', 'allIds'], [payload.id])
        .setIn(['step', 'byId', payload.id], payload);
    },

    [updateCadenceStepActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['step', 'loading'], payload);
    },
    [updateCadenceStepActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['step', 'error'], payload);
    },
    [updateCadenceStepActions.success.toString()]: (
      state,
      { payload }: { payload: { id: number } },
    ) => {
      return state
        .setIn(['step', 'allIds'], [payload.id])
        .setIn(['step', 'byId', payload.id.toString()], payload);
    },

    [deleteCadenceStepActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['step', 'loading'], payload);
    },
    [deleteCadenceStepActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['step', 'error'], payload);
    },
    [deleteCadenceStepActions.success.toString()]: (
      state,
      { payload }: { payload: { id: number } },
    ) => {
      return state.setIn(
        ['step', 'allIds'],
        state.step.allIds.filter((step_id) => step_id !== payload.id),
      );
    },

    [fetchCadenceStepListActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['step', 'loading'], payload);
    },
    [fetchCadenceStepListActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['step', 'error'], payload);
    },
    [fetchCadenceStepListActions.success.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<CadenceStep> },
    ) => {
      return state
        .setIn(
          ['step', 'allIds'],
          payload.results.map((cadence) => cadence.id),
        )
        .merge(
          {
            step: {
              byId: payload.results.reduce<PayloadReduceType<CadenceStep>>(
                (acc, cV) => {
                  acc[cV.id] = cV;
                  return acc;
                },
                {},
              ),
            },
          },
          { deep: true },
        );
    },

    [updateCadenceStepCanvasPositionActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['step', 'error'], payload);
    },
    [updateCadenceStepCanvasPositionActions.success.toString()]: (
      state,
      { payload }: { payload: CadenceStep },
    ) => {
      return state.setIn(['step', 'byId', payload.id], payload);
    },

    [updateCadenceStepConnectedTriggerCanvasPositionActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['step', 'error'], payload);
    },
    [updateCadenceStepConnectedTriggerCanvasPositionActions.success.toString()]:
      (state, { payload }: { payload: StepConnectedTriggerConfig }) => {
        return state.setIn(
          [
            'step',
            'byId',
            payload.destination_config.source_id.toString(),
            'exits',
          ],
          [
            ...state.step.byId[
              payload.destination_config.source_id
            ].exits.filter((e) => e.uuid !== payload.uuid),
            payload,
          ],
        );
      },
    [subscribeStepToStepActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['step', 'subscribe', 'loading'], payload);
    },
    [subscribeStepToStepActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['step', 'subscribe', 'error'], payload);
    },
    // TODO : Handle data to avoid refresh on success (backEnd not working for now)
    // [subscribeStepToStepActions.success.toString()]: (
    //   state,
    //   { payload }: { payload: CadenceStep },
    // ) => {
    //   return state.setIn(['step', 'byId', payload.id], payload);
    // },

    [fetchStepMarketingActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['marketingActions', 'loading'], payload);
    },
    [fetchStepMarketingActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['marketingActions', 'error'], payload);
    },
    [fetchStepMarketingActions.success.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<StepMarketingActions> },
    ) => {
      return state
        .setIn(
          ['marketingActions', 'allIds'],
          payload.results.map((marketingAction) => marketingAction.id),
        )
        .merge(
          {
            marketingActions: {
              byId: payload.results.reduce<
                PayloadReduceType<StepMarketingActions>
              >((acc, cV) => {
                acc[cV.id] = cV;
                return acc;
              }, {}),
              byStepId: payload.results.reduce<
                PayloadReduceType<StepMarketingActions[]>
              >((acc, cV) => {
                if (acc[cV.cadence_step]) {
                  acc[cV.cadence_step].push(cV);
                } else {
                  acc[cV.cadence_step] = [cV];
                }
                return acc;
              }, {}),
            },
          },
          { deep: true },
        );
    },
    [upsertStepMarketingActionsActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['marketingActions', 'upsert', 'loading'], payload);
    },
    [upsertStepMarketingActionsActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['marketingActions', 'upsert', 'loading'], payload);
    },
    [upsertStepMarketingActionsActions.success.toString()]: (
      state,
      { payload }: { payload: StepMarketingActions },
    ) => {
      return state
        .setIn(
          ['marketingActions', 'allIds'],
          uniq([...state.marketingActions.allIds, payload.id]),
        )
        .setIn(['marketingActions', 'byId', payload.id.toString()], payload)
        .setIn(
          ['marketingActions', 'byStepId', payload.cadence_step.toString()],
          uniq([
            ...(state.marketingActions.byStepId[payload.cadence_step] ?? []),
            payload,
          ]),
        );
    },
    [deleteStepMarketingActionsActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['marketingActions', 'upsert', 'loading'], payload);
    },
    [deleteStepMarketingActionsActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['marketingActions', 'upsert', 'loading'], payload);
    },
    [deleteStepMarketingActionsActions.success.toString()]: (
      state,
      { payload }: { payload: { id: number; stepId: number } },
    ) => {
      return state
        .setIn(
          ['marketingActions', 'allIds'],
          state.marketingActions.allIds.filter((id) => id !== payload.id),
        )
        .setIn(
          ['marketingActions', 'byStepId', payload.stepId.toString()],
          state.marketingActions.byStepId[payload.stepId].filter(
            (ma) => ma.id !== payload.id,
          ),
        );
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
        ['step', 'byId', payload.source_id, 'exits'],
        state.step.byId[payload.source_id].exits.map((trigger) => {
          if (trigger.uuid === payload.connected_trigger_uuid) {
            const new_trigger: StepConnectedTriggerConfig<number> = {
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
  initialState,
);
