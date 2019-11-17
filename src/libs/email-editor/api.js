// @flow

import {
  API_V1_URI,
  getAuth,
  postAuth,
  patchAuth,
  deleteAuth,
} from '../../http';

const MARKETING_EMAIL_URI = `${API_V1_URI}/email_design/`;

export const fetchEmailTemplateDetail = async (id: number) => {
  return getAuth(`${MARKETING_EMAIL_URI}${id}/get_detail/`);
};

export const fetchEmailTemplatesSummaries = async () => {
  return getAuth(`${MARKETING_EMAIL_URI}summary/`);
};

export const fetchEmailTemplate = async (id: number) => {
  return getAuth(`${MARKETING_EMAIL_URI}${id}/`);
};

export const createEmailTemplate = async (data: any) => {
  return postAuth(MARKETING_EMAIL_URI, data);
};

export const updateEmailTemplate = (id: string, data: *) => {
  return patchAuth(`${MARKETING_EMAIL_URI}${id}/`, data);
};

export const deleteEmailTemplate = (id: string) => {
  return deleteAuth(`${MARKETING_EMAIL_URI}${id}/`);
};
