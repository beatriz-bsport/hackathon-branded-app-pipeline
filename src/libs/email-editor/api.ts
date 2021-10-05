import { AxiosResponse } from 'axios';
import {
  API_V1_URI,
  getAuth,
  postAuth,
  patchAuth,
  deleteAuth,
  buildUrlParams,
} from '../../http';
import { EmailTemplate, FranchisorSavedFilter } from './types';

const MARKETING_EMAIL_URI = `${API_V1_URI}/email_design/`;

export const fetchEmailTemplateDetail = async (id: number) => {
  return getAuth(`${MARKETING_EMAIL_URI}${id}/get_detail/`);
};

export const fetchEmailTemplatesSummaries = async (params?: any) => {
  return getAuth(`${MARKETING_EMAIL_URI}summary/${buildUrlParams(params)}`);
};

export const fetchEmailTemplatesSummariesByFranchisor = async () => {
  return getAuth(`${MARKETING_EMAIL_URI}by_franchisor/`);
};

export const fetchEmailTemplate = async (id: number) => {
  return getAuth(`${MARKETING_EMAIL_URI}${id}/`);
};

export const createEmailTemplate = async (data: Omit<EmailTemplate, 'id'>) => {
  return postAuth(MARKETING_EMAIL_URI, data);
};

export const updateEmailTemplate = (
  id: string | number,
  data: EmailTemplate,
) => {
  return patchAuth(`${MARKETING_EMAIL_URI}${id}/`, data);
};

export const fetchFranchisePageFilter = (): Promise<
  AxiosResponse<{ filters: FranchisorSavedFilter }>
> => getAuth(`${MARKETING_EMAIL_URI}filters_ressources/me/`);

export const updateFranchisePageFilter = (data: {
  filters: FranchisorSavedFilter[];
}) => patchAuth(`${MARKETING_EMAIL_URI}filters_ressources/me/`, data);

export const deleteEmailTemplate = (id: string | number) => {
  return deleteAuth(`${MARKETING_EMAIL_URI}${id}/`);
};
