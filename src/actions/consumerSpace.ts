import { createAction } from 'redux-actions';
import type { PaginatedResponse } from 'bsport-saas/src/state/types';
import type { UniversalPassREST } from 'bsport-saas/src/libs/universal-pass/types';
import type { PrivateConsumerPassREST } from 'bsport-saas/src/libs/private-service/types';
import type { ConsumerPaymentPackREST } from 'bsport-saas/src/libs/consumer-payment-pack/types';
import type { ConsumerPassesTabDisplay } from 'bsport-saas/src/libs/consumer-space/types';
import type { OfferStatusWaitingListPosition } from 'bsport-saas/src/libs/offer/types';
import type { WaitingListBookingOption } from 'bsport-saas/src/libs/waiting-list/types';
import type {
  ConsumerInvoiceComplementary,
  ConsumerInvoiceREST,
} from 'bsport-saas/src/libs/invoice/types';
import type {
  SubscriptionREST,
  SubscriptionsInvoicesDetailsREST,
} from 'bsport-saas/src/libs/subscription/types';
import { SubscriptionTabEnum } from 'bsport-saas/src/libs/consumer-space/components/reworked/@MySubscriptions/constants';

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
  success: createAction<PaginatedResponse<WaitingListBookingOption>>(
    'BOOKING_OPTION/AS_MEMBER/SUCCESS',
  ),
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

export const fetchConsumerPassesTabDisplayActions = {
  success: createAction<ConsumerPassesTabDisplay>(
    'REWORKED/MY_PASSES_TABS/SUCCESS',
  ),
  isLoading: createAction<boolean>('REWORKED/MY_PASSES_TABS/IS_LOADING'),
  error: createAction<Error | null>('REWORKED/MY_PASSES_TABS/ERROR'),
};

export const fetchMyActiveConsumerPaymentPacksAsMemberActions = {
  success: createAction<PaginatedResponse<ConsumerPaymentPackREST>>(
    'REWORKED/CONSUMER_PAYMENT_PACK/ACTIVE/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>(
    'REWORKED/CONSUMER_PAYMENT_PACK/ACTIVE/AS_MEMBER/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'REWORKED/CONSUMER_PAYMENT_PACK/ACTIVE/AS_MEMBER/ERROR',
  ),
};

export const fetchMyActivePrivateConsumerPassesAsMemberActions = {
  success: createAction<PaginatedResponse<PrivateConsumerPassREST>>(
    'REWORKED/PRIVATE_CONSUMER_PASS/ACTIVE/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>(
    'REWORKED/PRIVATE_CONSUMER_PASS/ACTIVE/AS_MEMBER/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'REWORKED/PRIVATE_CONSUMER_PASS/ACTIVE/AS_MEMBER/ERROR',
  ),
};

export const fetchMyActiveUniversalPassesAsMemberActions = {
  success: createAction<PaginatedResponse<UniversalPassREST>>(
    'REWORKED/UNIVERSAL_PASS/ACTIVE/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>(
    'REWORKED/UNIVERSAL_PASS/ACTIVE/AS_MEMBER/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'REWORKED/UNIVERSAL_PASS/ACTIVE/AS_MEMBER/ERROR',
  ),
};

export const fetchMyExpiredConsumerPaymentPacksAsMemberActions = {
  success: createAction<PaginatedResponse<ConsumerPaymentPackREST>>(
    'REWORKED/CONSUMER_PAYMENT_PACK/EXPIRED/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>(
    'REWORKED/CONSUMER_PAYMENT_PACK/EXPIRED/AS_MEMBER/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'REWORKED/CONSUMER_PAYMENT_PACK/EXPIRED/AS_MEMBER/ERROR',
  ),
};

export const fetchMyExpiredPrivateConsumerPassesAsMemberActions = {
  success: createAction<PaginatedResponse<PrivateConsumerPassREST>>(
    'REWORKED/PRIVATE_CONSUMER_PASS/EXPIRED/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>(
    'REWORKED/PRIVATE_CONSUMER_PASS/EXPIRED/AS_MEMBER/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'REWORKED/PRIVATE_CONSUMER_PASS/EXPIRED/AS_MEMBER/ERROR',
  ),
};

