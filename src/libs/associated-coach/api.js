// @flow

import {
  API_URI,
  API_V1_URI,
  getAuth,
  postAuth,
  postBaseAuth,
  putAuth,
  deleteAuth,
  buildUrlParams,
} from '../../http';

// TO UPDATE TO V1 API
// -----------------------
//
export async function addCoach(data: *) {
  return postBaseAuth(`${API_URI}/saas/create-coach/`, data);
}

export async function updateCoach(data: *) {
  return putAuth(`${API_URI}/saas/coach/${data.get('id')}`, data);
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

export async function fetchAssociatedCoaches(params: ?{ [string]: boolean }) {
  return getAuth(`${API_URI}/saas/associated-coach/${buildUrlParams(params)}`);
}

export async function fetchAssociatedCoach(id: number) {
  return getAuth(`${API_URI}/saas/associated-coach/${id}/`);
}

// -----------------------

export async function linkByEmail(email: string) {
  return postAuth(`${API_V1_URI}/coach/link_by_email/`, { email });
}

export async function deleteCoach(id: number) {
  return deleteAuth(`${API_V1_URI}/coach/${id}`);
}

export async function canDeleteCoach(id: number) {
  return getAuth(`${API_V1_URI}/coach/${id}/can_destroy/`);
}

export default {
  fetchAssociated: fetchAssociatedCoaches,
  addCoach,
  updateCoach,
  fetchAssociatedCoachPerformance,
  linkByEmail,
};
