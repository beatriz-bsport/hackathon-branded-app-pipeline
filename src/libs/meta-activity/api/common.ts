import {
  API_V1_URI,
  deleteAuth,
  postAuth,
  getAuth,
  patchAuth,
  putAuth,
  buildUrlParams,
} from '../../../http';
import { MetaActivityCategory } from '#libs/meta-activity/types';

export async function fetchAllActivities(params: any) {
  return getAuth(`${API_V1_URI}/meta-activity/${buildUrlParams(params)}`);
}

export async function fetchMetaActivityDetails(id: number) {
  return getAuth(`${API_V1_URI}/meta-activity/${id}/`);
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

export async function fetchAllMetaActivityCategory({
  companyId,
}: {
  companyId?: number;
}) {
  return getAuth(
    `${API_V1_URI}/meta-activity/meta_activity_category/${buildUrlParams({
      companyId,
    })}`,
  );
}
export async function updateMetaActivityCategory(
  category: MetaActivityCategory,
) {
  return putAuth(
    `${API_V1_URI}/meta-activity/meta_activity_category/${category.id}/`,
    category,
  );
}

export async function createMetaActivityCategory(
  category: MetaActivityCategory,
) {
  return postAuth(
    `${API_V1_URI}/meta-activity/meta_activity_category/`,
    category,
  );
}
export async function deleteMetaActivityCategory(
  category: MetaActivityCategory,
) {
  return deleteAuth(
    `${API_V1_URI}/meta-activity/meta_activity_category/${category.id}/`,
  );
}
export async function editCategoryOrder(data: any) {
  return patchAuth(
    `${API_V1_URI}/meta-activity/meta_activity_category/set_order/`,
    data,
  );
}

export default {
  fetchAllActivities,
  fetchMetaActivityDetails,
  addMetaActivity,
  updateMetaActivity,
  deleteMetaActivity,
};
