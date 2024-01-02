import { AxiosResponse } from 'axios';
import {
  API_V1_URI,
  getAuth,
  post,
  API_URI,
  postAuth,
  buildUrlParams,
} from '../../http';
import type {
  PaymentGroup,
  PaymentMethod,
  InternalPaymentPayload,
  StripePayout,
  StripeBalance,
} from './types';
import type { BillingDetails } from '#libs/marketplace/types';

export const fetchPaymentMethodList = async (
  params: any = {},
): Promise<AxiosResponse<Array<PaymentMethod>>> => {
  return getAuth(
    `${API_V1_URI}/payment/payment_method/${buildUrlParams(params)}`,
  );
};

export const updatePaymentMethodBillingDetails = async (data: {
  member?: number;
  payment_method_id: string;
  billing_details: BillingDetails;
  company?: number;
}): Promise<AxiosResponse> => {
  return postAuth(
    `${API_V1_URI}/payment/payment_method/modify_billing_details_payment_method/`,
    data,
  );
};

export const detachPaymentMethod = async (
  params: { member?: number; payment_method_id: string; company?: number } = {
    payment_method_id: '',
  },
) => {
  return postAuth(`${API_V1_URI}/payment/payment_method/detach/`, {
    member: params.member,
    payment_method_id: params.payment_method_id,
    company: params.company,
  });
};

export const fetchOnSpotPaymentReport = async (params: any = {}) => {
  return getAuth(
    `${API_URI}/reporting/on-spot-payment/${buildUrlParams(params)}`,
  );
};

export const requestSetupIntentSecret = async (
  member?: number,
  company?: number,
  as_company: boolean = false,
  payment_method: string = '',
) => {
  return postAuth<{ client_secret: string }>(
    `${API_V1_URI}/payment/payment_method/register_setup_intent/`,
    {
      member,
      company,
      as_company,
      payment_method,
    },
  );
};

export const requestSetupIntentSecretNoAuth = async (
  member?: number,
  company?: number,
  as_company: boolean = false,
) => {
  return post(`${API_V1_URI}/payment/payment_method/register_setup_intent/`, {
    member,
    company,
    as_company,
  });
};

export const submitInternalPayment = async (data: any) => {
  return postAuth(`${API_V1_URI}/payment/internal_payment/`, data);
};

export const submitInternalPaymentInBackground = (
  id: number,
  data: InternalPaymentPayload,
) => {
  return postAuth(
    `${API_V1_URI}/payment/payment_group/${id}/handle_internal_payment_in_background_task/`,
    data,
  );
};

export const getPaymentGroupStatus = async (id: number) => {
  return getAuth(`${API_V1_URI}/payment/payment_group/${id}/status/`);
};

export const setEstablishmentBillingGroupOnCompletedPaymentGroupStatus = async (
  paymentGroupId: number,
  establishmentBillingGroupId: number,
) => {
  return postAuth(
    `${API_V1_URI}/payment/payment_group/set_establishment_billing_group/`,
    {
      payment_group_id: paymentGroupId,
      establishment_billing_group_id: establishmentBillingGroupId,
    },
  );
};

export const setBillingEstablishmentOnCompletedPaymentGroupStatus = async (
  paymentGroupId: number,
  establishmentId: number,
) => {
  return postAuth(
    `${API_V1_URI}/payment/payment_group/set_billing_establishment/`,
    {
      payment_group_id: paymentGroupId,
      establishment_id: establishmentId,
    },
  );
};

export const getPaymentGroupStatusBySecret = async (
  _payment_backend_id: string,
) => {
  return postAuth(`${API_V1_URI}/payment/payment_group/status_by_secret/`, {
    _payment_backend_id,
  });
};

export const fetchPaymentGroupList = async (params: any) => {
  return getAuth(
    `${API_V1_URI}/payment/payment_group/${buildUrlParams(params)}`,
  );
};

export const updateIntentToSavePaymentMethod = async (data: any) => {
  return postAuth<{ client_secret: string }>(
    `${API_V1_URI}/payment/payment_group/update_intent_to_save_payment_method/`,
    data,
  );
};

export const updateIntentToSavePaymentMethodWebview = async (data: any) => {
  return postAuth(
    `${API_V1_URI}/payment/payment_group/update_intent_to_save_payment_method_by_basket_id/`,
    data,
  );
};

export const fetchPayoutList = async (params: any) => {
  return getAuth(`${API_V1_URI}/payment/payout/${buildUrlParams(params)}`);
};

export const updatePaymentGroupPriceCts = async (
  id: number,
  price_cts: number,
) => {
  return postAuth<PaymentGroup>(
    `${API_V1_URI}/payment/payment_group/${id}/update_price/`,
    {
      price_cts,
    },
  );
};

export const blockPendingBasket = async (basketId: string) => {
  return postAuth(
    `${API_V1_URI}/checkout/basket/${basketId}/block_pending_basket/`,
  );
};

export const verifyPriceBasket = async (basketId: string) => {
  return postAuth(`${API_V1_URI}/checkout/basket/${basketId}/verify_price/`);
};

export const checkItemsBasket = async (basketId: string) => {
  return postAuth(`${API_V1_URI}/checkout/basket/${basketId}/check_items/`);
};

export const setPaymentMethodAsDefault = async (params: any) => {
  return postAuth(`${API_V1_URI}/payment/payment_method/set_default/`, params);
};

export const confirmPaymentByPaymentMethodId = async (
  paymentGroupId: number,
  paymentMethodId: number,
) => {
  return postAuth(
    `${API_V1_URI}/payment/payment_group/confirm_payment_intent/`,
    { payment_group_id: paymentGroupId, payment_method_id: paymentMethodId },
  );
};

export const confirmPaymentByPaymentMethodIdWebview = async (
  paymentGroupId: number,
  paymentMethodId: number,
  basketId: string,
) => {
  return postAuth(
    `${API_V1_URI}/payment/payment_group/confirm_payment_intent_by_basket_id/`,
    {
      payment_group_id: paymentGroupId,
      payment_method_id: paymentMethodId,
      basket_id: basketId,
    },
  );
};

export const createPendingBookings = async (
  basketId: string,
  data: { payment_group_method_identifier?: number } = {},
) => {
  return postAuth(
    `${API_V1_URI}/checkout/basket/${basketId}/create_pending_bookings/`,
    data,
  );
};

// -------------- STRIPE --------------

export const fetchStripeBalance = async () => {
  return getAuth<StripeBalance[]>(
    `${API_V1_URI}/payment_backend/stripe/company/retrieve_stripe_balance`,
  );
};

export const fetchStripePayoutList = async (params: {
  page_size: number;
  starting_after?: string;
}) => {
  return getAuth<StripePayout[]>(
    `${API_V1_URI}/payment/stripe/payout${buildUrlParams(params)}`,
  );
};
