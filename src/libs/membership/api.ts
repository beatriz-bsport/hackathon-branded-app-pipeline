import { getAuth, postAuth, API_V1_URI, buildUrlParams } from '../../http';

export const fetchMembershipList = async (params: any = {}) => {
  return getAuth(`${API_V1_URI}/membership/${buildUrlParams(params)}`);
};

export const fetchMembership = async (id: number) => {
  return getAuth(`${API_V1_URI}/membership/${id}/`);
};

export async function linkMeToCompany(data: any) {
  return postAuth(`${API_V1_URI}/membership/link_to_company/`, data);
}
