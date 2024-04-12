import { createAction } from 'redux-actions';

export const fetchMyPastBookingAsMemberActions = {
  success: createAction('BOOKING/PAST/AS_MEMBER/SUCCESS'),
  isLoading: createAction<boolean>('BOOKING/PAST/AS_MEMBER/IS_LOADING'),
  error: createAction<Error | null>('BOOKING/PAST/AS_MEMBER/ERROR'),
};

export const fetchMyFutureBookingAsMemberActions = {
  success: createAction('BOOKING/FUTURE/AS_MEMBER/SUCCESS'),
  isLoading: createAction<boolean>('BOOKING/FUTURE/AS_MEMBER/IS_LOADING'),
  error: createAction<Error | null>('BOOKING/FUTURE/AS_MEMBER/ERROR'),
};

export const fetchMyBookingOptionAsMemberActions = {
  success: createAction('BOOKING_OPTION/AS_MEMBER/SUCCESS'),
  isLoading: createAction<boolean>('BOOKING_OPTION/AS_MEMBER/IS_LOADING'),
  error: createAction<Error | null>('BOOKING_OPTION/AS_MEMBER/ERROR'),
};

export const fetchMyBookingOptionWorkshopAsMemberActions = {
  success: createAction('BOOKING_OPTION/WORKSHOP/AS_MEMBER/SUCCESS'),
  isLoading: createAction<boolean>(
    'BOOKING_OPTION/WORKSHOP/AS_MEMBER/IS_LOADING',
  ),
  error: createAction<Error | null>('BOOKING_OPTION/WORKSHOP/AS_MEMBER/ERROR'),
};

export const fetchMyPastPrivateBookingAsMemberActions = {
  success: createAction('PRIVATE_BOOKING/PAST/AS_MEMBER/SUCCESS'),
  isLoading: createAction<boolean>('PRIVATE_BOOKING/PAST/AS_MEMBER/IS_LOADING'),
  error: createAction<Error | null>('PRIVATE_BOOKING/PAST/AS_MEMBER/ERROR'),
};

export const fetchMyFuturePrivateBookingAsMemberActions = {
  success: createAction('PRIVATE_BOOKING/FUTURE/AS_MEMBER/SUCCESS'),
  isLoading: createAction<boolean>(
    'PRIVATE_BOOKING/FUTURE/AS_MEMBER/IS_LOADING',
  ),
  error: createAction<Error | null>('PRIVATE_BOOKING/FUTURE/AS_MEMBER/ERROR'),
};

export const fetchMyPastBookingWorkshopAsMemberActions = {
  success: createAction('WORKSHOP/PAST/AS_MEMBER/SUCCESS'),
  isLoading: createAction<boolean>('WORKSHOP/PAST/AS_MEMBER/IS_LOADING'),
  error: createAction<Error | null>('WORKSHOP/PAST/AS_MEMBER/ERROR'),
};

export const fetchMyFutureBookingWorkshopAsMemberActions = {
  success: createAction('WORKSHOP/FUTURE/AS_MEMBER/SUCCESS'),
  isLoading: createAction<boolean>('WORKSHOP/FUTURE/AS_MEMBER/IS_LOADING'),
  error: createAction<Error | null>('WORKSHOP/FUTURE/AS_MEMBER/ERROR'),
};

export const resetConsumerStateActions = {
  all: createAction('CONSUMER_STATE_REWORKED/RESET'),
};

export const cancelBookingAsMemberActions = {
  success: createAction('BOOKING/CANCEL/AS_MEMBER/SUCCESS'),
  isLoading: createAction<boolean>('BOOKING/CANCEL/AS_MEMBER/IS_LOADING'),
  error: createAction<Error | null>('BOOKING/CANCEL/AS_MEMBER/ERROR'),
};

export const cancelPrivateBookingAsMemberActions = {
  success: createAction('PRIVATE_BOOKING/CANCEL/AS_MEMBER/SUCCESS'),
  isLoading: createAction<boolean>(
    'PRIVATE_BOOKING/CANCEL/AS_MEMBER/IS_LOADING',
  ),
  error: createAction<Error | null>('PRIVATE_BOOKING/CANCEL/AS_MEMBER/ERROR'),
};

export const cancelBookingOptionAsMemberActions = {
  success: createAction('BOOKING_OPTION/CANCEL/SUCCESS'),
  isLoading: createAction<boolean>('BOOKING_OPTION/CANCEL/IS_LOADING'),
  error: createAction<Error | null>('BOOKING_OPTION/CANCEL/ERROR'),
};
