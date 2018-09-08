import { API_URI, getAuth, postAuth } from '../http';

export async function addCoach(data) {
  return postAuth(`${API_URI}/saas/create-coach/`, data);
}

export async function fetchAssociatedCoaches() {
  return getAuth(`${API_URI}/coach/associated/`);
}

export default {
  fetchAssociated: fetchAssociatedCoaches,
  addCoach,
};
