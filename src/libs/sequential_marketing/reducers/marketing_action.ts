import uniq from 'lodash/uniq';
import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  fetchStepMarketingActions,
  upsertStepMarketingActionsActions,
  deleteStepMarketingActionsActions,
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
          uniq([...state.allIds, payload.id]),
        )
        .setIn(['marketingActions', 'byId', payload.id.toString()], payload)
        .setIn(
          ['marketingActions', 'byStepId', payload.cadence_step.toString()],
          uniq([...(state.byStepId[payload.cadence_step] ?? []), payload]),
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
          state.allIds.filter((id) => id !== payload.id),
        )
        .setIn(
          ['marketingActions', 'byStepId', payload.stepId.toString()],
          state.byStepId[payload.stepId].filter((ma) => ma.id !== payload.id),
        );
    },
  },
  initialMarketingActionsState,
);
