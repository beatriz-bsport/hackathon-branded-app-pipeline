import type { AxiosResponse } from 'axios';

import type { PaginatedResponse } from '#src/state/types';
import type {
  Invoice,
  InvoiceAllowedReverseMethods,
  InvoiceFilter,
  InvoiceItemFilter,
  InvoiceV1Serializer,
  PaymentFilter,
  PlannedPaymentEvent,
  PlannedPaymentEventFilter,
  InvoiceConfigurationSerializer,
  InvoiceConfigurationMemberSerializer,
  InvoiceInfoSerializer,
  RequestClientSecretPayload,
  PlannedPaymentEventSerializer,
  InvoiceDetailsSerializer,
  OnboardingRequirementsResponse,
  FiskalySignEsInvoiceDetails,
} from '#src/libs/invoice/types';
import type { InvoiceItem } from '#src/libs/invoice/invoice-item/types';
import type { Payment } from '#src/libs/payment/types';
import { getAuth, post, postAuth, patchAuth, buildUrlParams } from '#src/http';
import Config from '../../config';

const API_V1_URI = Config.REACT_APP_BASE_URI_FINANCIAL_SERVICES_V1;

export async function fetchByQuery(
  params: InvoiceFilter & {
    page: number;
    page_size?: number;
  },
): Promise<
  AxiosResponse<PaginatedResponse<InvoiceV1Serializer> | InvoiceV1Serializer[]>
> {
  const urlParams = buildUrlParams(params);
  return getAuth(`${API_V1_URI}/payment/invoices/${urlParams}`);
}

export async function fetchSpecific(
  invoiceId: string,
): Promise<AxiosResponse<InvoiceV1Serializer>> {
  return getAuth(`${API_V1_URI}/payment/invoices/${invoiceId}/`);
}

export async function sendInvoiceToQuickbooks(
  invoiceId: string,
): Promise<AxiosResponse<Object>> {
  return postAuth(
    `${API_V1_URI}/payment/invoices/${invoiceId}/send_invoice_to_quickbooks/`,
  );
}

export async function fetchByInvoiceItem(
  buyable_item_identifier: number,
  object_id: number,
): Promise<AxiosResponse<InvoiceV1Serializer>> {
  return getAuth(
    `${API_V1_URI}/payment/invoices/by_invoice_item/${buildUrlParams({
      buyable_item_identifier,
      object_id,
    })}`,
  );
}

export async function getReceiptUrl(
  uuid: string,
): Promise<AxiosResponse<string>> {
  return postAuth(`${API_V1_URI}/payment/invoices/${uuid}/generate_receipt/`);
}

export async function updatePaymentMethod(
  uuid: string,
  newMethod: number,
): Promise<AxiosResponse<Payment>> {
  return patchAuth(`${API_V1_URI}/payment/payments/${uuid}/`, {
    payment_method: newMethod,
  });
}

export async function create(
  invoiceData: Invoice,
): Promise<AxiosResponse<InvoiceV1Serializer>> {
  return postAuth(`${API_V1_URI}/payment/invoices/`, invoiceData);
}

export async function finalize(
  uuid: string,
): Promise<AxiosResponse<InvoiceV1Serializer>> {
  return patchAuth(`${API_V1_URI}/payment/invoices/${uuid}/finalize/`, {
    is_finalized: true,
  });
}

export async function generateInvoiceXml(
  uuid: string,
): Promise<AxiosResponse<InvoiceV1Serializer>> {
  return patchAuth(`${API_V1_URI}/payment/invoices/${uuid}/generate_xml/`, {});
}

export function generateInvoiceXmlBulk(urlParams: {
  unexported_yet: boolean;
  from_last_month: boolean;
}) {
  return postAuth<string>(
    `${API_V1_URI}/payment/invoices/generate_xml_bulk_async/${buildUrlParams(
      urlParams,
    )}`,
  );
}

export async function fetchConfiguration(): Promise<
  AxiosResponse<InvoiceConfigurationSerializer>
> {
  return getAuth(`${API_V1_URI}/payment/configuration/me/`);
}

export function fetchInvoiceConfigurationAsMember(
  company_id: string,
): Promise<AxiosResponse<InvoiceConfigurationMemberSerializer>> {
  return getAuth(
    `${API_V1_URI}/payment/consumer-invoice-configuration/${company_id}/`,
  );
}

export async function revert(
  uuid: string,
  params: {
    reverse_type?: number;
    payment_method_to_reverse?: string;
  },
): Promise<AxiosResponse<InvoiceDetailsSerializer>> {
  return postAuth(`${API_V1_URI}/payment/invoices/${uuid}/revert/`, params);
}

export async function returnPayment(
  uuid: string,
): Promise<AxiosResponse<Payment>> {
  return postAuth(`${API_V1_URI}/payment/payments/${uuid}/return_payment/`, {});
}

