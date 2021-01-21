import {
  getAuth,
  buildUrlParams,
  postAuth,
  patchAuth,
  deleteAuth,
  API_V1_URI,
} from '../../http';

export const fetchPlaylistList = async (params: any = {}) => {
  return getAuth(`${API_V1_URI}/vod/playlist/${buildUrlParams(params)}`);
};

export const retrievePlaylist = async (id: number) => {
  return getAuth(`${API_V1_URI}/vod/playlist/${id}/`);
};

export const createOrUpdatePlaylist = async (data: any = {}) => {
  if (data.get('id')) {
    return patchAuth(`${API_V1_URI}/vod/playlist/${data.get('id')}/`, data);
  }
  return postAuth(`${API_V1_URI}/vod/playlist/`, data);
};

export const deletePlaylist = async (id: number) => {
  return deleteAuth(`${API_V1_URI}/vod/playlist/${id}/`);
};

export const addVideoToPlaylist = async (playlist: number, video: number) => {
  return postAuth(`${API_V1_URI}/vod/playlist/${playlist}/item/`, { video });
};

export const delVideoToPlaylist = async (playlist: number, video: number) => {
  return deleteAuth(`${API_V1_URI}/vod/playlist/${playlist}/item/`, { video });
};
