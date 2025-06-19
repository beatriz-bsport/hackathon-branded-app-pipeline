import {
  type ApiConfig,
  type XhrApiConfig,
  buildUrlParams,
} from "@bsport/store-base";

const API_URL = "core-data/v1/member";

export const fetchMembersAPI = (
  params: {
    page: number;
    page_size: number;
  } & Record<string, string | boolean | number>,
): ApiConfig => {
  return [`${API_URL}/${buildUrlParams(params)}`];
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
