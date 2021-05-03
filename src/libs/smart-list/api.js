// @flow

import { FILTERS_ROOTS } from '@bsport/common/lib/master-data/smart-list';

import {
  API_V1_URI,
  getAuth,
  buildUrlParams,
  postAuth,
  patchAuth,
  deleteAuth,
} from '../../http';

const SMART_LIST_URI = `${API_V1_URI}/smartlist/group/`;

export const fetchSmartListList = async (params: any) => {
  return getAuth(`${SMART_LIST_URI}${buildUrlParams(params)}`);
};

export const fetchSmartListDetail = async (id: number) => {
  return getAuth(`${SMART_LIST_URI}${id}`);
};

export const createSmartList = async (data: any) => {
  return postAuth(SMART_LIST_URI, data);
};

export const updateSmartList = (id: string, data: *) => {
  return patchAuth(`${SMART_LIST_URI}${id}/`, data);
};

export const deleteSmartList = (id: string) => {
  return deleteAuth(`${SMART_LIST_URI}${id}/`);
};

export const fetchSmartListAutoTagRules = async () => {
  return getAuth(`${API_V1_URI}/smartlist/tagrules/`);
};

export const createSmartListTagRules = async (data: any) => {
  return postAuth(`${API_V1_URI}/smartlist/tagrules/`, data);
};

export const updateSmartListAutoTagRules = async (id: number, data: any) => {
  return patchAuth(`${API_V1_URI}/smartlist/tagrules/${id}/`, data);
};

export const deleteSmartListAutoTagRules = (id: string) => {
  return deleteAuth(`${API_V1_URI}/smartlist/tagrules/${id}/`);
};

export const applySmartListAutoTagRules = async (id: number) => {
  return postAuth(`${SMART_LIST_URI}${id}/apply_smartlist_tag_rules/`);
};
// depreciated
export const sendMail = async (id: number, email_template: number, subject) => {
  return postAuth(`${SMART_LIST_URI}${id}/contact_with_template/`, {
    email_template,
    subject,
  });
};

export const getMemberTable = async (id: number) => {
  return getAuth(`${SMART_LIST_URI}${id}/export_members/`);
};

export const fetchSmartListMembers = async (
  id: number,
  { page, page_size },
) => {
  return getAuth(
    `${SMART_LIST_URI}${id}/members/${buildUrlParams({ page, page_size })}`,
  );
};

export const fetchSmartListMembersComplete = async (id: number) => {
  return getAuth(`${SMART_LIST_URI}${id}/members_complete/`);
};

export const fetchSmartListFilters = async (id: number) => {
  return getAuth(`${SMART_LIST_URI}${id}/get_filters/`);
};

export const fetchDetails = async (id: number) => {
  return getAuth(`${SMART_LIST_URI}${id}/stats/`);
};

export const copySmartList = async (id: number) => {
  return postAuth(`${SMART_LIST_URI}${id}/create_copy/`);
};

// Filters API

const FILTER_URI = `${API_V1_URI}/smartlist`;

export const fetchFilters = async (
  filter_identifier: number,
  smartListId: number,
) => {
  return getAuth(
    `${FILTER_URI}/${FILTERS_ROOTS[filter_identifier]}/${smartListId}`,
  );
};

export const createFilter = async (filter_identifier: number, data: any) => {
  return postAuth(`${FILTER_URI}/${FILTERS_ROOTS[filter_identifier]}/`, data);
};

export const updateFilter = (
  filter_identifier: number,
  id: string,
  data: *,
) => {
  return patchAuth(
    `${FILTER_URI}/${FILTERS_ROOTS[filter_identifier]}/${id}/`,
    data,
  );
};

export const deleteFilter = (filter_identifier: number, id: string) => {
  return deleteAuth(`${FILTER_URI}/${FILTERS_ROOTS[filter_identifier]}/${id}/`);
};
