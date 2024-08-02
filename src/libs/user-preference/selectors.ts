import { createSelector } from 'reselect';
import type { RootState } from '../../reducers';
import type { ScheduleFilter } from './types';

export const defaultFilters: ScheduleFilter = {
  showOfferList: true,
  showPrivateBookings: true,
  showCustomEvents: true,
  hideCancelledEvents: true,
  timeGrid: 'timeGridWeek',
  zoomLevel: 1,
  resourceFilter: {
    resourceDatatypeFilter: null,
    resourceItemsFilter: [],
  },
};

export const getScheduleFilter = (state: RootState): ScheduleFilter =>
  state.userPreference.scheduleFilter || defaultFilters;

export const getCoachScheduleFilter = (
  state: RootState,
  id: number,
): ScheduleFilter =>
  state.userPreference.coachesScheduleFilter?.[id] || defaultFilters;

export const getEstablishmentScheduleFilter = (
  state: RootState,
  id: number,
): ScheduleFilter =>
  state.userPreference.establishmentsScheduleFilter?.[id] || defaultFilters;

export const getPrivateServiceScheduleFilter = (
  state: RootState,
  id: number,
): ScheduleFilter =>
  state.userPreference.privateServicesScheduleFilter?.[id] || defaultFilters;

export const getUserPreferencesCalendarFilter = (state: RootState): any =>
  state.userPreference.calendarFilter;
export const getMemberPrivateBookingFilter = (state: RootState) =>
  state.userPreference.memberPrivateBookingFilter || {};

export const getWorkshopGroupFilter = (state: RootState) =>
  state.userPreference.workshopGroupFilter || {};

export const getWorkshopDetailGroupFilter = (state: RootState) =>
  state.userPreference.workshopDetailGroupFilter || {};

export const getShrinkResponsiveDrawer = (state: RootState) =>
  state.userPreference.shrinkResponsiveDrawer || false;

// For Audience purpose :

const _getDoNotDisplayDeleteStepDialogCadenceIds = (state: RootState) =>
  state.userPreference.doNotDisplayDeleteStepDialogCadenceIds || [];

const _getDoNotDisplayDeleteExitDialogCadenceIds = (state: RootState) =>
  state.userPreference.doNotDisplayDeleteExitDialogCadenceIds || [];

const _getDoNotDisplayConvertStepIntoExitDialogCadenceIds = (
  state: RootState,
) => state.userPreference.doNotDisplayConvertStepIntoExitDialogCadenceIds || [];

const _getdoNotDisplayEditingCadencePopinCadenceIds = (state: RootState) =>
  state.userPreference.doNotDisplayEditingCadencePopinCadenceIds || [];

const _getDoNotDisplayPauseDialogCadenceIds = (state: RootState) =>
  state.userPreference.doNotDisplayPauseDialogCadenceIds || [];

export const getIsDeleteStepDialogHidden = createSelector(
  [
    _getDoNotDisplayDeleteStepDialogCadenceIds,
    (_: RootState, id: number) => id,
  ],
  (cadenceIds, id) => cadenceIds?.includes(id) ?? false,
);

export const getIsDeleteExitDialogHidden = createSelector(
  [
    _getDoNotDisplayDeleteExitDialogCadenceIds,
    (_: RootState, id: number) => id,
  ],
  (cadenceIds, id) => cadenceIds?.includes(id) ?? false,
);

export const getIsConvertStepIntoExitDialogHidden = createSelector(
  [
    _getDoNotDisplayConvertStepIntoExitDialogCadenceIds,
    (_: RootState, id: number) => id,
  ],
  (cadenceIds, id) => cadenceIds?.includes(id) ?? false,
);

export const getIsEditCadencePopinHidden = createSelector(
  [
    _getdoNotDisplayEditingCadencePopinCadenceIds,
    (_: RootState, id: number) => id,
  ],
  (cadenceIds, id) => cadenceIds?.includes(id) ?? false,
);

export const getIsPauseDialogHidden = createSelector(
  [_getDoNotDisplayPauseDialogCadenceIds, (_: RootState, id: number) => id],
  (cadenceIds, id) => cadenceIds?.includes(id) ?? false,
);

export const getDoNotDisplayCadenceWelcomeDialog = (state: RootState) =>
  state.userPreference.doNotDisplayCadenceWelcomeDialog;

export const getIsCheckInFilterLocked = (state: RootState) =>
  state.userPreference.isCheckInFilterLocked;

export const getIsReportV2Displayed = (state: RootState) =>
  state.userPreference.isReportV2Displayed;

export const getIsReportAlertDisplayedInV2 = (state: RootState) =>
  state.userPreference.isReportAlertDisplayedInV2;

export const getLastVisitedReportV2 = (state: RootState) =>
  state.userPreference.lastVisitedReportV2;
