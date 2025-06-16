import { FILTERS_ROOTS } from '@bsport/common/lib/master-data/smart-list.js';
import { AxiosResponse } from 'axios';

import {
  getAuth,
  buildUrlParams,
  postAuth,
  patchAuth,
  deleteAuth,
  getAuthDeprecated,
} from '../../http';
import type {
  AutomatedCampaignQueryParams,
  AutomatedCampaign,
  FetchSmartlistMembersQueryParams,
  CreateAutomatedCampaign,
} from './types';
import Config from '../../config';

const API_V1_URI = Config.REACT_APP_BASE_URI_CDP_V1;

const SMART_LIST_URI = `${API_V1_URI}/smartlist/group/`;

export const fetchSmartListList = async (params?: any) => {
  return getAuth(`${SMART_LIST_URI}${buildUrlParams(params)}`);
};

export const fetchSmartListDetail = async (id: number) => {
  return getAuth(`${SMART_LIST_URI}${id}`);
};

export const createSmartList = async (data: any) => {
  return postAuth(SMART_LIST_URI, data);
};

export const updateSmartList = (id: number, data: any) => {
  return patchAuth(`${SMART_LIST_URI}${id}/`, data);
};

export const deleteSmartList = (id: number) => {
  return deleteAuth(`${SMART_LIST_URI}${id}/`);
};

export const fetchSmartListAutoTagRules = async (params?: any) => {
  return getAuth(`${API_V1_URI}/smartlist/tagrules/${buildUrlParams(params)}`);
};

export const createSmartListTagRules = async (data: any) => {
  return postAuth(`${API_V1_URI}/smartlist/tagrules/`, data);
};

export const updateSmartListAutoTagRules = async (id: number, data: any) => {
  return patchAuth(`${API_V1_URI}/smartlist/tagrules/${id}/`, data);
};

export const deleteSmartListAutoTagRules = (id: number) => {
  return deleteAuth(`${API_V1_URI}/smartlist/tagrules/${id}/`);
};

export const deleteMultiSmartListAutoTagRules = (
  smartlist: number,
  tag: number,
) => {
  return postAuth(`${API_V1_URI}/smartlist/tagrules/delete_autotag_rules/`, {
    smartlist,
    tag,
  });
};

export const applySmartListAutoTagRules = async (id: number) => {
  // DEPRECATED: doesn't perform any action
  return postAuth(`${SMART_LIST_URI}${id}/apply_smartlist_tag_rules/`);
};
export const getMemberTable = async (id: number) => {
  return getAuth(`${SMART_LIST_URI}${id}/export_members/`);
};

export const getMemberTableBackground = async (id: number) => {
  return getAuth(`${SMART_LIST_URI}${id}/export_members_background/`);
};

export const fetchStoredCsvExports = async (id: number) => {
  return getAuth(`${SMART_LIST_URI}${id}/get_csv_exports/`);
};

export const fetchSmartListMembers = async (
  id: number,
  queryParams?: FetchSmartlistMembersQueryParams,
) => {
  return getAuthDeprecated(
    `${SMART_LIST_URI}${id}/members/${buildUrlParams(queryParams)}`,
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

export const fetchCadencesUsingSmartlist = async (
  id: number,
): Promise<AxiosResponse<number[]>> => {
  return getAuth(`${SMART_LIST_URI}${id}/cadences_in/`);
};

// Filters API

const FILTER_URI = `${API_V1_URI}/smartlist`;

export const fetchFilters = async (
  filter_identifier: number,
  smartListId: number,
) => {
  return getAuth(
    // @ts-expect-error
    `${FILTER_URI}/${FILTERS_ROOTS[filter_identifier]}/${smartListId}`,
  );
};

export const createFilter = async (filter_identifier: number, data: any) => {
  // @ts-expect-error
  return postAuth(`${FILTER_URI}/${FILTERS_ROOTS[filter_identifier]}/`, data);
};

export const updateFilter = (
  filter_identifier: number,
  id: number,
  data: any,
) => {
  return patchAuth(
    // @ts-expect-error
    `${FILTER_URI}/${FILTERS_ROOTS[filter_identifier]}/${id}/`,
    data,
  );
};

export const deleteFilter = (filter_identifier: number, id: number) => {
  // @ts-expect-error
  return deleteAuth(`${FILTER_URI}/${FILTERS_ROOTS[filter_identifier]}/${id}/`);
};

// AutomatedCampaign
export const getSmartListAutomatedCampaign = async (id: number) => {
  return getAuth(`${API_V1_URI}/smartlist/automated_campaign/${id}`);
};

export const fetchSmartListAutomatedCampaigns = async (
  params?: AutomatedCampaignQueryParams,
) => {
  return getAuth(
    `${API_V1_URI}/smartlist/automated_campaign/${buildUrlParams(params)}`,
  );
};

export const createSmartListAutomatedCampaign = async (
  data: AutomatedCampaign | CreateAutomatedCampaign,
) => {
  return postAuth(`${API_V1_URI}/smartlist/automated_campaign/`, data);
};

export const updateSmartListAutomatedCampaign = async (
  id: number,
  data: AutomatedCampaign,
) => {
  return patchAuth(`${API_V1_URI}/smartlist/automated_campaign/${id}/`, data);
};

export const deleteSmartListAutomatedCampaign = (id: number) => {
  return deleteAuth(`${API_V1_URI}/smartlist/automated_campaign/${id}/`);
};
