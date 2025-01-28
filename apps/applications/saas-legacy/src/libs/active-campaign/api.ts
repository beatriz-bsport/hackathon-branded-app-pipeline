import { getAuth, postAuth, patchAuth, deleteAuth } from '../../http';
import type {
  ActiveCampaignWebhook,
  Account,
  LinkApi,
  ActiveCampaignList,
} from './types';
import Config from '../../config';

const API_V1_URI = `${Config.REACT_APP_BASE_URI_CDP_V1}`;

const ACTIVE_CAMPAIGN_URI = `${API_V1_URI}/active_campaign/`;

// Active campaign account
export const getActiveCampaignAccount = () => {
  return getAuth<Account[]>(`${ACTIVE_CAMPAIGN_URI}account/`);
};

export const updateActiveCampaignAccount = (id: number, data: Account) => {
  return patchAuth<Account>(`${ACTIVE_CAMPAIGN_URI}account/${id}/`, data);
};

export const createActiveCampaignAccount = (data: Account) => {
  return postAuth<Account>(`${ACTIVE_CAMPAIGN_URI}account/`, data);
};

// Active campaign links
export const getActiveCampaignListsLinks = () => {
  return getAuth<LinkApi[]>(`${ACTIVE_CAMPAIGN_URI}links/`);
};

export const updateActiveCampaignListsLinks = (id: number, data: LinkApi) => {
  return patchAuth<LinkApi>(`${ACTIVE_CAMPAIGN_URI}links/${id}/`, data);
};

export const deleteActiveCampaignListsLinks = (id: number) => {
  return deleteAuth<void>(`${ACTIVE_CAMPAIGN_URI}links/${id}/`);
};

export const createActiveCampaignListsLinks = (data: LinkApi) => {
  return postAuth<LinkApi>(`${ACTIVE_CAMPAIGN_URI}links/`, data);
};

export const getActiveCampaignLists = (id: number) => {
  return getAuth<ActiveCampaignList[]>(
    `${ACTIVE_CAMPAIGN_URI}account/${id}/get_active_campaign_lists/`,
  );
};

// Active campaign webhooks
export const fetchWebhooks = (id: number) => {
  return getAuth<ActiveCampaignWebhook[]>(
    `${ACTIVE_CAMPAIGN_URI}account/${id}/get_active_campaign_webhooks/`,
  );
};

export const createWebhook = (id: number, name: string) => {
  return postAuth<ActiveCampaignWebhook>(
    `${ACTIVE_CAMPAIGN_URI}account/${id}/create_webhook/?name=${name}`,
  );
};

export const deleteWebhook = (id: number, webhook_id: number) => {
  return postAuth<ActiveCampaignWebhook>(
    `${ACTIVE_CAMPAIGN_URI}account/${id}/delete_webhook/?webhook_id=${webhook_id}`,
  );
};
