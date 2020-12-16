// @flow

import {
  API_V1_URI,
  getAuth,
  postAuth,
  patchAuth,
  deleteAuth,
} from '../../http.ts';

const ACTIVE_CAMPAIGN_URI = `${API_V1_URI}/active_campaign/`;

// Active campaign account
export const getActiveCampaignAccount = async () => {
  return getAuth(`${ACTIVE_CAMPAIGN_URI}account/`);
};

export const updateActiveCampaignAccount = async (id: number, data: any) => {
  return patchAuth(`${ACTIVE_CAMPAIGN_URI}account/${id}/`, data);
};

export const deleteActiveCampaignAccount = async (id: number) => {
  return deleteAuth(`${ACTIVE_CAMPAIGN_URI}account/${id}/`);
};

export const createActiveCampaignAccount = async (data: any) => {
  return postAuth(`${ACTIVE_CAMPAIGN_URI}account/`, data);
};

// Active campaign links
export const getActiveCampaignListsLinks = async () => {
  return getAuth(`${ACTIVE_CAMPAIGN_URI}links/`);
};

export const updateActiveCampaignListsLinks = async (id: number, data: any) => {
  return patchAuth(`${ACTIVE_CAMPAIGN_URI}links/${id}/`, data);
};

export const deleteActiveCampaignListsLinks = async (id: number) => {
  return deleteAuth(`${ACTIVE_CAMPAIGN_URI}links/${id}/`);
};

export const createActiveCampaignListsLinks = async (data: any) => {
  return postAuth(`${ACTIVE_CAMPAIGN_URI}links/`, data);
};

export const getActiveCampaignLists = async (id: number) => {
  return getAuth(
    `${ACTIVE_CAMPAIGN_URI}account/${id}/get_active_campaign_lists/`,
  );
};

// Active campaign webhooks
export const fetchWebhooks = async (id: number) => {
  return getAuth(
    `${ACTIVE_CAMPAIGN_URI}account/${id}/get_active_campaign_webhooks/`,
  );
};

export const createWebhook = async (id: number, name: string) => {
  return postAuth(
    `${ACTIVE_CAMPAIGN_URI}account/${id}/create_webhook/?name=${name}`,
  );
};

export const deleteWebhook = async (id: number, webhook_id: number) => {
  return postAuth(
    `${ACTIVE_CAMPAIGN_URI}account/${id}/delete_webhook/?webhook_id=${webhook_id}`,
  );
};
