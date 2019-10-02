// @flow
import { API_URI, API_V1_URI, postAuth, deleteAuth, getAuth } from '../http';

export async function fetchByOfferByMember(offerId: number, memberId: number) {
  return getAuth(
    `${API_URI}/saas/offer/${offerId}/consumer-payment-packs/member/${memberId}/`,
  );
}

export async function fetchById(id: number) {
  return getAuth(`${API_URI}/payment-pack/consumer-payment-pack/${id}/`);
}

export async function fetchByMember(memberId: number) {
  return getAuth(
    `${API_URI}/payment-pack/consumer-payment-pack/?memberId=${memberId}`,
  );
}

export async function fetchExtensions(consumerPassId: number) {
  return getAuth(
    `${API_URI}/payment-pack/pack-extension/?consumer_payment_pack=${consumerPassId}`,
  );
}

export async function fetchByPaymentPack(
  paymentPackId: number,
  page?: number,
  pageSize?: number,
) {
  let queryParams = '';
  if (page && pageSize) {
    queryParams = `?page=${page}&page_size=${pageSize}`;
  }
  return getAuth(
    `${API_URI}/saas/payment-pack/${paymentPackId}/consumer-payment-packs${queryParams}`,
  );
}

export async function createExtension(data: any) {
  return postAuth(`${API_V1_URI}/payment-pack/pack-extension/`, data);
}

export async function deleteExtension(id: number) {
  return deleteAuth(`${API_V1_URI}/payment-pack/pack-extension/${id}/`);
}

export async function fetchConsumerPackAsManager(id: number) {
  return getAuth(
`${API_URI}/saas/consumer-payment-pack/${id}/`,
  );
}

export default {
  fetchByOfferByMember,
  fetchByPaymentPack,
  fetchById,
  fetchByMember,
  fetchExtensions,
  createExtension,
  deleteExtension,
};
