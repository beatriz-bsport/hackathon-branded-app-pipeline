import { RootState } from '../../reducers';
import type { ScheduleFilter } from './types';

export const defaultFilters = {
  showOfferList: true,
  showPrivateBookings: true,
  showCustomEvents: true,
  hideCancelledEvents: true,
  timeGrid: 'timeGridWeek',
  zoomLevel: 1,
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
