import { API_URI, getAuth, postAuth } from '../http';

export async function addCoach(data) {
  return postAuth(`${API_URI}/saas/create-coach/`, data);
}

export async function fetchAssociatedCoaches() {
  return getAuth(`${API_URI}/coach/associated/`);
}

export async function fetchAssociatedCoachPerformance(
  associatedCoachId,
  start_timestamp,
  end_timestamp,
) {
  return getAuth(
    `${API_URI}/saas/associated-coach/${associatedCoachId}/performance/${start_timestamp}/${end_timestamp}`,
  );
}

export default {
  fetchAssociated: fetchAssociatedCoaches,
  addCoach,
  fetchAssociatedCoachPerformance,
};
