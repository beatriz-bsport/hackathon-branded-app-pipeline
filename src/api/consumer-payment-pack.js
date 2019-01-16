// @flow
import { API_URI, getAuth } from '../http';

export async function fetchByOfferByMember(offerId: number, memberId: number) {
  return getAuth(
    `${API_URI}/saas/offer/${offerId}/consumer-payment-packs/member/${memberId}/`,
  );
}

export default { fetchByOfferByMember };
