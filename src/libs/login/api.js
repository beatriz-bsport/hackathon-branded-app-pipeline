import { API_V1_URI, getAuth, postAuth, post } from '../../http';

export const fetchTempPassword = () =>
  getAuth(`${API_V1_URI}/authentication/temp-password/`);

export const generateTempPassword = () =>
  postAuth(`${API_V1_URI}/authentication/temp-password/generate/`);

export const validateEmail = (data) => {
  return postAuth(`${API_V1_URI}/authentication/validate_email/`, data);
};

export const requestValidateEmail = (email) => {
  return getAuth(`${API_V1_URI}/authentication/send_email_validation/${email}`);
};

export const checkEmailValidation = (email) => {
  return post(`${API_V1_URI}/authentication/check_email_validation/`, {
    email,
  });
};

export const checkMyEmailValidation = () => {
  return postAuth(`${API_V1_URI}/authentication/check_email_validation/`, {
    email: 'me',
  });
};
