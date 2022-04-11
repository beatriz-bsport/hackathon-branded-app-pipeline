import { RootState } from '../../reducers';
import type { ScheduleFilter } from './types';

const defaultFilters = {
  showOfferList: true,
  showPrivateBookings: true,
  showCustomEvents: true,
  hideCancelledEvents: true,
};

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
