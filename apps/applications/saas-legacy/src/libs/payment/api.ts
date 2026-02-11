import type { AxiosResponse } from 'axios';
import type {
  BookkeepingAccount,
  CreatePaymentAttemptResponsePayload,
  DetachPaymentMethodPayload,
  DetachPaymentMethodResponse,
  fetchBookkeepingAccountListFilter,
  InternalPaymentPayload,
  PaymentGroup,
  PaymentMethod,
  StripeBalance,
  StripePaymentMethodDomain,
  StripePayout,
} from '#src/libs/payment/types';
import type { BillingDetails } from '#src/libs/marketplace/types';
import {
  buildUrlParams,
  deleteAuth,
  getAuth,
  getAuthToken,
  patchAuth,
  post,
  postAuth,
} from '#src/http';
import Config from '#src/config';
import { WIDGET_PARENT_DOMAIN_STORAGE_KEY } from '#src/libs/widget/constants';

const API_V1_URI = Config.REACT_APP_BASE_URI_FINANCIAL_SERVICES_V1;
const API_URI_BUSINESS_INSIGHTS =
  Config.REACT_APP_BASE_URI_BUSINESS_INSIGHTS_V0;

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
  payload: DetachPaymentMethodPayload = {
    payment_method_id: '',
    member: undefined,
  },
) => {
  return postAuth<DetachPaymentMethodResponse>(
    `${API_V1_URI}/payment/payment_method/detach/`,
    {
      member: payload.member,
      payment_method_id: payload.payment_method_id,
      company: payload.company,
    },
  );
};

export const fetchOnSpotPaymentReport = async (params: any = {}) => {
  return getAuth(
    `${API_URI_BUSINESS_INSIGHTS}/reporting/on-spot-payment/${buildUrlParams(
      params,
    )}`,
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

export const submitInternalPayment = async (data: InternalPaymentPayload) => {
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

export const getPaymentGroup = async (id: number) => {
  return getAuth<PaymentGroup>(`${API_V1_URI}/payment/payment_group/${id}/`);
};

export const getPaymentGroupStatus = async (id: number) => {
  return getAuth<number>(`${API_V1_URI}/payment/payment_group/${id}/status/`);
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
  return postAuth<number>(
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

export const createPaymentAttempt = ({
  paymentGroupId,
}: {
  paymentGroupId: number;
}): Promise<AxiosResponse<CreatePaymentAttemptResponsePayload>> => {
  return postAuth(
    `${API_V1_URI}/payment/payment_group/${paymentGroupId}/create_payment_attempt/`,
  );
};

export const createPaymentAttemptWebview = ({
  paymentGroupId,
  basketId,
}: {
  paymentGroupId: number;
  basketId: string;
}): Promise<AxiosResponse<CreatePaymentAttemptResponsePayload>> => {
  return postAuth(
    `${API_V1_URI}/payment/payment_group/create_payment_attempt_by_basket_id/`,
    { payment_group_id: paymentGroupId, basket_id: basketId },
  );
};

export const executePaymentAttempt = ({
  paymentGroupId,
}: {
  paymentGroupId: number;
}) => {
  return postAuth(
    `${API_V1_URI}/payment/payment_group/${paymentGroupId}/execute_payment_attempt/`,
  );
};

export const executePaymentAttemptWebview = ({
  paymentGroupId,
  basketId,
}: {
  paymentGroupId: number;
  basketId: string;
}) => {
  return postAuth(
    `${API_V1_URI}/payment/payment_group/execute_payment_attempt_by_basket_id/`,
    { payment_group_id: paymentGroupId, basket_id: basketId },
  );
};

export const createPendingBookingsAndBlockBasket = async (
  basketId: string,
  data: { payment_group_method_identifier?: number } = {},
) => {
  return postAuth(
    `${API_V1_URI}/checkout/basket/${basketId}/create_pending_bookings_and_block_basket/`,
    data,
  );
};

export const invalidatePendingBookingsAndUnblockBasket = async (
  basketId: string,
) => {
  return postAuth(
    `${API_V1_URI}/checkout/basket/${basketId}/invalidate_pending_bookings_and_unblock_basket/`,
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

export const checkStripePaymentMethodDomainRegistration = async (
  company_id: number,
): Promise<AxiosResponse<{ is_registered: boolean }>> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error(
      'Authentication token is required for domain registration check',
    );
  }

  // Get parent page domain - use document.referrer first, fallback to sessionStorage
  // (stored in WidgetUtils.setWidgetContext() when widget loads, in case document.referrer is empty)
  const storedParentDomain =
    sessionStorage.getItem(WIDGET_PARENT_DOMAIN_STORAGE_KEY) || '';
  const referrer = document.referrer || storedParentDomain || '';

  return post<{ is_registered: boolean }>(
    `${API_V1_URI}/payment_backend/stripe/stripe-payment-method-domain/check_domain_registration/`,
    { company_id },
    {
      'X-React-Referrer': referrer,
      Authorization: `Token ${token}`,
    },
  );
};

export const fetchStripePaymentMethodDomains = async (): Promise<
  AxiosResponse<StripePaymentMethodDomain[]>
> => {
  return getAuth<StripePaymentMethodDomain[]>(
    `${API_V1_URI}/payment_backend/stripe/stripe-payment-method-domain/`,
  );
};

export const registerStripePaymentMethodDomain = async (
  domain_name: string,
): Promise<AxiosResponse<StripePaymentMethodDomain>> => {
  return postAuth<StripePaymentMethodDomain>(
    `${API_V1_URI}/payment_backend/stripe/stripe-payment-method-domain/`,
    { domain_name },
  );
};

// -------------- Bookkeeping Accounts --------------

export const fetchBookkeepingAccountList = (
  params: fetchBookkeepingAccountListFilter = {},
) => {
  return getAuth<BookkeepingAccount[]>(
    `${API_V1_URI}/payment/bookkeeping_account/${buildUrlParams(params)}`,
  );
};

export const createBookkeepingAccount = (data: {
  account_name: string;
  account_number: string;
  vat_rate: string;
}) => {
  return postAuth<BookkeepingAccount>(
    `${API_V1_URI}/payment/bookkeeping_account/`,
    data,
  );
};

export const updateBookkeepingAccount = (
  id: number,
  data: {
    account_name?: string;
    account_number?: string;
    vat_rate?: string;
  },
) => {
  return patchAuth<BookkeepingAccount>(
    `${API_V1_URI}/payment/bookkeeping_account/${id}/`,
    data,
  );
};

export const deleteBookkeepingAccount = (id: number) => {
  return deleteAuth<null>(`${API_V1_URI}/payment/bookkeeping_account/${id}/`);
};

export const getLinkedProductNames = (bookkeepingAccountId: number) => {
  return getAuth<string[]>(
    `${API_V1_URI}/payment/bookkeeping_account/${bookkeepingAccountId}/products/`,
  );
};
