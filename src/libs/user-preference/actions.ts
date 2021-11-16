import { createAction } from 'redux-actions';
import { Dispatch } from 'redux';
import {
  ManagerOnly,
  SortOption,
} from '../payment-packs/components/PaymentPackFilterAndSortHeader.component';

export const userPreferenceActions = {
  setPaymentPackSort: createAction('USER_PREFERENCE/PAYMENT_PACK_SORT'),
  setPaymentPackCategoryFilter: createAction(
    'USER_PREFERENCE/PAYMENT_PACK_CATEGORY_FILTER',
  ),
  setPaymentPackManagerOnlyFilter: createAction(
    'USER_PREFERENCE/PAYMENT_PACK_MANAGERONLY_FILTER',
  ),
  setScheduleTimerange: createAction('USER_PREFERENCE/SCHEDULE/TIMERANGE'),
};

export function setPaymentPackSort(sortOption: SortOption) {
  return async (dispatch: Dispatch) => {
    dispatch(userPreferenceActions.setPaymentPackSort(sortOption));
  };
}

export function setPaymentPackCategoryFilter(categories: Array<number>) {
  return async (dispatch: Dispatch) => {
    dispatch(userPreferenceActions.setPaymentPackCategoryFilter(categories));
  };
}

export function setPaymentPackManagerOnlyFilter(option: ManagerOnly) {
  return async (dispatch: Dispatch) => {
    dispatch(userPreferenceActions.setPaymentPackManagerOnlyFilter(option));
  };
}

export function setScheduleTimerange(scheduleTimerange: {
  begin: string;
  end: string;
}) {
  return async (dispatch: Dispatch) => {
    dispatch(
      userPreferenceActions.setScheduleTimerange({
        begin: scheduleTimerange.begin,
        end: scheduleTimerange.end,
      }),
    );
  };
}
