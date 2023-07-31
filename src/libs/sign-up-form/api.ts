import { API_V1_URI, getAuth, putAuth, buildUrlParams } from '../../http';

export async function fetchSignUpFormConfiguration(membership?: string) {
  return getAuth(
    `${API_V1_URI}/company/sign_up_form/config/${
      membership ? buildUrlParams(membership) : ''
    }`,
  );
}

export async function updateSignUpFormConfiguration(id: number, data: any) {
  return putAuth(`${API_V1_URI}/company/sign_up_form/${id}/`, data);
}
