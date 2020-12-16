// @flow
import { API_URI, postAuth } from '../../../http.ts';

export async function createOffers(metaActivityId: number, data: *) {
  return postAuth(
    `${API_URI}/saas/meta-activity/${metaActivityId}/offer/add`,
    data,
  );
}

export default {
  createOffers,
};
