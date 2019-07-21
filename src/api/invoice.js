// @flow
import {
  API_URI,
  API_V1_URI,
  getAuth,
  postAuth,
  patchAuth,
  buildUrlParams,
} from '../http';

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
    `${API_URI}/payment/invoices/?page_size=${pageSize}&page=${page}${
      queryParams ? `&${queryParams}` : ''
    }`,
  );
}

export async function fetchByQuery(params: *) {
  const urlParams = buildUrlParams(params);
  return getAuth(`${API_URI}/payment/invoices/${urlParams}`);
}

export async function fetchSpecific(invoiceId: number) {
  return getAuth(`${API_URI}/payment/invoices/${invoiceId}/`);
}

export async function updatePaymentMethod(uuid: string, newMethod: number) {
  return patchAuth(`${API_URI}/payment/payments/${uuid}/`, {
    payment_method: newMethod,
  });
}

export async function create(invoiceData: *) {
  return postAuth(`${API_URI}/payment/invoices/`, invoiceData);
}

export async function finalize(uuid: string) {
  return patchAuth(`${API_URI}/payment/invoices/${uuid}/finalize/`, {
    is_finalized: true,
  });
}

export async function fetchConfiguration() {
  return getAuth(`${API_V1_URI}/payment/configuration/me/`);
}

export async function revert(uuid: string) {
  return postAuth(`${API_URI}/payment/invoices/${uuid}/revert/`, {});
}

export async function update(invoiceData: *) {
  return patchAuth(
    `${API_URI}/payment/invoices/${invoiceData.uuid}/`,
    invoiceData,
  );
}

export async function createQuick(invoiceData: *) {
  return postAuth(`${API_URI}/payment/invoices/quick_create/`, invoiceData);
}

export async function patchConfiguration(data: *) {
  return patchAuth(`${API_V1_URI}/payment/configuration/me/`, data);
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
};
