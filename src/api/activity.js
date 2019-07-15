import { API_URI, getAuth } from '../http';

export async function fetchActivitiesMinimal() {
  return getAuth(`${API_URI}/saas/activities/minimal/`);
}
export default {
  fetchMinimal: fetchActivitiesMinimal,
};
