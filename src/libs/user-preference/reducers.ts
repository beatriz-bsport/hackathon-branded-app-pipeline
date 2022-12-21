import Immutable from 'seamless-immutable';
import moment from 'moment-timezone';
import { handleActions } from 'redux-actions';
import { userPreferenceActions } from './actions';
import { UserPreference } from './types';
import {
  ManagerOnly,
  SortOption,
} from '../payment-packs/components/PaymentPackFilterAndSortHeader.component';
import { defaultFilters } from './selectors';

const initialState: Immutable.Immutable<UserPreference> = Immutable({
  paymentPackSort: SortOption.customSort,
  paymentPackCategoryFilter: [],
  paymentPackManagerOnlyFilter: ManagerOnly.showAll,
  privatePassSort: SortOption.customSort,
  privatePassCategoryFilter: [],
  privatePassManagerOnlyFilter: ManagerOnly.showAll,
  scheduleTimerange: {
    begin: '06:00:00',
    end: '23:00:00',
  },
  calendarFilter: {},
  scheduleFilter: defaultFilters,
  coachesScheduleFilter: {},
  establishmentsScheduleFilter: {},
  privateServicesScheduleFilter: {},
  memberPrivateBookingFilter: {},
  workshopGroupFilter: {},
  workshopDetailGroupFilter: {},
  shrinkResponsiveDrawer: false,
  replacementRequestManagerFilter: {
    timePeriod: 'next_month',
    min_date: moment().format('YYYY-MM-DD'),
    max_date: moment().add(1, 'month').format('YYYY-MM-DD'),
  },
  replacementRequestOfferHistoryFilter: {
    timePeriod: 'last_month',
    min_date: moment().subtract(1, 'month').format('YYYY-MM-DD'),
    max_date: moment().format('YYYY-MM-DD'),
  },
  hideCoachNotAssociatedToPrivateServiceWarning: false,
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
    [userPreferenceActions.setPrivatePassSort.toString()]: (
      state,
      { payload },
    ) => {
      return state.set('privatePassSort', payload);
    },
    [userPreferenceActions.setPrivatePassCategoryFilter.toString()]: (
      state,
      { payload },
    ) => {
      return state.set('privatePassCategoryFilter', payload);
    },
    [userPreferenceActions.setPrivatePassManagerOnlyFilter.toString()]: (
      state,
      { payload },
    ) => {
      return state.set('privatePassManagerOnlyFilter', payload);
    },
    [userPreferenceActions.setScheduleTimerange.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(['scheduleTimerange', 'begin'], payload.begin)
        .setIn(['scheduleTimerange', 'end'], payload.end);
    },
    [userPreferenceActions.setCalendarFilter.toString()]: (
      state,
      { payload },
    ) => {
      return state.set('calendarFilter', payload);
    },
    [userPreferenceActions.setScheduleFilter.toString()]: (
      state,
      { payload },
    ) => {
      return state.set('scheduleFilter', payload);
    },
    [userPreferenceActions.setCoachScheduleFilter.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['coachesScheduleFilter', payload.coach],
        payload.scheduleFilter,
      );
    },
    [userPreferenceActions.setEstablishmentScheduleFilter.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['establishmentsScheduleFilter', payload.establishment],
        payload.scheduleFilter,
      );
    },
    [userPreferenceActions.setPrivateServiceScheduleFilter.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['privateServicesScheduleFilter', payload.privateService],
        payload.scheduleFilter,
      );
    },
    [userPreferenceActions.setMemberPrivateBookingFilter.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['memberPrivateBookingFilter'], payload);
    },
    [userPreferenceActions.setWorkshopGroupFilter.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['workshopGroupFilter'], payload);
    },

    [userPreferenceActions.setWorkshopDetailGroupFilter.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['workshopDetailGroupFilter'], payload);
    },

    [userPreferenceActions.setShrinkResponsiveDrawer.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['shrinkResponsiveDrawer'], payload);
    },
    [userPreferenceActions.setReplacementRequestManagerFilter.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['replacementRequestManagerFilter'], payload);
    },
    [userPreferenceActions.setReplacementRequestOfferHistoryFilter.toString()]:
      (state, { payload }) => {
        return state.setIn(['replacementRequestOfferHistoryFilter'], payload);
      },

    [userPreferenceActions.setHideCoachNotAssociatedToPrivateServiceWarning.toString()]:
      (state, { payload }: { payload: boolean }) => {
        return state.set(
          'hideCoachNotAssociatedToPrivateServiceWarning',
          payload,
        );
      },
  },
  initialState,
);
