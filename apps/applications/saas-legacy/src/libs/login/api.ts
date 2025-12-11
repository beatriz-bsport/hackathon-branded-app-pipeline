import axios from 'axios';
import { getAuth, postAuth, post, buildUrlParams, patchAuth } from '../../http';
import Config from '../../config';

const API_V1_URI = Config.REACT_APP_BASE_URI_PLATFORM_V1;
const API_URI = Config.REACT_APP_BASE_URI_PLATFORM_V0;
const API_V1_URI_CORE = Config.REACT_APP_BASE_URI_CORE_V1;

export const fetchTempPassword = () =>
  getAuth(`${API_V1_URI}/authentication/temp-password/`);

export const generateTempPassword = () =>
  postAuth(`${API_V1_URI}/authentication/temp-password/generate/`);

export const validateEmail = (data: any) => {
  return postAuth(`${API_V1_URI}/authentication/validate_email/`, data);
};

export const checkEmailValidation = (email: string) => {
  return post(`${API_V1_URI}/authentication/check_email_validation/`, {
    email,
  });
};

export const checkMyEmailValidation = () => {
  return postAuth(`${API_V1_URI}/authentication/check_email_validation/`, {
    email: 'me',
  });
};

export const accessLevel = async (token: string) => {
  return getAuth(`${API_URI}/saas/access_level`, token);
};

export const getEmailValidationStatus = async () => {
  return postAuth(`${API_V1_URI}/authentication/email_validator/me/`);
};

export const resetPassword = async (
  email: string,
  membership: number,
  franchisorId?: number | null,
) => {
  return axios.get(
    `${API_V1_URI}/authentication/password_reset_email/${email}${buildUrlParams(
      {
        ...(membership ? { company: membership } : {}),
        ...(franchisorId ? { franchisor: franchisorId } : {}),
      },
    )}`,
  );
};

export const sendEmailForConfirmation = async (companyId: number) => {
  return postAuth(`${API_V1_URI}/authentication/email_validator/send_email/`, {
    company_id: companyId,
  });
};

export const confirmEmail = (uuid: string, company?: number) => {
  return post(`${API_V1_URI}/authentication/email_validator/validate/`, {
    uuid,
    company,
  });
};

export const login = async (email: string, password: string) => {
  return post(`${API_V1_URI}/authentication/signin/with-login/`, {
    email,
    password,
  });
};

export const checkEmailExists = async (email: string) => {
  return post(`${API_V1_URI}/authentication/signup/exists/`, {
    email,
  });
};

export async function changePassword({
  uid,
  token,
  password,
}: {
  uid: string;
  token: string;
  password: string;
}) {
  return post(`${API_URI}/auth/password/reset/confirm/`, {
    uid,
    token,
    new_password1: password,
    new_password2: password,
  });
}

export const impersonateAdmin = async (params: {
  token: string;
  companyId: number;
}) => {
  return post(`${API_V1_URI}/authentication/impersonate/`, {
    token: params.token,
    company: params.companyId,
  });
};

export async function getRelationToken(params: {
  relatedMemberId: number;
  company: number;
}) {
  return postAuth(
    `${API_V1_URI_CORE}/relationship/member/get_related_member_token/`,
    {
      relatedMemberId: params.relatedMemberId,
      company: params.company,
    },
  );
}

export async function toggleRevampedBackofficeAPI() {
  return postAuth(`${API_V1_URI}/authentication/toggle_revamped_backoffice/`);
}

export async function updatePassword(password: string) {
  return patchAuth(`${API_V1_URI}/authentication/update_password/`, {
    password,
  });
}
