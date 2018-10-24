import { API_URI, getAuth, postAuth, putAuth, patchAuth } from '../http';

export async function fetchAll() {
  return getAuth(`${API_URI}/payment/invoices`);
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

export async function update(invoiceData) {
  return patchAuth(
    `${API_URI}/payment/invoices/${invoiceData.uuid}`,
    invoiceData,
  );
}

export default {
  fetchAll,
  fetchSpecific,
  updatePaymentStatus,
  create,
  update,
};
