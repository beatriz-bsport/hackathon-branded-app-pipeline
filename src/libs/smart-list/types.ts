// @ts-nocheck
import { ErrorAndLoading } from '../types';

export type SmartList = {
  id: number;
  company: number;
  name: string;
  description: string;
  members: Array<any>;
  member_base: number;
};

export type AutoTagRule = {
  id: number;
  smartlist: number;
  tag: number;
  kind: number;
  date_created: string;
};

export type SmartListState = ErrorAndLoading & {
  byId: { [key: string]: SmartList };
  allIds: number[];
  upsert: ErrorAndLoading;
  filter: ErrorAndLoading;
  filtersByCategoryId: { [identifier: string]: any[] };
  smartListTagRules: ErrorAndLoading & {
    byId: { [key: string]: AutoTagRule };
    allIds: number[];
  };
  smartListFiltered: ErrorAndLoading & {
    items: SmartList[];
  };
  automatedCampaign: ErrorAndLoading & {
    byId: { [key: number]: AutomatedCampaign };
    allIds: number[];
    bySmartListId: { [key: number]: AutomatedCampaign };
    createOrUpdate: ErrorAndLoading;
    delete: ErrorAndLoading;
  };
  cadencesUsingSmartlist: ErrorAndLoading & {
    byId: { [key: number]: number[] };
  };
};

export type AutomatedCampaignQueryParams = {
  id__in?: Array<number>;
  smartlist__id_in?: Array<number>;
  event_kind?: number;
  communication_kind?: number;
  smartlist_id?: number;
  page?: number;
  page_size?: number | null;
  exclude_disabled?: boolean;
};

export type AutomatedCampaign<C = number, SM = number, ED = number> = {
  id?: number;
  company?: C;
  smartlist: SM;
  event_kind: number;
  communication_kind: number;
  text: string | null;
  email_design: ED | null;
  title: string | null;
  disabled: boolean;
  date_created: string;
  max_communications_sent_per_member: number;
};

export type CadencesUsingSmartlistSuccess = {
  smartlist_id: number;
  cadences: number[];
};
