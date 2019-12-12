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

export const fetchSmartListList = async () => {
  return getAuth(SMART_LIST_URI);
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

export const sendMail = async (id: number, email_template: number) => {
  return postAuth(`${SMART_LIST_URI}${id}/contact_with_template/`, {
    email_template,
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

export const fetchSmartListFilters = async (id: number) => {
  return getAuth(`${SMART_LIST_URI}${id}/get_filters/`);
};

export const fetchDetails = async (id: number) => {
  return getAuth(`${SMART_LIST_URI}${id}/stats/`);
};

// Filters API

const FILTER_URI = `${API_V1_URI}/smartlist/filter`;

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
