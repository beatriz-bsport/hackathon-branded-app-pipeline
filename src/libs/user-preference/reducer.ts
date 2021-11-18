import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';
import { userPreferenceActions } from './actions';
import { UserPreference } from './types';
// import {
//   ManagerOnly,
//   SortOption,
// } from '../payment-packs/components/PaymentPackFilterAndSortHeader.component';

const initialState: Immutable.Immutable<UserPreference> = Immutable({
  // paymentPackSort: SortOption.customSort,
  paymentPackCategoryFilter: [],
  // paymentPackManagerOnlyFilter: ManagerOnly.showAll,
  scheduleTimerange: {
    begin: '06:00:00',
    end: '23:00:00',
  },
});

export default handleActions<Immutable.Immutable<UserPreference>, any>(
  {
    [userPreferenceActions.setPaymentPackSort.toString()]: (
      state,
      { payload },
    ) => {
      return state.set('paymentPackSort', payload);
    },
    [userPreferenceActions.setPaymentPackCategoryFilter.toString()]: (
      state,
      { payload },
    ) => {
      return state.set('paymentPackCategoryFilter', payload);
    },
    [userPreferenceActions.setPaymentPackManagerOnlyFilter.toString()]: (
      state,
      { payload },
    ) => {
      return state.set('paymentPackManagerOnlyFilter', payload);
    },
    [userPreferenceActions.setScheduleTimerange.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(['scheduleTimerange', 'begin'], payload.begin)
        .setIn(['scheduleTimerange', 'end'], payload.end);
    },
  },
  initialState,
);
