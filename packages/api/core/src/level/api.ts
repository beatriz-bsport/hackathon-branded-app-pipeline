import { type ApiConfig, type Fetch, buildUrlParams } from "@bsport/store-base";

import type { Level, LevelFilterSet } from "./types";

const API_URL = "core-data/v1/master-data/level/";

const fetchLevelsAPIConfig = (params: LevelFilterSet): ApiConfig => {
  return [`${API_URL}${buildUrlParams(params)}`];
};

export const fetchLevelsAPI = async (
  fetch: Fetch<Level[]>,
  params: LevelFilterSet,
) => {
  const [uri, init] = fetchLevelsAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};

const fetchLevelAPIConfig = (params: { id: number }): ApiConfig => {
  return [`${API_URL}${params.id}`];
};

export const fetchLevelAPI = async (
  fetch: Fetch<Level>,
  params: { id: number },
) => {
  const [uri, init] = fetchLevelAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};

const updateLevelAPIConfig = (params: {
  id: number;
  data: Level;
}): ApiConfig => {
  return [
    `${API_URL}${params.id}`,
    {
      method: "PUT",
      body: JSON.stringify(params.data),
    },
  ];
};

export const updateLevelAPI = async (
  fetch: Fetch<Level>,
  params: { id: number; data: Level },
) => {
  const [uri, init] = updateLevelAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};

const createLevelAPIConfig = (params: { data: Level }): ApiConfig => {
  return [
    `${API_URL}`,
    {
      method: "POST",
      body: JSON.stringify(params.data),
    },
  ];
};

export const createLevelAPI = async (
  fetch: Fetch<Level>,
  params: { data: Level },
) => {
  const [uri, init] = createLevelAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};

const deleteLevelAPIConfig = (params: { id: number }): ApiConfig => {
  return [
    `${API_URL}${params.id}`,
    {
      method: "DELETE",
      body: JSON.stringify({ enabled: false }),
    },
  ];
};

export const deleteLevelAPI = async (
  fetch: Fetch<Level>,
  params: { id: number },
) => {
  const [uri, init] = deleteLevelAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};