export async function update(
  invoiceData: Invoice,
): Promise<AxiosResponse<InvoiceV1Serializer>> {
  return patchAuth(
    `${API_V1_URI}/payment/invoices/${invoiceData.uuid}/`,
    invoiceData,
  );
}
export async function createQuick(invoiceData: {
  memberId: number;
  offerId: number;
  paymentPackId: number;
  keep_credits?: boolean;
  establishment_billing_group_id?: number;
}): Promise<AxiosResponse<InvoiceDetailsSerializer>> {
  return postAuth(`${API_V1_URI}/payment/invoices/quick_create/`, invoiceData);
}

export function patchConfiguration(
  data: Partial<InvoiceConfigurationSerializer>,
): Promise<AxiosResponse<InvoiceConfigurationSerializer>> {
  return patchAuth(`${API_V1_URI}/payment/configuration/me/`, data);
}

export async function fetchPaymentList(
  params: PaymentFilter & {
    page: number;
    page_size?: number;
  },
): Promise<AxiosResponse<PaginatedResponse<Payment> | Payment[]>> {
  return getAuth(`${API_V1_URI}/payment/payments/${buildUrlParams(params)}`);
}

export async function fetchInvoiceItemList(
  params: InvoiceItemFilter & {
    page: number;
    page_size?: number;
  },
): Promise<AxiosResponse<PaginatedResponse<InvoiceItem> | InvoiceItem[]>> {
  return getAuth(
    `${API_V1_URI}/payment/invoice_items/${buildUrlParams(params)}`,
  );
}

export async function checkInvoiceInfo(
  uuid: string,
): Promise<AxiosResponse<InvoiceInfoSerializer>> {
  return getAuth(`${API_V1_URI}/payment/invoices/${uuid}/info/`);
}

export async function allocateDebtToInvoice(
  uuid: string,
): Promise<AxiosResponse<InvoiceConfigurationSerializer>> {
  return postAuth(`${API_V1_URI}/payment/invoices/${uuid}/allocate_debt/`);
}

export async function applyBalanceToUnpaid(
  member: number,
): Promise<AxiosResponse<string>> {
  return postAuth(`${API_V1_URI}/payment/invoices/apply_balance_to_unpaid/`, {
    member,
  });
}

export async function requestClientSecret(
  payment_engine_identifier: number,
  payment_intent_type: number,
  params: {
    basket?: string;
    requested_price_cts?: number;
    invoice?: string;
    member?: string;
    is_physical_payment_intent?: boolean;
  },
) {
  return postAuth<RequestClientSecretPayload>(
    `${API_V1_URI}/payment/payment_group/request_client_secret/`,
    { payment_engine_identifier, payment_intent_type, ...(params || {}) },
  );
}

export async function unauthenticatedRequestClientSecret(
  payment_engine_identifier: number,
  payment_intent_type: number,
  params: {
    basket?: string;
    requested_price_cts?: number;
    invoice?: string;
    member?: string;
    is_physical_payment_intent?: boolean;
  },
): Promise<AxiosResponse<RequestClientSecretPayload>> {
  return post(`${API_V1_URI}/payment/payment_group/request_client_secret/`, {
    payment_engine_identifier,
    payment_intent_type,
    ...(params || {}),
  });
}

export async function fetchPlannedPaymentEvent(
  params: PlannedPaymentEventFilter & {
    page: number;
    page_size?: number;
  },
): Promise<
  AxiosResponse<PaginatedResponse<PlannedPaymentEvent> | PlannedPaymentEvent[]>
> {
  return getAuth(
    `${API_V1_URI}/payment/planned_payment_event/${buildUrlParams(params)}`,
  );
}

export async function cancelPlannedPaymentEvent(
  id: number,
): Promise<AxiosResponse<PlannedPaymentEventSerializer>> {
  return postAuth(`${API_V1_URI}/payment/planned_payment_event/${id}/cancel/`);
}

export async function enablePlannedPaymentEvent(
  id: number,
): Promise<AxiosResponse<PlannedPaymentEventSerializer>> {
  return postAuth(`${API_V1_URI}/payment/planned_payment_event/${id}/enable/`);
}

export async function registerNowPlannedPaymentEvent(
  id: number,
): Promise<AxiosResponse<PlannedPaymentEventSerializer>> {
  return postAuth(
    `${API_V1_URI}/payment/planned_payment_event/${id}/register_now/`,
  );
}

export async function changePaymentMethodAndRegisterPlannedPaymentEvent(
  id: number,
  data: {
    payment_method_identifier?: number;
    payment_method_id: string;
    apply_to_all?: boolean;
    register_now?: boolean;
    extra_data?: {
      date: string;
      note: string;
    };
  },
): Promise<AxiosResponse<PlannedPaymentEventSerializer>> {
  return postAuth(
    `${API_V1_URI}/payment/planned_payment_event/${id}/change_method_and_register/`,
    data,
  );
}

export async function schedulePayment(
  uuid: string,
  data: {
    interval: string;
    nb_interval: number;
    payment_method_id: string;
    anchor_date?: string;
    payment_method_identifier: number;
    recurrence_basis: number;
  },
): Promise<AxiosResponse<PlannedPaymentEventSerializer>> {
  return postAuth(
    `${API_V1_URI}/payment/invoices/${uuid}/schedule_payment/`,
    data,
  );
}

