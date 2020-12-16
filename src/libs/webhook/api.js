// @flow

import {
  API_V1_URI,
  getAuth,
  buildUrlParams,
  postAuth,
  patchAuth,
  deleteAuth,
} from '../../http.ts';

const WEBHOOK_URI = `${API_V1_URI}/webhook/`;

export const fetchAllWebhooks = async (params: any) => {
  return getAuth(`${WEBHOOK_URI}${buildUrlParams(params)}`);
};

export const fetchWebhookEventList = async () => {
  return getAuth(`${WEBHOOK_URI}events/`);
};

export const createWebhook = async (data: any) => {
  return postAuth(WEBHOOK_URI, data);
};

export const getPayloadSchema = async () => {
  return getAuth(`${WEBHOOK_URI}schema/`);
};

export const testWebhookUrl = async (id: number) => {
  return postAuth(`${WEBHOOK_URI}${id}/test_url/`);
};

export const updateWebhook = (id: number, data: any) => {
  return patchAuth(`${WEBHOOK_URI}${id}/`, data);
};

export const deleteWebhook = (id: string) => {
  return deleteAuth(`${WEBHOOK_URI}${id}/`);
};
