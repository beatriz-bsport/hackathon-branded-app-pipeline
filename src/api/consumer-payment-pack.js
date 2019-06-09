// @flow
import { API_URI, getAuth } from '../http';

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

export default {
  fetchByOfferByMember,
  fetchByPaymentPack,
  fetchById,
  fetchByMember,
};
