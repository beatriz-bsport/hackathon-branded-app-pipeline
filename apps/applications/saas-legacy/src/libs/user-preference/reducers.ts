import Immutable from 'seamless-immutable';
import { DateTime } from 'luxon';
import { handleActions } from 'redux-actions';
import { userPreferenceActions } from './actions';
import { UserPreference } from './types';
import {
  ManagerOnly,
  SortOption,
} from '../payment-packs/components/PaymentPackFilterAndSortHeader.component';
import { defaultFilters } from './selectors';
import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories.js';

const initialState: Immutable.Immutable<UserPreference> =
  Immutable<UserPreference>({
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
      // @ts-expect-error
      min_date: DateTime.now().toISODate(),
      max_date: DateTime.now().plus({ month: 1 }).toISODate(),
      offer_available: true,
    },
    replacementRequestOfferHistoryFilter: {
      timePeriod: 'month',
      min_date: DateTime.now().minus({ month: 1 }).toISODate(),
      max_date: DateTime.now().toISODate(),
      // @ts-expect-error
      offer_available: true,
    },
    hideCoachNotAssociatedToPrivateServiceWarning: false,
    doNotDisplayDeleteStepDialogCadenceIds: [],
    doNotDisplayConvertStepIntoExitDialogCadenceIds: [],
    doNotDisplayEditingCadencePopinCadenceIds: [],
    doNotDisplayPauseDialogCadenceIds: [],
    doNotDisplayCadenceWelcomeDialog: false,
    isCheckInFilterLocked: true,
    lastVisitedReportV2: {},
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
    [userPreferenceActions.doNotDisplayDeleteStepDialogAnymore.toString()]: (
      state,
      { payload }: { payload: number },
    ) => {
      return state.set('doNotDisplayDeleteStepDialogCadenceIds', [
        ...(state.doNotDisplayDeleteStepDialogCadenceIds ?? []),
        payload,
      ]);
    },
    [userPreferenceActions.doNotDisplayDeleteExitDialogAnymore.toString()]: (
      state,
      { payload }: { payload: number },
    ) => {
      return state.set('doNotDisplayDeleteExitDialogCadenceIds', [
        ...(state.doNotDisplayDeleteExitDialogCadenceIds ?? []),
        payload,
      ]);
    },
    [userPreferenceActions.doNotDisplayConvertStepIntoExitDialogAnymore.toString()]:
      (state, { payload }: { payload: number }) => {
        return state.set('doNotDisplayConvertStepIntoExitDialogCadenceIds', [
          ...(state.doNotDisplayConvertStepIntoExitDialogCadenceIds ?? []),
          payload,
        ]);
      },
    [userPreferenceActions.doNotDisplayEditingCadencePopinAnymore.toString()]: (
      state,
      { payload }: { payload: number },
    ) => {
      return state.set('doNotDisplayEditingCadencePopinCadenceIds', [
        ...(state.doNotDisplayEditingCadencePopinCadenceIds ?? []),
        payload,
      ]);
    },
    [userPreferenceActions.doNotDisplayPauseDialogAnymore.toString()]: (
      state,
      { payload }: { payload: number },
    ) => {
      return state.set('doNotDisplayPauseDialogCadenceIds', [
        ...(state.doNotDisplayPauseDialogCadenceIds ?? []),
        payload,
      ]);
    },
    [userPreferenceActions.doNotDisplayWelcomeDialogAnymore.toString()]: (
      state,
    ) => {
      return state.set('doNotDisplayCadenceWelcomeDialog', true);
    },
    [userPreferenceActions.lockCheckInFilter.toString()]: (state) => {
      return state.set('isCheckInFilterLocked', true);
    },
    [userPreferenceActions.unlockCheckInFilter.toString()]: (state) => {
      return state.set('isCheckInFilterLocked', false);
    },
    [userPreferenceActions.setLastVisitedReportV2.toString()]: (
      state,
      {
        payload,
      }: { payload: { categoryName: ReportCategoryEnum; reportId: number } },
    ) => {
      return state.setIn(
        ['lastVisitedReportV2', payload.categoryName],
        payload.reportId,
      );
    },
  },
  initialState,
);
