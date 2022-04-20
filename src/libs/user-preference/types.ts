import {
  ManagerOnly,
  SortOption,
} from '../payment-packs/components/PaymentPackFilterAndSortHeader.component';
import type { OfferFilter } from '#libs/offer/types';

export type ScheduleFilter = {
  showOfferList: boolean;
  showPrivateBookings: boolean;
  showCustomEvents: boolean;
  hideCancelledEvents: boolean;
};

export type PrivateBookingFilter = {
  is_recurrent?: boolean;
  future_booking?: boolean;
  past_booking?: boolean;
  was_refunded?: boolean;
  is_unpaid?: boolean;
  booking_status_code__in?: number[];
};

export type UserPreference = {
  paymentPackSort: SortOption;
  paymentPackCategoryFilter: Array<number>;
  paymentPackManagerOnlyFilter: ManagerOnly;
  privatePassSort: SortOption;
  privatePassCategoryFilter: Array<number>;
  privatePassManagerOnlyFilter: ManagerOnly;
  scheduleTimerange: { begin: string; end: string };
  calendarFilter: OfferFilter;
  scheduleFilter: ScheduleFilter;
  coachesScheduleFilter: { [key: string]: ScheduleFilter };
  establishmentsScheduleFilter: { [key: string]: ScheduleFilter };
  privateServicesScheduleFilter: { [key: string]: ScheduleFilter };
  memberPrivateBookingFilter: PrivateBookingFilter;
};
