import { AxiosResponse } from 'axios';
import {
  getAuth,
  postAuth,
  patchAuth,
  deleteAuth,
  buildUrlParams,
  putAuth,
} from '#src/http';

import type {
  EmailTemplate,
  EmailTemplateCategory,
  FranchisorSavedFilter,
  EmailTemplateSummary,
  EmailDesignQueryParamsPaginated,
  EmailEditAPIParams,
} from '#src/libs/email-editor/types';

import type { PaginatedResponse } from '#src/state/types';
import Config from '../../config';

const API_V1_URI = Config.REACT_APP_BASE_URI_CDP_V1;

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

/**
 * @deprecated Missed typped and unpaginated api call
 *
 */
export const fetchEmailTemplatesSummaries = async (params?: any) => {
  return getAuth(
    `${MARKETING_EMAIL_URI}summary/${buildUrlParams({
      ...params,
    })}`,
  );
};

export const fetchEmailTemplatesSummariesPaginated = (
  params: EmailDesignQueryParamsPaginated,
) =>
  getAuth<PaginatedResponse<EmailTemplateSummary>>(
    `${MARKETING_EMAIL_URI}summary_paginated/${buildUrlParams(params)}`,
  );

export const fetchEmailTemplatesSummariesByFranchisor = async () => {
  return getAuth(`${MARKETING_EMAIL_URI}by_franchisor/`);
};

export const fetchEmailTemplate = async (id: number) => {
  return getAuth(`${MARKETING_EMAIL_URI}${id}/`);
};

export const createEmailTemplate = async (data: EmailEditAPIParams) => {
  return postAuth<EmailTemplate>(MARKETING_EMAIL_URI, data);
};

export const updateEmailTemplate = (
  id: string | number,
  data: EmailEditAPIParams,
) => {
  return patchAuth<EmailTemplate>(`${MARKETING_EMAIL_URI}${id}/`, data);
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

export async function fetchTemplateMetaData(id: number) {
  return getAuth(
    `${MARKETING_EMAIL_URI}${id}/related_notification_rules_data/`,
  );
}
