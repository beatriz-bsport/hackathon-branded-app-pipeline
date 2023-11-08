import { RootState } from '../../reducers';
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

export const getDoNotDisplayDeleteStepDialogCadenceIds = (state: RootState) =>
  state.userPreference.doNotDisplayDeleteStepDialogCadenceIds || [];

export const getDoNotDisplayConvertStepIntoExitDialogCadenceIds = (
  state: RootState,
) => state.userPreference.doNotDisplayConvertStepIntoExitDialogCadenceIds || [];

export const getDoNotDisplayPauseDialogCadenceIds = (state: RootState) =>
  state.userPreference.doNotDisplayPauseDialogCadenceIds || [];
