import { createAction } from 'redux-actions';

import moment from 'moment';
import { DATE_FORMAT } from '../../utils/datetime';
import { Expense } from './types';

import type { Dispatch, OptionCallback } from '../../state/types';
import {
  deleteExpense as deleteExpenseAPI,
  fetchExpenseList as fetchExpenseListAPI,
  createExpense as createExpenseAPI,
  updateExpense as updateExpenseAPI,
  getCategories as getCategoriesAPI,
  getSuppliers as getSuppliersAPI,
} from './api';

import { snackbarSuccess, snackbarError } from '../snackbar/actions';

export const expenseListActions = {
  isLoading: createAction('EXPENSE/LIST/IS_LOADING'),
  error: createAction('EXPENSE/LIST/ERROR'),
  success: createAction('EXPENSE/LIST/SUCCESS'),
};

export function fetchExpenseList(params: any, options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(expenseListActions.isLoading(true));
    dispatch(expenseListActions.error(null));

    try {
      const res = await fetchExpenseListAPI({
        ...params,
        date_lte: moment(new Date()).format(DATE_FORMAT),
      });
      dispatch(expenseListActions.success(res.data));
      if (options && options.onSuccess) {
        options.onSuccess(res.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(expenseListActions.error(err));
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(expenseListActions.isLoading(false));
  };
}

export function fetchFutureExpenses(params: any, options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(expenseListActions.isLoading(true));
    dispatch(expenseListActions.error(null));

    try {
      const res = await fetchExpenseListAPI({
        ...params,
        date_gt: moment(new Date()).format(DATE_FORMAT),
      });
      dispatch(expenseListActions.success(res.data));
      if (options && options.onSuccess) {
        options.onSuccess(res.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(expenseListActions.error(err));
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(expenseListActions.isLoading(false));
  };
}

export const createExpenseActions = {
  error: createAction('EXPENSE/CREATE/ERROR'),
  isLoading: createAction('EXPENSE/CREATE/IS_LOADING'),
  success: createAction('EXPENSE/CREATE/SUCCESS'),
};

export function createExpense(data: any, options?: OptionCallback<Expense>) {
  return async (dispatch: Dispatch) => {
    dispatch(createExpenseActions.isLoading(true));
    dispatch(createExpenseActions.error(null));

    try {
      const res = await createExpenseAPI(data);
      dispatch(createExpenseActions.success(res.data));
      dispatch(snackbarSuccess('expense:create.success'));
      if (options && options.onSuccess) {
        options.onSuccess(res.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(createExpenseActions.error(err));
      dispatch(snackbarError('expense:create.error'));
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(createExpenseActions.isLoading(false));
  };
}

export const updateExpenseActions = {
  error: createAction('EXPENSE/UPDATE/ERROR'),
  isLoading: createAction('EXPENSE/UPDATE/IS_LOADING'),
  success: createAction('EXPENSE/UPDATE/SUCCESS'),
};

export function updateExpense(data: any, options?: OptionCallback<Expense>) {
  return async (dispatch: Dispatch) => {
    dispatch(updateExpenseActions.isLoading(true));
    dispatch(updateExpenseActions.error(null));

    try {
      const res = await updateExpenseAPI(data);
      dispatch(updateExpenseActions.success(res.data));
      dispatch(snackbarSuccess('expense:update.success'));
      if (options && options.onSuccess) {
        options.onSuccess(res.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(updateExpenseActions.error(err));
      dispatch(snackbarError('expense:update.error'));
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(updateExpenseActions.isLoading(false));
  };
}

export const deleteExpenseActions = {
  error: createAction('EXPENSE/DELETE/ERROR'),
  isLoading: createAction('EXPENSE/DELETE/IS_LOADING'),
  success: createAction('EXPENSE/DELETE/SUCCESS'),
};

export function deleteExpense(
  id: number,
  data?: any,
  options?: OptionCallback<Expense>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(deleteExpenseActions.isLoading(true));
    dispatch(deleteExpenseActions.error(null));

    try {
      const res = await deleteExpenseAPI(id, data);
      dispatch(deleteExpenseActions.success(id));
      dispatch(snackbarSuccess('expense:delete.success'));
      if (options && options.onSuccess) {
        options.onSuccess(res.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(deleteExpenseActions.error(err));
      dispatch(snackbarError('expense:delete.error'));
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(deleteExpenseActions.isLoading(false));
  };
}

export const expenseCategoryActions = {
  error: createAction('EXPENSE/CATEGORY/ERROR'),
  isLoading: createAction('EXPENSE/CATEGORY/IS_LOADING'),
  success: createAction('EXPENSE/CATEGORY/SUCCESS'),
};

export function getCategories(options?: OptionCallback<Expense>) {
  return async (dispatch: Dispatch) => {
    dispatch(expenseCategoryActions.isLoading(true));
    dispatch(expenseCategoryActions.error(null));

    try {
      const res = await getCategoriesAPI();
      dispatch(expenseCategoryActions.success(res.data));
      if (options && options.onSuccess) {
        options.onSuccess(res.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(expenseCategoryActions.error(err));
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(expenseCategoryActions.isLoading(false));
  };
}

export const expenseSupplierActions = {
  error: createAction('EXPENSE/SUPPLIER/ERROR'),
  isLoading: createAction('EXPENSE/SUPPLIER/IS_LOADING'),
  success: createAction('EXPENSE/SUPPLIER/SUCCESS'),
};

export function getSuppliers(options?: OptionCallback<Expense>) {
  return async (dispatch: Dispatch) => {
    dispatch(expenseSupplierActions.isLoading(true));
    dispatch(expenseSupplierActions.error(null));

    try {
      const res = await getSuppliersAPI();
      dispatch(expenseSupplierActions.success(res.data));
      if (options && options.onSuccess) {
        options.onSuccess(res.data);
      }
    } catch (err) {
      console.error(err);
      dispatch(expenseSupplierActions.error(err));
      if (options && options.onError) {
        options.onError(err);
      }
    }
    dispatch(expenseSupplierActions.isLoading(false));
  };
}
