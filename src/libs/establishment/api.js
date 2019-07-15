// @flow
import { API_URI, postAuth, getAuth, putAuth } from '../../http';

export async function addEstablishment(data: *) {
  return postAuth(`${API_URI}/saas/establishments/add`, data);
}

export async function updateEstablishment(data: *) {
  return putAuth(`${API_URI}/saas/establishments/${data.get('id')}`, data);
}

export async function fetchAllEstablishments() {
  return getAuth(`${API_URI}/saas/establishments/`);
}

export default {
  addEstablishment,
  updateEstablishment,
  fetchAll: fetchAllEstablishments,
};
