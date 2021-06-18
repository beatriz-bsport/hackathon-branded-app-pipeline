import {
  getAuth,
  buildUrlParams,
  postAuth,
  patchAuth,
  deleteAuth,
  API_V1_URI,
} from '../../http';

export const fetchVideoList = async (params: any = {}) => {
  return getAuth(`${API_V1_URI}/vod/video/${buildUrlParams(params)}`);
};

export const retrieveVideo = async (id: number) => {
  return getAuth(`${API_V1_URI}/vod/video/${id}/`);
};

export const createOrUpdateVideo = async (data: any = {}) => {
  if (data.get('id')) {
    return patchAuth(`${API_V1_URI}/vod/video/${data.get('id')}/`, data);
  }
  return postAuth(`${API_V1_URI}/vod/video/`, data);
};

export const duplicateVideo = async (id: string) => {
  return postAuth(`${API_V1_URI}/vod/video/${id}/duplicate/`);
};

export const deleteVideo = async (id: number) => {
  return deleteAuth(`${API_V1_URI}/vod/video/${id}/`);
};

export const attachFile = async (id: number, file: Object) => {
  return postAuth(`${API_V1_URI}/vod/video/${id}/attach_video/`, file);
};

export const getUploadInstruction = async (id: number) => {
  return postAuth(`${API_V1_URI}/vod/video/${id}/upload_instruction/`);
};

export const removeVideoSource = async (id: number) => {
  return postAuth(`${API_V1_URI}/vod/video/${id}/remove_video_source/`);
};

export const setProviderIdentifier = async (
  id: number,
  data: { provider_identifier: number },
) => {
  return postAuth(
    `${API_V1_URI}/vod/video/${id}/set_provider_identifier/`,
    data,
  );
};

export const getPlaybackUrl = async (id: number) => {
  return getAuth(`${API_V1_URI}/vod/video/${id}/playback_url/`);
};

export const registerVideo = async (video: number, data: any) => {
  return postAuth(`${API_V1_URI}/vod/video_purchase/register_video/`, {
    video,
    ...(data || {}),
  });
};

export const fetchVideoPurchase = async (params?: any) => {
  return getAuth(
    `${API_V1_URI}/vod/video_purchase/${buildUrlParams({ ...(params || {}) })}`,
  );
};

export const retrieveVideoPurchase = async (id: number) => {
  return getAuth(`${API_V1_URI}/vod/video_purchase/${id}/`);
};

export const fetchNumberVideoPurchase = async (params?: any) => {
  return getAuth(
    `${API_V1_URI}/vod/video_purchase/get_number_videos_purchased/${buildUrlParams(
      { ...(params || {}) },
    )}`,
  );
};
export const fetchVideoAnalytics = async (videoId: number) => {
  return getAuth(`${API_V1_URI}/vod/video_analytics/${videoId}/`);
};

export const fetchVideoAnalyticsbyMember = async (
  videoId: number,
  params: any,
) => {
  return getAuth(
    `${API_V1_URI}/vod/video_analytics/${videoId}/get_analytics_per_member/${buildUrlParams(
      { ...(params || {}) },
    )}`,
  );
};

export const fetchVideoViewAnalytics = async (params?: any) => {
  return getAuth(
    `${API_V1_URI}/vod/video_view_analytics/${buildUrlParams({
      ...(params || {}),
    })}`,
  );
};

export const fetchVideoFilterableParams = async (params?: any) => {
  return getAuth(
    `${API_V1_URI}/vod/video/filterable_parameters/${buildUrlParams(params)}`,
  );
};

export const setExternalUrl = async (videoId: number, data: any) => {
  return postAuth(`${API_V1_URI}/vod/video/${videoId}/set_external_url/`, data);
};
