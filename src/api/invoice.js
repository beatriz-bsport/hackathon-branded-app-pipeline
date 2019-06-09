import { API_URI, getAuth, postAuth, patchAuth } from '../http';

export async function fetchAll({ page, pageSize, queryParams }) {
  return getAuth(
    `${API_URI}/payment/invoices/?page_size=${pageSize}&page=${page}${
      queryParams ? `&${queryParams}` : ''
    }`,
  );
}

export async function fetchSpecific(invoiceId) {
  return getAuth(`${API_URI}/payment/invoices/${invoiceId}/`);
}

export async function updatePaymentMethod(uuid, newMethod) {
  return patchAuth(`${API_URI}/payment/payments/${uuid}/`, {
    payment_method: newMethod,
  });
}

export async function create(invoiceData) {
  return postAuth(`${API_URI}/payment/invoices/`, invoiceData);
}

export async function finalize(uuid) {
  return patchAuth(`${API_URI}/payment/invoices/${uuid}/finalize/`, {
    is_finalized: true,
  });
}

export async function revert(uuid) {
  return postAuth(`${API_URI}/payment/invoices/${uuid}/revert/`, {});
}

export async function update(invoiceData) {
  return patchAuth(
    `${API_URI}/payment/invoices/${invoiceData.uuid}/`,
    invoiceData,
  );
}

export async function createQuick(invoiceData) {
  return postAuth(`${API_URI}/payment/invoices/quick_create/`, invoiceData);
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
};
