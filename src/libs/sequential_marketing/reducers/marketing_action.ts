import uniq from 'lodash/uniq';
import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  deleteStepMarketingActionsActions,
  fetchStepMarketingActions,
  modifyStepMarketingActionsConfigurationActions,
  upsertStepMarketingActionsActions,
} from '#libs/sequential_marketing/actions';

import type {
  MarketingActionState,
  StepMarketingActions,
} from '#libs/sequential_marketing/types';

import type { PaginatedResponse } from '../../../state/types';

type ImmutableCadenceState = Immutable.Immutable<MarketingActionState>;

type PayloadReduceType<T> = { [id: number]: T };

export const initialMarketingActionsState: ImmutableCadenceState =
  Immutable<MarketingActionState>({
    allIds: [],
    byId: {},
    byStepId: {},
    loading: false,
    error: null,
    upsert: {
      loading: false,
      error: null,
    },
  });

export default handleActions<ImmutableCadenceState, any>(
  {
    [fetchStepMarketingActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.set('loading', payload);
    },
    [fetchStepMarketingActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.set('error', payload);
    },
    [fetchStepMarketingActions.success.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<StepMarketingActions> },
    ) => {
      return state
        .set(
          'allIds',
          uniq(
            [...state.allIds].concat(
              payload?.results?.map((marketingAction) => marketingAction.id),
            ),
          ),
        )
        .merge(
          {
            byId: payload.results.reduce<
              PayloadReduceType<StepMarketingActions>
            >((accumulator, currentValue) => {
              accumulator[currentValue.id] = currentValue;
              return accumulator;
            }, {}),
            byStepId: payload.results.reduce<
              PayloadReduceType<StepMarketingActions[]>
            >((accumulator, currentValue) => {
              if (accumulator[currentValue.cadence_step]) {
                accumulator[currentValue.cadence_step].push(currentValue);
              } else {
                accumulator[currentValue.cadence_step] = [currentValue];
              }
              return accumulator;
            }, {}),
          },
          { deep: true },
        );
    },
    [upsertStepMarketingActionsActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [upsertStepMarketingActionsActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['upsert', 'error'], payload);
    },
    [upsertStepMarketingActionsActions.success.toString()]: (
      state,
      { payload }: { payload: StepMarketingActions },
    ) => {
      return state
        .setIn(['allIds'], uniq([...state.allIds, payload.id]))
        .setIn(['byId', payload.id.toString()], payload)
        .setIn(
          ['byStepId', payload.cadence_step.toString()],
          uniq([...(state.byStepId[payload.cadence_step] ?? []), payload]),
        );
    },
    [modifyStepMarketingActionsConfigurationActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [modifyStepMarketingActionsConfigurationActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['upsert', 'error'], payload);
    },
    [modifyStepMarketingActionsConfigurationActions.success.toString()]: (
      state,
      {
        payload,
      }: { payload: { result: StepMarketingActions[]; disabled: number[] } },
    ) => {
      const byIdDict = Immutable.asMutable(state.byId, { deep: true });
      const byStepIdDict = Immutable.asMutable(state.byStepId, { deep: true });
      payload.disabled.forEach((id) => {
        delete byIdDict[id];
        Object.keys(byStepIdDict).forEach((stepId) => {
          const stepIdInt = parseInt(stepId, 10);
          const updatedList = byStepIdDict[stepIdInt].filter(
            (action) => action.id !== id,
          );
          if (updatedList.length === 0) {
            delete byStepIdDict[stepIdInt];
          } else {
            byStepIdDict[stepIdInt] = updatedList;
          }
        });
      });
      return state
        .set(
          'allIds',
          uniq(
            [...state.allIds]
              .concat(
                payload.result?.map((marketingAction) => marketingAction.id),
              )
              ?.filter((id) => !(id in payload.disabled)) ?? [],
          ),
        )
        .merge({
          byId: payload.result?.reduce<PayloadReduceType<StepMarketingActions>>(
            (accumulator, marketingAction) => {
              accumulator[marketingAction.id] = marketingAction;
              return accumulator;
            },
            byIdDict,
          ),
        })
        .merge({
          byStepId: payload.result?.reduce<
            PayloadReduceType<StepMarketingActions[]>
          >((accumulator, marketingAction) => {
            if (accumulator[marketingAction.cadence_step]) {
              accumulator[marketingAction.cadence_step] = accumulator[
                marketingAction.cadence_step
              ].filter((action) => action.id !== marketingAction.id);
              accumulator[marketingAction.cadence_step].push(marketingAction);
            } else {
              accumulator[marketingAction.cadence_step] = [marketingAction];
            }
            return accumulator;
          }, byStepIdDict),
        });
    },
    [deleteStepMarketingActionsActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [deleteStepMarketingActionsActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['upsert', 'loading'], payload);
    },
    [deleteStepMarketingActionsActions.success.toString()]: (
      state,
      { payload }: { payload: { id: number; stepId: number } },
    ) => {
      return state
        .set(
          'allIds',
          state.allIds.filter((id) => id !== payload.id),
        )
        .setIn(
          ['byStepId', payload.stepId.toString()],
          state.byStepId[payload.stepId].filter((ma) => ma.id !== payload.id),
        );
    },
  },
  initialMarketingActionsState,
);
