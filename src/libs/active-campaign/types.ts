import type { SmartList } from '#src/libs/smart-list/types';
import type { ErrorAndLoading } from '#src/libs/types';

export type ActiveCampaignList = any; // External api
export type ActiveCampaignWebhook = any; // External api

export type LinkApi = {
  id?: number;
  smartlist: number | null;
  active_campaign_list: string;
};
export type Link = {
  id?: number;
  smartlist: SmartList;
  active_campaign_list: string;
};
export type LinkState = {
  upsert: ErrorAndLoading;
  byId: {
    [id: number]: LinkApi;
  };
  allIds: number[];
  lists: ActiveCampaignList[];
  listsLoading: boolean;
  listsError?: number | null;
} & ErrorAndLoading;

export type LinksPayload = {
  linksDict: LinkState['byId'];
  linksIdList: number[];
};
export type Account = {
  id?: number;
  company?: number;
  token: string;
  api_url: string;
};

export type ActiveCampaignState = {
  account: {
    item: Account;
    upsert: ErrorAndLoading;
    webhooks: WebhookState;
  } & ErrorAndLoading;
  links: LinkState;
};

export type WebhookState = {
  items: ActiveCampaignWebhook[];
  loading: boolean;
  error?: number | null;
};
