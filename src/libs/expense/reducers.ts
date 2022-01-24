// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  expenseListActions,
  createExpenseActions,
  updateExpenseActions,
  deleteExpenseActions,
  expenseSupplierActions,
  expenseCategoryActions,
} from './actions';

import type { Expense, ExpenseState } from './types';

const initialState: Immutable.Immutable<ExpenseState> = Immutable<ExpenseState>(
  {
    expense: {
      byId: {},
      allIds: [],
      loading: false,
      error: null,
      categories: [],
      suppliers: [],
      page: 1,
      count: 0,
    },
  },
);

export default handleActions(
  {
    [expenseListActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['expense', 'loading'], payload);
    },
    [expenseListActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['expense', 'error'], payload);
    },
    [expenseListActions.success.toString()]: (state, { payload }) => {
      return state
        .merge(
          {
            expense: {
              byId: payload.results.reduce(
                (acc: { [id: number]: Expense }, exp: Expense) => {
                  acc[exp.id] = exp;
                  return acc;
                },
                {},
              ),
            },
          },
          { deep: true },
        )
        .setIn(
          ['expense', 'allIds'],
          payload.results.map((g) => g.id),
        )
        .setIn(['expense', 'count'], payload.count);
    },
    [createExpenseActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['expense', 'loading'], payload);
    },
    [createExpenseActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['expense', 'error'], payload);
    },
    [createExpenseActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['expense', 'byId', payload.id], payload);
    },
    [updateExpenseActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['expense', 'loading'], payload);
    },
    [updateExpenseActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['expense', 'error'], payload);
    },
    [updateExpenseActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['expense', 'byId', payload.id], payload);
    },
    [deleteExpenseActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['expense', 'loading'], payload);
    },
    [deleteExpenseActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['expense', 'error'], payload);
    },
    [deleteExpenseActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['expense', 'byId', payload.id], payload);
    },
    [expenseCategoryActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['expense', 'loading'], payload);
    },
    [expenseCategoryActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['expense', 'error'], payload);
    },
    [expenseCategoryActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['expense', 'categories'], payload);
    },
    [expenseSupplierActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['expense', 'loading'], payload);
    },
    [expenseSupplierActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['expense', 'error'], payload);
    },
    [expenseSupplierActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['expense', 'suppliers'], payload);
    },
  },
  initialState,
);