export const fetchMyExpiredUniversalPassesAsMemberActions = {
  success: createAction<PaginatedResponse<UniversalPassREST>>(
    'REWORKED/UNIVERSAL_PASS/EXPIRED/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>(
    'REWORKED/UNIVERSAL_PASS/EXPIRED/AS_MEMBER/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'REWORKED/UNIVERSAL_PASS/EXPIRED/AS_MEMBER/ERROR',
  ),
};

export const fetchMyFutureConsumerPaymentPacksAsMemberActions = {
  success: createAction<PaginatedResponse<ConsumerPaymentPackREST>>(
    'REWORKED/CONSUMER_PAYMENT_PACK/FUTURE/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>(
    'REWORKED/CONSUMER_PAYMENT_PACK/FUTURE/AS_MEMBER/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'REWORKED/CONSUMER_PAYMENT_PACK/FUTURE/AS_MEMBER/ERROR',
  ),
};

export const fetchMyFuturePrivateConsumerPassesAsMemberActions = {
  success: createAction<PaginatedResponse<PrivateConsumerPassREST>>(
    'REWORKED/PRIVATE_CONSUMER_PASS/FUTURE/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>(
    'REWORKED/PRIVATE_CONSUMER_PASS/FUTURE/AS_MEMBER/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'REWORKED/PRIVATE_CONSUMER_PASS/FUTURE/AS_MEMBER/ERROR',
  ),
};

export const fetchMyFutureUniversalPassesAsMemberActions = {
  success: createAction<PaginatedResponse<UniversalPassREST>>(
    'REWORKED/UNIVERSAL_PASS/FUTURE/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>(
    'REWORKED/UNIVERSAL_PASS/FUTURE/AS_MEMBER/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'REWORKED/UNIVERSAL_PASS/FUTURE/AS_MEMBER/ERROR',
  ),
};

export const fetchConsumerGuestNumberEligibleLeftByOfferBulkActions = {
  isLoading: createAction<boolean>(
    'CONSUMER_BOOKING/GUEST_NUMBER_ELIGIBLE_LEFT/LOADING',
  ),
  error: createAction<Error | null>(
    'CONSUMER_BOOKING/GUEST_NUMBER_ELIGIBLE_LEFT/ERROR',
  ),
  success: createAction<Record<number, number>>(
    'CONSUMER_BOOKING/GUEST_NUMBER_ELIGIBLE_LEFT/SUCCESS',
  ),
};

export const fetchMyBookingOptionsPositionAsMemberByOfferIdsActions = {
  success: createAction<OfferStatusWaitingListPosition[]>(
    'BOOKING_OPTION_POSITION/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>(
    'BOOKING_OPTION_POSITION/AS_MEMBER/IS_LOADING',
  ),
  error: createAction<Error | null>('BOOKING_OPTION_POSITION/AS_MEMBER/ERROR'),
};

export const fetchConsumerInvoicesComplementaryActions = {
  isLoading: createAction<boolean>(
    'CONSUMER_INVOICE/COMPLEMENTARY_LIST/LOADING',
  ),
  error: createAction<Error | null>(
    'CONSUMER_INVOICE/COMPLEMENTARY_LIST/ERROR',
  ),
  success: createAction<ConsumerInvoiceComplementary[]>(
    'CONSUMER_INVOICE/COMPLEMENTARY_LIST/SUCCESS',
  ),
};

export const fetchConsumerPaidInvoicesActions = {
  isLoading: createAction<boolean>('CONSUMER_INVOICE/PAID/LIST/LOADING'),
  error: createAction<Error | null>('CONSUMER_INVOICE/PAID/LIST/ERROR'),
  success: createAction<PaginatedResponse<ConsumerInvoiceREST>>(
    'CONSUMER_INVOICE/PAID/LIST/SUCCESS',
  ),
};

export const fetchConsumerRefundedInvoicesActions = {
  isLoading: createAction<boolean>('CONSUMER_INVOICE/REFUNDED/LIST/LOADING'),
  error: createAction<Error | null>('CONSUMER_INVOICE/REFUNDED/LIST/ERROR'),
  success: createAction<PaginatedResponse<ConsumerInvoiceREST>>(
    'CONSUMER_INVOICE/REFUNDED/LIST/SUCCESS',
  ),
};

