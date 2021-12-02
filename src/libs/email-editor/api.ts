import { AxiosResponse } from 'axios';
import {
  API_V1_URI,
  getAuth,
  postAuth,
  patchAuth,
  deleteAuth,
  buildUrlParams,
  putAuth,
} from '../../http';
import {
  EmailTemplate,
  EmailTemplateCategory,
  FranchisorSavedFilter,
} from './types';

const MARKETING_EMAIL_URI = `${API_V1_URI}/email_design/`;

export const fetchEmailTemplateDetail = async (id: number) => {
  return getAuth(`${MARKETING_EMAIL_URI}email_detail/${id}/`);
};

export const fetchBulkEmailTemplateDetail = async (params: {
  id__in?: number[];
}) => {
  return getAuth(
    `${MARKETING_EMAIL_URI}email_detail/${buildUrlParams(params)}`,
  );
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

export const createEmailTemplate = async (
  data: Omit<EmailTemplate, 'id'> & { available_for_companies?: number[] },
) => {
  return postAuth(MARKETING_EMAIL_URI, data);
};

export const updateEmailTemplate = (
  id: string | number,
  data: EmailTemplate & { available_for_companies?: number[] },
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

export const restoreEmailTemplate = (id: string | number) => {
  return putAuth(`${MARKETING_EMAIL_URI}${id}/restore/`);
};

export const editOrderEmailTemplate = (data: any) => {
  return patchAuth(`${MARKETING_EMAIL_URI}set_multiple_order/`, data);
};

export async function fetchAllEmailTemplateCategory({
  companyId,
}: {
  companyId?: number;
}) {
  return getAuth(
    `${MARKETING_EMAIL_URI}email_design_category/${buildUrlParams({
      companyId,
    })}`,
  );
}
export async function updateEmailTemplateCategory(
  category: EmailTemplateCategory,
) {
  return putAuth(
    `${MARKETING_EMAIL_URI}email_design_category/${category.id}/`,
    category,
  );
}

export async function createEmailTemplateCategory(
  category: EmailTemplateCategory,
) {
  return postAuth(`${MARKETING_EMAIL_URI}email_design_category/`, category);
}
export async function deleteEmailTemplateCategory(
  category: EmailTemplateCategory,
) {
  return deleteAuth(
    `${MARKETING_EMAIL_URI}email_design_category/${category.id}/`,
  );
}
export async function editCategoryOrder(data: any) {
  return patchAuth(
    `${MARKETING_EMAIL_URI}email_design_category/set_order/`,
    data,
  );
}
