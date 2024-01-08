import {
  API_V1_URI,
  getAuth,
  buildUrlParams,
  postAuth,
  patchAuth,
  deleteAuth,
} from '../../http';
import type {
  AssetForBlueprint,
  SpotType,
  RoomBlueprint,
  RoomBlueprintFilters,
} from '#libs/spot-scheduling/types';
import type { DeepPartial } from '../../utils/types';

const API = `${API_V1_URI}/spot-scheduling`;

export const fetchRoomBlueprints = async (params: RoomBlueprintFilters) => {
  return getAuth<RoomBlueprint>(
    `${API}/room-blueprint/${buildUrlParams(params)}`,
  );
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

export const fetchAssetForBlueprint = (params: { blueprint: number }) => {
  return getAuth<AssetForBlueprint[]>(
    `${API}/asset-for-blueprint/${buildUrlParams(params)}`,
  );
};

export const createAssetForBlueprint = async (data: FormData) => {
  return postAuth(`${API}/asset-for-blueprint/`, data);
};

export const fetchSpotForBlueprint = (params: {
  company: number;
  blueprint: number;
}) => {
  return getAuth<SpotType[]>(
    `${API}/spot-for-blueprint/${buildUrlParams(params)}`,
  );
};

export const createSpotForBlueprint = async (data: FormData) => {
  return postAuth(`${API}/spot-for-blueprint/`, data);
};

export const updateSpotForBlueprint = async (
  id: number,
  data: DeepPartial<RoomBlueprint> | FormData,
) => {
  return patchAuth(`${API}/spot-for-blueprint/${id}/`, data);
};

export const deleteSpotType = (id: number) => {
  return deleteAuth(`${API}/spot-for-blueprint/${id}/`);
};
