// @flow

import {
  API_URI,
  API_V1_URI,
  getAuth,
  postAuth,
  postBaseAuth,
  putAuth,
  deleteAuth,
} from '../../http';

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

export async function linkByEmail(email: string) {
  return postAuth(`${API_V1_URI}/coach/link_by_email/`, { email });
}

export async function deleteCoach(id: number) {
  return deleteAuth(`${API_V1_URI}/coach/${id}`);
}

export default {
  fetchAssociated: fetchAssociatedCoaches,
  addCoach,
  updateCoach,
  fetchAssociatedCoachPerformance,
  linkByEmail,
};
