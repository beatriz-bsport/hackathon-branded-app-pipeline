// @flow
import {
  API_V1_URI,
  getAuth,
  postAuth,
  patchAuth,
  buildUrlParams,
} from '../../http';

export async function fetchAll({
  page,
  pageSize,
  queryParams,
}: {
  page: number,
  pageSize: number,
  queryParams: string,
}) {
  return getAuth(
    `${API_V1_URI}/payment/invoices/?page_size=${pageSize}&page=${page}${
      queryParams ? `&${queryParams}` : ''
    }`,
  );
}

export async function fetchByQuery(params: *) {
  const urlParams = buildUrlParams(params);
  return getAuth(`${API_V1_URI}/payment/invoices/${urlParams}`);
}

export async function fetchSpecific(invoiceId: number) {
  return getAuth(`${API_V1_URI}/payment/invoices/${invoiceId}/`);
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

export async function create(invoiceData: *) {
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

export async function revert(uuid: string) {
  return postAuth(`${API_V1_URI}/payment/invoices/${uuid}/revert/`, {});
}

export async function returnPayment(uuid: string) {
  return postAuth(`${API_V1_URI}/payment/payments/${uuid}/return_payment/`, {});
}

export async function update(invoiceData: *) {
  return patchAuth(
    `${API_V1_URI}/payment/invoices/${invoiceData.uuid}/`,
    invoiceData,
  );
}

export async function createQuick(invoiceData: *) {
  return postAuth(`${API_V1_URI}/payment/invoices/quick_create/`, invoiceData);
}

export async function patchConfiguration(data: *) {
  return patchAuth(`${API_V1_URI}/payment/configuration/me/`, data);
}

export async function fetchPaymentList(params: * = {}) {
  return getAuth(`${API_V1_URI}/payment/payments/${buildUrlParams(params)}`);
}

export async function fetchInvoiceItemList(params: * = {}) {
  return getAuth(
    `${API_V1_URI}/payment/invoice_items/${buildUrlParams(params)}`,
  );
}

export async function checkInvoiceInfo(uuid: string) {
  return getAuth(`${API_V1_URI}/payment/invoices/${uuid}/info/`);
}
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
