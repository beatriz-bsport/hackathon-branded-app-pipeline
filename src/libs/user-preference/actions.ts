// @ts-nocheck
import { createAction } from 'redux-actions';
import { Dispatch } from 'redux';
import {
  ManagerOnly,
  SortOption,
} from '../payment-packs/components/PaymentPackFilterAndSortHeader.component';
import type { OfferFilter } from '#libs/offer/types';
import type {
  PrivateBookingFilter,
  ScheduleFilter,
  doNotDisplayDeleteStepDialogCadenceIds,
  doNotDisplayConvertStepIntoExitDialogCadenceIds,
  doNotDisplayPauseDialogCadenceIds,
} from './types';
import type { OffersGroupFilter } from '#libs/meta-activity/types';
import type {
  ReplacementRequestFilter,
  ReplacementRequestOfferHistoryFilter,
} from '#libs/replacement-request/types';

export const userPreferenceActions = {
  setPaymentPackSort: createAction('USER_PREFERENCE/PAYMENT_PACK_SORT'),
  setPaymentPackCategoryFilter: createAction(
    'USER_PREFERENCE/PAYMENT_PACK_CATEGORY_FILTER',
  ),
  setPaymentPackManagerOnlyFilter: createAction(
    'USER_PREFERENCE/PAYMENT_PACK_MANAGERONLY_FILTER',
  ),
  setPrivatePassSort: createAction('USER_PREFERENCE/PRIVATE_PASS_SORT'),
  setPrivatePassCategoryFilter: createAction(
    'USER_PREFERENCE/PRIVATE_PASS_CATEGORY_FILTER',
  ),
  setPrivatePassManagerOnlyFilter: createAction(
    'USER_PREFERENCE/PRIVATE_PASS_MANAGERONLY_FILTER',
  ),
  setScheduleTimerange: createAction('USER_PREFERENCE/SCHEDULE/TIMERANGE'),
  setCalendarFilter: createAction('USER_PREFERENCE/CALENDAR_FILTER'),
  setScheduleFilter: createAction('USER_PREFERENCE/SCHEDULE_FILTER'),
  setCoachScheduleFilter: createAction(
    'USER_PREFERENCE/COACHES_SCHEDULE_FILTER',
  ),
  setEstablishmentScheduleFilter: createAction(
    'USER_PREFERENCE/ESTABLISHMENTS_SCHEDULE_FILTER',
  ),
  setPrivateServiceScheduleFilter: createAction(
    'USER_PREFERENCE/PRIVATE_SERVICES_SCHEDULE_FILTER',
  ),
  setMemberPrivateBookingFilter: createAction(
    'USER_PREFERENCE/MEMBER_PRIVATE_BOOKING_FILTER',
  ),
  setWorkshopGroupFilter: createAction('USER_PREFERENCE/WORKSHOP_GROUP_FILTER'),
  setWorkshopDetailGroupFilter: createAction(
    'USER_PREFERENCE/WORKSHOP_GROUP_DETAIL_FILTER',
  ),
  setShrinkResponsiveDrawer: createAction(
    'USER_PREFERANCE/RESPONSIVE_DRAWER_SHRINK',
  ),
  setReplacementRequestManagerFilter: createAction(
    'USER_PREFERENCE/REPLACEMENT_REQUEST_MANAGER_FILTER',
  ),
  setReplacementRequestOfferHistoryFilter: createAction(
    'USER_PREFERENCE/REPLACEMENT_REQUEST_OFFER_HISTORY_FILTER',
  ),
  setHideCoachNotAssociatedToPrivateServiceWarning: createAction<boolean>(
    'USER_PREFERANCE/HIDE_ASSOCIATED_COACH_WITHOUTH_PRIVATE_SERVICE_DIALOG',
  ),
  doNotDisplayDeleteStepDialogAnymore:
    createAction<doNotDisplayDeleteStepDialogCadenceIds>(
      'USER_PREFERENCE/ADD_DO_NOT_DISPLAY_DELETE_STEP_DIALOG_CADENCE_IDS',
    ),
  doNotDisplayConvertStepIntoExitDialogAnymore:
    createAction<doNotDisplayConvertStepIntoExitDialogCadenceIds>(
      'USER_PREFERENCE/ADD_DO_NOT_DISPLAY_CONVERT_STEP_EXIT_DIALOG_CADENCE_IDS',
    ),
  doNotDisplayPauseDialogAnymore:
    createAction<doNotDisplayPauseDialogCadenceIds>(
      'USER_PREFERENCE/ADD_DO_NOT_DISPLAY_PAUSE_DIALOG_CADENCE_IDS',
    ),
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

export function setPrivatePassSort(sortOption: SortOption) {
  return async (dispatch: Dispatch) => {
    dispatch(userPreferenceActions.setPrivatePassSort(sortOption));
  };
}

export function setPrivatePassCategoryFilter(categories: Array<number>) {
  return async (dispatch: Dispatch) => {
    dispatch(userPreferenceActions.setPrivatePassCategoryFilter(categories));
  };
}

export function setPrivatePassManagerOnlyFilter(option: ManagerOnly) {
  return async (dispatch: Dispatch) => {
    dispatch(userPreferenceActions.setPrivatePassManagerOnlyFilter(option));
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

export function setCalendarFilter(option: OfferFilter) {
  return async (dispatch: Dispatch) => {
    dispatch(userPreferenceActions.setCalendarFilter(option));
  };
}

export function setScheduleFilter(option: ScheduleFilter) {
  return async (dispatch: Dispatch) => {
    dispatch(userPreferenceActions.setScheduleFilter(option));
  };
}

export function setCoachScheduleFilter(option: {
  coach: number;
  scheduleFilter: ScheduleFilter;
}) {
  return async (dispatch: Dispatch) => {
    dispatch(userPreferenceActions.setCoachScheduleFilter(option));
  };
}

export function setEstablishmentScheduleFilter(option: {
  establishment: number;
  scheduleFilter: ScheduleFilter;
}) {
  return async (dispatch: Dispatch) => {
    dispatch(userPreferenceActions.setEstablishmentScheduleFilter(option));
  };
}

export function setPrivateServiceScheduleFilter(option: {
  privateService: number;
  scheduleFilter: ScheduleFilter;
}) {
  return async (dispatch: Dispatch) => {
    dispatch(userPreferenceActions.setPrivateServiceScheduleFilter(option));
  };
}

export function setMemberPrivateBookingFilter(filter: PrivateBookingFilter) {
  return async (dispatch: Dispatch) => {
    dispatch(userPreferenceActions.setMemberPrivateBookingFilter(filter));
  };
}

export function setWorkshopGroupFilter(filter: OffersGroupFilter) {
  return async (dispatch: Dispatch) => {
    Object.keys(filter)?.forEach((key) => {
      if (filter[key] === null || filter[key] === undefined) {
        // eslint-disable-next-line no-param-reassign
        delete filter[key];
      }
    });

    dispatch(userPreferenceActions.setWorkshopGroupFilter(filter));
  };
}

export function setWorkshopDetailGroupFilter(filter: OffersGroupFilter) {
  return async (dispatch: Dispatch) => {
    Object.keys(filter)?.forEach((key) => {
      if (filter[key] === null || filter[key] === undefined) {
        // eslint-disable-next-line no-param-reassign
        delete filter[key];
      }
    });

    dispatch(userPreferenceActions.setWorkshopDetailGroupFilter(filter));
  };
}

export function setShrinkResponsiveDrawer(shrink: boolean) {
  return async (dispatch: Dispatch) => {
    dispatch(userPreferenceActions.setShrinkResponsiveDrawer(shrink));
  };
}

export function setReplacementRequestManagerFilter(
  filter: ReplacementRequestFilter,
) {
  return async (dispatch: Dispatch) => {
    dispatch(userPreferenceActions.setReplacementRequestManagerFilter(filter));
  };
}

export function setReplacementRequestOfferHistoryFilter(
  filter: ReplacementRequestOfferHistoryFilter,
) {
  return async (dispatch: Dispatch) => {
    dispatch(
      userPreferenceActions.setReplacementRequestOfferHistoryFilter(filter),
    );
  };
}

export function setHideCoachNotAssociatedToPrivateServiceWarning(
  hide: boolean,
) {
  return async (dispatch: Dispatch) => {
    dispatch(
      userPreferenceActions.setHideCoachNotAssociatedToPrivateServiceWarning(
        hide,
      ),
    );
  };
}

export function doNotDisplayDeleteStepDialogAnymore(cadenceId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(
      userPreferenceActions.doNotDisplayDeleteStepDialogAnymore(cadenceId),
    );
  };
}

export function doNotDisplayConvertStepIntoExitDialogAnymore(
  cadenceId: number,
) {
  return async (dispatch: Dispatch) => {
    dispatch(
      userPreferenceActions.doNotDisplayConvertStepIntoExitDialogAnymore(
        cadenceId,
      ),
    );
  };
}

export function doNotDisplayPauseDialogAnymore(cadenceId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(userPreferenceActions.doNotDisplayPauseDialogAnymore(cadenceId));
  };
}
