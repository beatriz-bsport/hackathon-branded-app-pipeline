// @flow
import { API_URI, getAuth } from '../http';

export async function fetchByOfferByMember(offerId: number, memberId: number) {
  return getAuth(
    `${API_URI}/saas/offer/${offerId}/consumer-payment-packs/member/${memberId}/`,
  );
}

export async function fetchByPaymentPack(paymentPackId: number) {
  return getAuth(
    `${API_URI}/saas/payment-pack/${paymentPackId}/consumer-payment-packs`,
  );
}

/* dead code
export async function fetchByMember(memberId: number) {
  return getAuth(`${API_URI}/saas/member/${memberId}/consumer-payment-packs`);
}
*/

export default {
  fetchByOfferByMember,
  fetchByPaymentPack,
  /* dead code
    fetchByMember,
  */
};