export async function editCustomFooter(
  uuid: string,
  custom_footer: string,
): Promise<AxiosResponse<InvoiceDetailsSerializer>> {
  return postAuth(`${API_V1_URI}/payment/invoices/${uuid}/update_footer/`, {
    custom_footer,
  });
}

export async function editBillingEstablishent(
  uuid: string,
  billing_establishment_id: string,
): Promise<AxiosResponse<InvoiceV1Serializer>> {
  return postAuth(
    `${API_V1_URI}/payment/invoices/${uuid}/update_establishment/`,
    { billing_establishment_id },
  );
}
/**
 * Sends a POST request to update the establishment billing group of an invoice.
 *
 * @param {string} uuid - The UUID of the invoice.
 * @param {number} establishment_billing_group_id - The ID of the new establishment billing group.
 * @returns {Promise<AxiosResponse<InvoiceV1Serializer>>} - A promise that resolves to the response of the API request.
 */
export function editEstablishmentBillingGroup(
  uuid: string,
  establishment_billing_group_id: number,
) {
  return postAuth<InvoiceV1Serializer>(
    `${API_V1_URI}/payment/invoices/${uuid}/update_establishment_billing_group/`,
    { establishment_billing_group_id },
  );
}

export async function applyBalanceToInvoice(
  uuid: string,
): Promise<AxiosResponse<string>> {
  return postAuth(
    `${API_V1_URI}/payment/invoices/${uuid}/apply_balance_to_invoice/`,
  );
}

export const applyGiftcardOnInvoice = async (
  invoice_uuid: string,
  consumer_giftcard_id: number,
  amount: number,
): Promise<{ data: Invoice }> => {
  return postAuth(
    `${API_V1_URI}/payment/invoices/${invoice_uuid}/apply_giftcard_on_invoice/`,
    {
      amount,
      consumer_giftcard_id,
    },
  );
};

export const fetchInvoiceAllowedReverseTypes = (
  invoiceUuid: string,
): Promise<AxiosResponse<InvoiceAllowedReverseMethods>> => {
  return getAuth(
    `${API_V1_URI}/payment/invoices/${invoiceUuid}/allowed_reverse_methods/`,
  );
};

export async function checkFiskalyOnboardingStatus(): Promise<
  AxiosResponse<{ is_onboarded: boolean }>
> {
  return getAuth(
    `${API_V1_URI}/fiskaly-sign-es/fiskaly-sign-es-onboarding/is_company_onboarded/`,
  );
}

export async function getFiskalyOnboardingRequirements(): Promise<
  AxiosResponse<OnboardingRequirementsResponse>
> {
  return getAuth(
    `${API_V1_URI}/fiskaly-sign-es/fiskaly-sign-es-onboarding/get_onboarding_requirements/`,
  );
}

export async function onboardFiskalyCompany(): Promise<
  AxiosResponse<{ agreement_url: string }>
> {
  return postAuth(
    `${API_V1_URI}/fiskaly-sign-es/fiskaly-sign-es-onboarding/onboard_company/`,
  );
}

export async function getLastUploadedSignedAgreement(): Promise<
  AxiosResponse<{ signed_agreement_url: string } | null>
> {
  return postAuth(
    `${API_V1_URI}/fiskaly-sign-es/fiskaly-sign-es-collaborator-agreement/get_last_uploaded_signed_agreement/`,
    {},
  );
}

export async function uploadSignedAgreement(
  file: File,
): Promise<AxiosResponse<{ file: string }>> {
  const formData = new FormData();
  formData.append('signed_agreement_file', file);
  return postAuth(
    `${API_V1_URI}/fiskaly-sign-es/fiskaly-sign-es-collaborator-agreement/upload_signed_agreement/`,
    formData,
  );
}

export async function fetchFiskalySignEsInvoice(
  invoice_uuid: string,
): Promise<AxiosResponse<FiskalySignEsInvoiceDetails>> {
  return getAuth(
    `${API_V1_URI}/fiskaly_sign_es/fiskaly_sign_es_invoice/${invoice_uuid}/`,
  );
}

export async function manuallySendInvoiceToSignEs(data: {
  invoice_pk: string;
}): Promise<AxiosResponse<FiskalySignEsInvoiceDetails>> {
  return postAuth(
    `${API_V1_URI}/fiskaly_sign_es/fiskaly_sign_es_invoice/manually_send_invoice_to_sign_es/`,
    data,
  );
}

export default {
  fetchSpecific,
  updatePaymentMethod,
  create,
  update,
  createQuick,
  finalize,
  revert,
  fetchByQuery,
  fetchConfiguration,
  patchConfiguration,
  fetchByInvoiceItem,
  returnPayment,
  checkFiskalyOnboardingStatus,
  getFiskalyOnboardingRequirements,
  onboardFiskalyCompany,
  getLastUploadedSignedAgreement,
  uploadSignedAgreement,
  fetchFiskalySignEsInvoice,
  manuallySendInvoiceToSignEs,
};
