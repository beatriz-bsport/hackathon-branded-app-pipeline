import { API_URI, postAuth, getAuth } from '../http';

export async function addEstablishment(data) {
  return postAuth(`${API_URI}/saas/establishments/add`, data);
}

export async function fetchAllEstablishments() {
  return getAuth(`${API_URI}/saas/establishments/`);
}

export default {
  addEstablishment,
  fetchAll: fetchAllEstablishments,
};
