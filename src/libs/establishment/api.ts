import {
  API_URI,
  API_V1_URI,
  postAuth,
  getAuth,
  putAuth,
  deleteAuth,
  buildUrlParams,
} from '../../http';
import type {
  establishmentAddressInput,
  EstablishmentGroup,
  EstablishmentBillingGroup,
} from './types';

export async function addEstablishment(data: any) {
  return postAuth(`${API_URI}/saas/establishments/add`, data);
}

export async function restoreEstablishment(id: number) {
  return putAuth(`${API_V1_URI}/establishment/${id}/restore/`);
}

export async function updateEstablishment(data: any) {
  return putAuth(`${API_URI}/saas/establishments/${data.get('id')}`, data);
}

export async function addEstablishmentV2(data: establishmentAddressInput) {
  return postAuth(`${API_V1_URI}/establishment/`, data);
}
export async function updateEstablishmentV2(
  id: number,
  data: establishmentAddressInput,
) {
  return putAuth(`${API_V1_URI}/establishment/${id}/`, data);
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

export async function fetchAllEstablishmentGroup(companyId?: number) {
  if (companyId) {
    return getAuth(
      `${API_V1_URI}/establishment-group/${buildUrlParams({ companyId })}`,
    );
  }
  return getAuth(`${API_V1_URI}/establishment-group/`);
}

export async function createEstablishmentGroup(
  establishmentGroup: EstablishmentGroup,
) {
  return postAuth(`${API_V1_URI}/establishment-group/`, establishmentGroup);
}
export async function updateEstablishmentGroup(
  establishmentGroup: EstablishmentGroup,
) {
  return putAuth(
    `${API_V1_URI}/establishment-group/${establishmentGroup.id}/`,
    establishmentGroup,
  );
}
export async function deleteEstablishmentGroup(establishmentGroupId: number) {
  return deleteAuth(
    `${API_V1_URI}/establishment-group/${establishmentGroupId}`,
  );
}
export async function fetchAllEstablishmentBillingGroup() {
  return getAuth(`${API_V1_URI}/establishment-billing-group/`);
}

export async function createEstablishmentBillingGroup(
  establishmentGroup: EstablishmentBillingGroup,
) {
  return postAuth(
    `${API_V1_URI}/establishment-billing-group/`,
    establishmentGroup,
  );
}
export async function updateEstablishmentBillingGroup(
  establishmentGroup: EstablishmentBillingGroup,
) {
  return putAuth(
    `${API_V1_URI}/establishment-billing-group/${establishmentGroup.id}/`,
    establishmentGroup,
  );
}
export async function deleteEstablishmentBillingGroup(
  establishmentGroupId: number,
) {
  return deleteAuth(
    `${API_V1_URI}/establishment-billing-group/${establishmentGroupId}`,
  );
}
export default {
  addEstablishment,
  updateEstablishment,
  fetchEstablishment,
  fetchEstablishmentList: fetchAllEstablishments,
};
