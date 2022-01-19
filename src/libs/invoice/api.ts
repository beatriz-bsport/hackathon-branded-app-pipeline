// @flow
import {
  API_V1_URI,
  getAuth,
  post,
  postAuth,
  patchAuth,
  buildUrlParams,
} from '../../http';

import type { Invoice } from './types';

export async function fetchAll({
  page,
  pageSize,
  queryParams,
}: {
  page: number;
  pageSize: number;
  queryParams: string;
}) {
  return getAuth(
    `${API_V1_URI}/payment/invoices/?page_size=${pageSize}&page=${page}${
      queryParams ? `&${queryParams}` : ''
    }`,
  );
}

export async function fetchByQuery(params: any) {
  const urlParams = buildUrlParams(params);
  return getAuth(`${API_V1_URI}/payment/invoices/${urlParams}`);
}

export async function fetchSpecific(invoiceId: string) {
  return getAuth(`${API_V1_URI}/payment/invoices/${invoiceId}/`);
}

export async function sendInvoiceToQuickbooks(invoiceId: string) {
  return postAuth(
    `${API_V1_URI}/payment/invoices/${invoiceId}/send_invoice_to_quickbooks/`,
  );
}

export async function fetchByInvoiceItem(
  buyable_item_identifier: number,
  object_id: number,
) {
  return getAuth(
    `${API_V1_URI}/payment/invoices/by_invoice_item/${buildUrlParams({
      buyable_item_identifier,
      object_id,
    })}`,
  );
}

export async function updatePaymentMethod(uuid: string, newMethod: number) {
  return patchAuth(`${API_V1_URI}/payment/payments/${uuid}/`, {
    payment_method: newMethod,
  });
}

export async function create(invoiceData: any) {
  return postAuth(`${API_V1_URI}/payment/invoices/`, invoiceData);
}

export async function finalize(uuid: string) {
  return patchAuth(`${API_V1_URI}/payment/invoices/${uuid}/finalize/`, {
    is_finalized: true,
  });
}

export async function fetchConfiguration() {
  return getAuth(`${API_V1_URI}/payment/configuration/me/`);
}

export async function revert(uuid: string, params: any = {}) {
  return postAuth(`${API_V1_URI}/payment/invoices/${uuid}/revert/`, params);
}

export async function returnPayment(uuid: string) {
  return postAuth(`${API_V1_URI}/payment/payments/${uuid}/return_payment/`, {});
}

export async function update(invoiceData: any) {
  return patchAuth(
    `${API_V1_URI}/payment/invoices/${invoiceData.uuid}/`,
    invoiceData,
  );
}
export async function createQuick(invoiceData: any) {
  return postAuth(`${API_V1_URI}/payment/invoices/quick_create/`, invoiceData);
}

export async function patchConfiguration(data: any) {
  return patchAuth(`${API_V1_URI}/payment/configuration/me/`, data);
}

export async function fetchPaymentList(params: any) {
  return getAuth(`${API_V1_URI}/payment/payments/${buildUrlParams(params)}`);
}

export async function fetchInvoiceItemList(params: any) {
  return getAuth(
    `${API_V1_URI}/payment/invoice_items/${buildUrlParams(params)}`,
  );
}

export async function checkInvoiceInfo(uuid: string) {
  return getAuth(`${API_V1_URI}/payment/invoices/${uuid}/info/`);
}

export async function allocateDebtToInvoice(uuid: string) {
  return postAuth(`${API_V1_URI}/payment/invoices/${uuid}/allocate_debt/`);
}

export async function applyBalanceToUnpaid(member: number) {
  return postAuth(`${API_V1_URI}/payment/invoices/apply_balance_to_unpaid/`, {
    member,
  });
}

export async function requestClientSecret(
  payment_engine_identifier: number,
  payment_intent_type: number,
  params: any = {},
) {
  return postAuth(
    `${API_V1_URI}/payment/payment_group/request_client_secret/`,
    { payment_engine_identifier, payment_intent_type, ...(params || {}) },
  );
}

export async function unauthenticatedRequestClientSecret(
  payment_engine_identifier: number,
  payment_intent_type: number,
  params: any = {},
) {
  return post(`${API_V1_URI}/payment/payment_group/request_client_secret/`, {
    payment_engine_identifier,
    payment_intent_type,
    ...(params || {}),
  });
}

export async function fetchPlannedPaymentEvent(params: any = {}) {
  return getAuth(
    `${API_V1_URI}/payment/planned_payment_event/${buildUrlParams(params)}`,
  );
}

export async function cancelPlannedPaymentEvent(id: number) {
  return postAuth(`${API_V1_URI}/payment/planned_payment_event/${id}/cancel/`);
}

export async function enablePlannedPaymentEvent(id: number) {
  return postAuth(`${API_V1_URI}/payment/planned_payment_event/${id}/enable/`);
}

export async function registerNowPlannedPaymentEvent(id: number) {
  return postAuth(
    `${API_V1_URI}/payment/planned_payment_event/${id}/register_now/`,
  );
}

export async function schedulePayment(uuid: string, data: any) {
  return postAuth(
    `${API_V1_URI}/payment/invoices/${uuid}/schedule_payment/`,
    data,
  );
}

export async function editCustomFooter(uuid: string, custom_footer: string) {
  return postAuth(`${API_V1_URI}/payment/invoices/${uuid}/update_footer/`, {
    custom_footer,
  });
}

export async function editBillingEstablishent(
  uuid: string,
  billing_establishment_id: number,
) {
  return postAuth(
    `${API_V1_URI}/payment/invoices/${uuid}/update_establishment/`,
    { billing_establishment_id },
  );
}

export async function applyBalanceToInvoice(uuid: string) {
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

export default {
  fetchAll,
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
};
