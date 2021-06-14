import {
  API_V1_URI,
  getAuth,
  buildUrlParams,
  postAuth,
  patchAuth,
  deleteAuth,
} from '../../http';
import { RoomBlueprint } from './types';
import { DeepPartial } from '../../utils/types';

const API = `${API_V1_URI}/spot-scheduling`;

export const fetchRoomBlueprints = async (params: any) => {
  return getAuth(`${API}/room-blueprint/${buildUrlParams(params)}`);
};

export const fetchRoomBlueprintDetail = async (id: number) => {
  return getAuth(`${API}/room-blueprint/${id}`);
};

export const createRoomBlueprint = async (data: DeepPartial<RoomBlueprint>) => {
  return postAuth(`${API}/room-blueprint/`, data);
};

export const updateRoomBlueprint = (
  id: number,
  data: DeepPartial<RoomBlueprint> | FormData,
) => {
  return patchAuth(`${API}/room-blueprint/${id}/`, data);
};

export const deleteRoomBlueprint = (id: number) => {
  return deleteAuth(`${API}/room-blueprint/${id}/`);
};

export const fetchAssetForBlueprint = async (params: any) => {
  return getAuth(`${API}/asset-for-blueprint/${buildUrlParams(params)}`);
};

export const createAssetForBlueprint = async (data: FormData) => {
  return postAuth(`${API}/asset-for-blueprint/`, data);
};
