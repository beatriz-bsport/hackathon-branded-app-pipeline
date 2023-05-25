// @ts-nocheck
import {
  WAITING_LIST_AUTO_CANCELLATION_DUMB,
  WAITING_LIST_AUTO_CANCELLATION_SMART,
} from '@bsport/common/lib/master-data/waiting-list-auto-cancellation';
import type { ErrorAndLoading } from '../types';

export enum WaitingListAutoCancellation {
  dumb = WAITING_LIST_AUTO_CANCELLATION_DUMB.id,
  smart = WAITING_LIST_AUTO_CANCELLATION_SMART.id,
}

export type WaitingListConfiguration = {
  company: number;
  auto_cancellation_type: WaitingListAutoCancellation;
  smart_delay_percentage: number;
  dumb_delay_minutes: number;
  auto_consume_pack: boolean;
  last_delay_before_auto_consume: number;
  autokick_delay: number;
  dynamic: number;
  is_option_blocking: boolean;
  check_credit: boolean;
  no_notification_utc_interval_hour_start: number;
  no_notification_utc_interval_hour_end: number;
};

export type WaitingListBookingOption = {
  id: number;
  waiting_list_class: number;
  is_convertible: boolean;
  date: string;
  consumer: number;
  offer: number;
  cancelled: boolean;
  booking?: number;
  member: number;
  object_type: 'booking';
  level: number;
  establishment: number;
  coach: number;
  meta_activity: number;
  source: number;
};

export type WaitingListState = {
  configuration: ErrorAndLoading & {
    data?: WaitingListConfiguration;
    update: ErrorAndLoading;
  };
  option: ErrorAndLoading & {
    items: WaitingListBookingOption[];
    byId: { [key: string]: WaitingListBookingOption };
    register: ErrorAndLoading;
    forBooking: ErrorAndLoading & {
      allIds: number[];
    };
    discard: ErrorAndLoading;
    forMember: ErrorAndLoading & {
      allIds: number[];
      page: number;
      count: number;
    };
  };
};

export type WaitingListBookingOptionQueryParams = {
  consumer?: number;
  offer?: number;
  is_convertible?: boolean;
  company?: number;
  mine?: boolean;
  min_date?: string;
  member?: number;
  as_manager?: boolean;
  no_related_field?: boolean;
  show_cancelled?: boolean;
};

export type WaitingListBookingOptionPaginatedQueryParams =
  WaitingListBookingOptionQueryParams & {
    page: number;
    page_size: number;
  };
