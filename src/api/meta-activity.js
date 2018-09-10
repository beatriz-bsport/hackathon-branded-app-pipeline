import { API_URI, postAuth } from '../http';

export async function createOffers(metaActivityId, data) {
  return postAuth(
    `${API_URI}/saas/meta-activity/${metaActivityId}/offer/add`,
    data,
  );
}

export default {
  createOffers,
};
