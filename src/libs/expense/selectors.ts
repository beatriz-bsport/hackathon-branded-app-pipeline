import { createSelector } from 'reselect';
import memoize from 'memoize-one';
import { RootState } from '../../reducers';
import { getUsers } from '#libs/role/selectors';
import { Expense } from './types';

const _getExpenseData = (state: RootState) => state.expense.expense.byId;

const _getExpenseListIds = (state: RootState) => {
  return state.expense.expense.allIds;
};

export const getExpenseList = createSelector(
  [_getExpenseData, _getExpenseListIds],
  (data, ids) => ids.map((id: number) => data[id]),
);

export const withUsers = memoize(
  (selector: (state: RootState) => Array<Expense> | Expense) =>
    createSelector([selector, getUsers], (expenseList, userList) => {
      if (Array.isArray(expenseList)) {
        return expenseList.map((expense) => ({
          ...expense,
          assigned_staff: expense?.assigned_staff
            ? userList.find((user) => user.id === expense.assigned_staff)
            : null,
        }));
      }
      return expenseList;
    }),
);