export const fetchConsumerUnpaidInvoicesActions = {
  isLoading: createAction<boolean>('CONSUMER_INVOICE/UNPAID/LIST/LOADING'),
  error: createAction<Error | null>('CONSUMER_INVOICE/UNPAID/LIST/ERROR'),
  success: createAction<PaginatedResponse<ConsumerInvoiceREST>>(
    'CONSUMER_INVOICE/UNPAID/LIST/SUCCESS',
  ),
};
export const fetchMyActiveSubscriptionsAsMemberActions = {
  success: createAction<PaginatedResponse<SubscriptionREST>>(
    'SUBSCRIPTIONS/ACTIVE/LIST/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>(
    'SUBSCRIPTIONS/ACTIVE/LIST/AS_MEMBER/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'SUBSCRIPTIONS/ACTIVE/LIST/AS_MEMBER/ERROR',
  ),
};

export const fetchActiveSubscriptionDetailAsMemberActions = {
  success: createAction<SubscriptionREST>(
    'SUBSCRIPTIONS/ACTIVE/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>('SUBSCRIPTIONS/ACTIVE/AS_MEMBER/IS_LOADING'),
  error: createAction<Error | null>('SUBSCRIPTIONS/ACTIVE/AS_MEMBER/ERROR'),
};

export const fetchFutureSubscriptionDetailAsMemberActions = {
  success: createAction<SubscriptionREST>(
    'SUBSCRIPTIONS/FUTURE/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>('SUBSCRIPTIONS/FUTURE/AS_MEMBER/IS_LOADING'),
  error: createAction<Error | null>('SUBSCRIPTIONS/FUTURE/AS_MEMBER/ERROR'),
};

export const fetchExpiredSubscriptionDetailAsMemberActions = {
  success: createAction<SubscriptionREST>(
    'SUBSCRIPTIONS/EXPIRED/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>(
    'SUBSCRIPTIONS/EXPIRED/AS_MEMBER/IS_LOADING',
  ),
  error: createAction<Error | null>('SUBSCRIPTIONS/EXPIRED/AS_MEMBER/ERROR'),
};

export const fetchMyFutureSubscriptionsAsMemberActions = {
  success: createAction<PaginatedResponse<SubscriptionREST>>(
    'SUBSCRIPTIONS/FUTURE/LIST/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>(
    'SUBSCRIPTIONS/FUTURE/LIST/AS_MEMBER/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'SUBSCRIPTIONS/FUTURE/LIST/AS_MEMBER/ERROR',
  ),
};

export const fetchMyExpiredSubscriptionsAsMemberActions = {
  success: createAction<PaginatedResponse<SubscriptionREST>>(
    'SUBSCRIPTIONS/EXPIRED/LIST/AS_MEMBER/SUCCESS',
  ),
  isLoading: createAction<boolean>(
    'SUBSCRIPTIONS/EXPIRED/LIST/AS_MEMBER/IS_LOADING',
  ),
  error: createAction<Error | null>(
    'SUBSCRIPTIONS/EXPIRED/LIST/AS_MEMBER/ERROR',
  ),
};

export const fetchConsumerSubscriptionInvoicesDetailsActions = {
  success: createAction<{
    billing_plan_id: number,
    data: PaginatedResponse<SubscriptionsInvoicesDetailsREST>,
  }>('SUBSCRIPTIONS/INVOICES/AS_MEMBER/SUCCESS'),

  isLoading: createAction<boolean>(
    'SUBSCRIPTIONS/INVOICES/AS_MEMBER/IS_LOADING',
  ),
  error: createAction<Error | null>('SUBSCRIPTIONS/INVOICES/AS_MEMBER/ERROR'),
};

export const fetchMySubscriptionAsMemberActions = {
  [SubscriptionTabEnum.ACTIVE]: fetchActiveSubscriptionDetailAsMemberActions,
  [SubscriptionTabEnum.FUTURE]: fetchFutureSubscriptionDetailAsMemberActions,
  [SubscriptionTabEnum.EXPIRED]: fetchExpiredSubscriptionDetailAsMemberActions,
};
