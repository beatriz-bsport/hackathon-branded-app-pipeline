// @flow
import {
  API_URI,
  API_V1_URI,
  postAuth,
  getAuth,
  putAuth,
  deleteAuth,
  buildUrlParams,
} from '../../http';

export async function addEstablishment(data: *) {
  return postAuth(`${API_URI}/saas/establishments/add`, data);
}

export async function updateEstablishment(data: *) {
  return putAuth(`${API_URI}/saas/establishments/${data.get('id')}`, data);
}

export async function fetchEstablishment(id: number) {
  return getAuth(`${API_URI}/saas/establishment/${id}/`);
}

export async function fetchAllEstablishments(params: any) {
  return getAuth(`${API_V1_URI}/establishment/${buildUrlParams(params)}`);
}

export async function checkCanDeleteEstablishment(id: number) {
  return getAuth(`${API_V1_URI}/establishment/${id}/can_destroy/`);
}

export async function deleteEstablishment(id: number) {
  return deleteAuth(`${API_V1_URI}/establishment/${id}/`);
}

export async function fetchAssociatedEstablishments() {
  return getAuth(`${API_V1_URI}/associated-establishment/`);
}

export async function fetchEstablishmentFavorite(company: number) {
  return getAuth(
    `${API_V1_URI}/establishment/favorite/${buildUrlParams({
      company,
    })}`,
  );
}

export default {
  addEstablishment,
  updateEstablishment,
  fetchEstablishment,
  fetchEstablishmentList: fetchAllEstablishments,
};
