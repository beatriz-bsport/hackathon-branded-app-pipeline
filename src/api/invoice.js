import { API_URI, getAuth, postAuth, putAuth, patchAuth } from '../http';

const PAGE_SIZE = 1000;

export async function fetchAll({ page }) {
  return getAuth(
    `${API_URI}/payment/invoices?page_size=${PAGE_SIZE}&page=${page}`,
  );
}

export async function fetchSpecific(invoiceId) {
  return getAuth(`${API_URI}/payment/invoices/${invoiceId}`);
}

export async function updatePaymentStatus(uuid, newStatus) {
  return putAuth(`${API_URI}/payment/payment-item/${uuid}`, {
    payment_received: newStatus,
  });
}

export async function create(invoiceData) {
  return postAuth(`${API_URI}/payment/invoices`, invoiceData);
}

export async function finalize(uuid) {
  return patchAuth(`${API_URI}/payment/invoices/${uuid}/finalize`, {
    is_finalized: true,
  });
}

export async function update(invoiceData) {
  return patchAuth(
    `${API_URI}/payment/invoices/${invoiceData.uuid}`,
    invoiceData,
  );
}

export async function createQuick(invoiceData) {
  return postAuth(`${API_URI}/payment/invoices/quick-create`, invoiceData);
}

export default {
  fetchAll,
  fetchSpecific,
  updatePaymentStatus,
  create,
  update,
  createQuick,
  finalize,
};
