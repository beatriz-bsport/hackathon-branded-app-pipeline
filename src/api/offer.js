import { API_URI, getAuth, postAuth } from '../http';

export async function fetchAllEvents() {
  return getAuth(`${API_URI}/as_coach/offers/minimal`);
}

export default {
  fetchAllEvents,
};
