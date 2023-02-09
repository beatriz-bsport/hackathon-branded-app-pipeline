import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';
import type { Cadence, CadenceStep, CadenceState } from './types';
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
  upsertCadenceConfigurationActions,
  // STEPS
  retrieveCadenceStepActions,
  fetchCadenceStepListActions,
  updateCadenceStepCanvasPositionActions,
  updateCadenceStepConnectedTriggerCanvasPositionActions,
  subscribeStepToStepActions,
  updateCadenceStepActions,
  deleteCadenceStepActions,
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
    byId: [],
    loading: false,
    error: null,
    subscribe: {
      error: null,
      loading: false,
    },
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

    [upsertCadenceConfigurationActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['cadence', 'loading'], payload);
    },
    [upsertCadenceConfigurationActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['cadence', 'error'], payload);
    },
    [upsertCadenceConfigurationActions.success.toString()]: (
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
      { payload }: { payload: Cadence },
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
      (state, { payload }: { payload: CadenceStep }) => {
        return state.setIn(['step', 'byId', payload.id], payload);
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
    [subscribeStepToStepActions.success.toString()]: (
      state,
      { payload }: { payload: CadenceStep },
    ) => {
      return state.setIn(['step', 'byId', payload.id], payload);
    },
  },
  initialState,
);
