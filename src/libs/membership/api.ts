import { getAuth, postAuth, API_V1_URI, buildUrlParams } from '../../http';

export const fetchMembershipList = async (params: any = {}) => {
  return getAuth(`${API_V1_URI}/membership/${buildUrlParams(params)}`);
};

export const fetchMembership = async (id: number) => {
  return getAuth(`${API_V1_URI}/membership/${id}/`);
};

export const fetchMembershipByCompany = async (companyId: number) => {
  return getAuth(`${API_V1_URI}/membership/${id}/by_company/`);
};

export async function linkMeToCompany(data: any) {
  return postAuth(`${API_V1_URI}/membership/link_to_company/`, data);
}

export async function requestMembershipValidation(data: any) {
  return postAuth(`${API_V1_URI}/membership/need_membership_validation/`, data);
}
