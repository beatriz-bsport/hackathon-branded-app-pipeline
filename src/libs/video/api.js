// @flow

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

export const deleteVideo = async (id: number) => {
  return deleteAuth(`${API_V1_URI}/vod/video/${id}/`);
};

export const attachFile = async (id: number, file: Object) => {
  return postAuth(`${API_V1_URI}/vod/video/${id}/attach_video/`, file);
};

export const getUploadInstruction = async (id: number) => {
  return postAuth(`${API_V1_URI}/vod/video/${id}/upload_instruction/`);
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

export const fetchVideoPurchase = async (params: ?any) => {
  return getAuth(
    `${API_V1_URI}/vod/video_purchase/${buildUrlParams({ ...(params || {}) })}`,
  );
};

export const fetchVideoAnalytics = async (videoId: number) => {
  return getAuth(`${API_V1_URI}/vod/video_analytics/${videoId}/`);
};

export const fetchVideoViewAnalytics = async (params: ?any) => {
  return getAuth(
    `${API_V1_URI}/vod/video_view_analytics/${buildUrlParams({
      ...(params || {}),
    })}`,
  );
};

export const fetchVideoFilterableParams = async (params: ?any) => {
  return getAuth(
    `${API_V1_URI}/vod/video/filterable_parameters/${buildUrlParams(params)}`,
  );
};
