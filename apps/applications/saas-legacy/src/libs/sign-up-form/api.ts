import { getAuth, putAuth, buildUrlParams } from '../../http';
import Config from '../../config';

const API_V1_URI = Config.REACT_APP_BASE_URI_CORE_V1;

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
