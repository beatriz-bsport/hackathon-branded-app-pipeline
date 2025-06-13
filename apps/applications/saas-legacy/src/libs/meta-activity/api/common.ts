import type {
  MetaActivity,
  MetaActivityCategory,
} from '#src/libs/meta-activity/types';

import {
  deleteAuth,
  postAuth,
  getAuth,
  patchAuth,
  putAuth,
  buildUrlParams,
} from '../../../http';
import type { PaginatedResponse } from '#src/state/types';
import Config from '../../../config';

const API_V1_URI = Config.REACT_APP_BASE_URI_BOOK_V1;

export async function fetchAllActivities(params: any) {
  return getAuth<PaginatedResponse<MetaActivity>>(
    `${API_V1_URI}/meta-activity/${buildUrlParams(params)}`,
  );
}

export async function fetchMetaActivityDetails(id: number) {
  return getAuth<MetaActivity>(`${API_V1_URI}/meta-activity/${id}/`);
}

export async function addMetaActivity(data: any) {
  return postAuth(`${API_V1_URI}/meta-activity/`, data);
}

export async function deleteMetaActivity(id: number) {
  return deleteAuth(`${API_V1_URI}/meta-activity/${id}/`);
}

export async function checkCanDeleteMetaActivity(id: number) {
  return getAuth(`${API_V1_URI}/meta-activity/${id}/can_destroy/`);
}

export async function restoreMetaActivity(id: number) {
  return putAuth(`${API_V1_URI}/meta-activity/${id}/restore/`);
}

export async function updateMetaActivity(data: any, id?: number) {
  const aId = data.get('id') || id;
  return patchAuth(`${API_V1_URI}/meta-activity/${aId}/`, data);
}

export async function fetchMetaActivityFavorite(company: number) {
  return getAuth(
    `${API_V1_URI}/meta-activity/favorite/${buildUrlParams({ company })}`,
  );
}

export async function makeActivityCopy(id: number, suffix: string) {
  return postAuth(`${API_V1_URI}/meta-activity/${id}/copy/`, { suffix });
}

export const editOrderMetaActivity = (data: any) => {
  return patchAuth(`${API_V1_URI}/meta-activity/set_multiple_order/`, data);
};

// @deprecated: Those categories are not used anymore
export async function fetchAllMetaActivityCategory({
  companyId: _companyId,
}: {
  companyId?: number;
}): Promise<any> {
  return [];
}

// @deprecated: Those categories are not used anymore
export async function updateMetaActivityCategory(
  _category: MetaActivityCategory,
): Promise<any> {
  return;
}

// @deprecated: Those categories are not used anymore
export async function createMetaActivityCategory(
  _category: MetaActivityCategory,
): Promise<any> {
  return;
}
// @deprecated: Those categories are not used anymore
export async function deleteMetaActivityCategory(
  _category: MetaActivityCategory,
): Promise<any> {
  return;
}
// @deprecated: Those categories are not used anymore
export async function editCategoryOrder(_data: any): Promise<any> {
  return;
}

export const fetchIsMetaActivityPublishedOnUSC = (metaActivityId: number) =>
  getAuth<boolean>(
    `${API_V1_URI}/meta-activity/${metaActivityId}/is_published_on_usc/`,
  );

export default {
  fetchAllActivities,
  fetchMetaActivityDetails,
  addMetaActivity,
  updateMetaActivity,
  deleteMetaActivity,
};
