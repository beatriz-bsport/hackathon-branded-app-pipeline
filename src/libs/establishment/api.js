// @flow
import { API_URI, API_V1_URI, postAuth, getAuth, putAuth } from '../../http';

export async function addEstablishment(data: *) {
  return postAuth(`${API_URI}/saas/establishments/add`, data);
}

export async function updateEstablishment(data: *) {
  return putAuth(`${API_URI}/saas/establishments/${data.get('id')}`, data);
}

export async function fetchEstablishment(id: number) {
  return getAuth(`${API_URI}/saas/establishment/${id}/`);
}

export async function fetchAllEstablishments() {
  return getAuth(`${API_V1_URI}/establishment/?page_size=100`);
}

export default {
  addEstablishment,
  updateEstablishment,
  fetchEstablishment,
  fetchAll: fetchAllEstablishments,
};
