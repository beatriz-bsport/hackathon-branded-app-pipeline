import {
  type ApiConfig,
  type XhrApiConfig,
  buildUrlParams,
} from "@bsport/store-base";

import type { UpdateAllMembersTagParams, UpdateMemberTagParams } from "./types";

const API_URL = "core-data/v1/member";

export type FetchMembersParams = {
  page: number;
  page_size: number;
  tags_included?: string; // Union of selected tags, ids of tags separated by commas
  tags_excluded?: string; // Union of selected tags, ids of tags separated by commas
  exclude_archived?: boolean;
  email_confirmed?: boolean;
} & Record<string, string | boolean | number>;

export const fetchMembersAPI = (params: FetchMembersParams): ApiConfig => {
  return [`${API_URL}/${buildUrlParams(params)}`];
};

export type SearchMembersParams = {
  params?: {
    hide_archived?: boolean;
    only_archived?: boolean;
  };
  text: string;
};

export const searchMembersAPI = (params: SearchMembersParams): ApiConfig => {
  return [
    `${API_URL}/search/`,
    {
      method: "POST",
      body: JSON.stringify(params),
    },
  ];
};

export const archiveMemberAPI = (params: { memberId: number }): ApiConfig => {
  return [
    `${API_URL}/${params.memberId}/archive/`,
    {
      method: "POST",
    },
  ];
};

export const restoreMemberAPI = (params: { memberId: number }): ApiConfig => {
  return [
    `${API_URL}/${params.memberId}/unarchive/`,
    {
      method: "POST",
    },
  ];
};

export const interrogateMemberRegularityAPI = (params: {
  memberId: number;
}): ApiConfig => {
  return [`${API_URL}/${params.memberId}/interrogate_member_before_archive/`];
};

export type ImportLeadsParams = {
  file: File;
  signal: AbortSignal;
  onUploadProgress: (progressEvent: ProgressEvent) => void;
};

export const importLeadsAPI = ({
  file,
  onUploadProgress,
  signal,
}: ImportLeadsParams): XhrApiConfig => {
  const formData = new FormData();
  formData.append("file", file);

  return [
    `${API_URL}/upload_lead_management_file/`,
    {
      method: "POST",
      formData,
      onUploadProgress,
      signal,
    },
  ];
};

export const tagMemberAPI = (params: UpdateMemberTagParams): ApiConfig => {
  const payloadData = { tag: params.tagId };
  return [
    `${API_URL}/${params.memberId}/tag/`,
    {
      method: "POST",
      body: JSON.stringify(payloadData),
    },
  ];
};

export const untagMemberAPI = (params: UpdateMemberTagParams): ApiConfig => {
  const payloadData = { tag: params.tagId };
  return [
    `${API_URL}/${params.memberId}/tag/`,
    {
      method: "DELETE",
      body: JSON.stringify(payloadData),
    },
  ];
};

export const tagAllMembersAPI = (
  params: UpdateAllMembersTagParams,
): ApiConfig => {
  const payloadData = { tag: params.tagId };
  return [
    `${API_URL}/tag_all/`,
    {
      method: "POST",
      body: JSON.stringify(payloadData),
    },
  ];
};

export const untagAllMembersAPI = (
  params: UpdateAllMembersTagParams,
): ApiConfig => {
  const payloadData = { tag: params.tagId };
  return [
    `${API_URL}/tag_all/`,
    {
      method: "DELETE",
      body: JSON.stringify(payloadData),
    },
  ];
};
