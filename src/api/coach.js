// @flow

import { API_URI, getAuth, postBaseAuth, putAuth } from '../http';

export async function addCoach(data: *) {
  return postBaseAuth(`${API_URI}/saas/create-coach/`, data);
}

export async function updateCoach(data: *) {
  return putAuth(`${API_URI}/saas/coach/${data.get('id')}`, data);
}

export async function fetchAssociatedCoaches() {
  return getAuth(`${API_URI}/saas/associated-coach/`);
}

export async function fetchAssociatedCoachPerformance(
  associatedCoachId: number,
  start_timestamp: number,
  end_timestamp: number,
) {
  return getAuth(
    `${API_URI}/saas/associated-coach/${associatedCoachId}/performance/${start_timestamp}/${end_timestamp}`,
  );
}

export default {
  fetchAssociated: fetchAssociatedCoaches,
  addCoach,
  updateCoach,
  fetchAssociatedCoachPerformance,
};
