import type { OptionCallback, ThunkAction } from 'src/state/types';
import type { MetaActivity } from '#src/libs/meta-activity/types';
import type { PaymentPack } from '#src/libs/payment-packs/types';
import type { Coach } from '#src/libs/associated-coach/types';
import type { ErrorAndLoading } from '../types';

export type SmartList = {
  id: number;
  company: number;
  name: string;
  description: string;
  members: Array<any>;
  member_base: number;
  has_active_communication_group_configs: boolean;
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
  csvExports: {
    byId: {
      [id: number]: { exportLink: string; date: string };
    } & ErrorAndLoading;
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
  max_communications_sent_per_member: number | null;
  email_resend_count: number;
  email_resend_delay: number;
};

export type CadencesUsingSmartlistSuccess = {
  smartlist_id: number;
  cadences: number[];
};

export type FetchSmartlistMembersQueryParams = {
  page?: number;
  page_size?: number;
  email_confirmed?: boolean;
};

export type OptionType = {
  value: number | null;
  label: string;
};

export type FetchBulkItemsType = {
  meta_activities: (
    ids: number[],
    options?: OptionCallback<MetaActivity[]>,
    useCacheMilliseconds?: number,
  ) => ThunkAction;
  coaches: (ids: number[], options?: OptionCallback) => Promise<void>;
  payment_packs: (
    ids: number[],
    options?: OptionCallback<PaymentPack[]>,
  ) => any;
  establishments: (ids: number[], options?: OptionCallback) => Promise<unknown>;
  private_passes: (ids: number[], options?: OptionCallback) => Promise<void>;
  private_services: (ids: number[], options?: OptionCallback) => Promise<void>;
  custom_forms: (params: { id__in: number[] }) => Promise<void>;
};

export type FetchItemsType = {
  meta_activities: {
    fetchAction: () => ThunkAction;
    loading: boolean;
  };
  coaches: {
    fetchAction: (
      params?: {
        [key: string]: string | number | boolean | number[];
      },
      options?: OptionCallback<Coach[]>,
    ) => Promise<void>;
    loading: boolean;
  };
  payment_packs: {
    fetchAction: () => Promise<void>;
    loading: boolean;
  };
  establishments: {
    fetchAction: (params?: any, options?: OptionCallback) => Promise<void>;
    loading: boolean;
  };
  private_passes: {
    fetchAction: (params?: any, options?: OptionCallback) => Promise<void>;
    loading: boolean;
  };
  private_services: {
    fetchAction: () => Promise<void>;
    loading: boolean;
  };
  custom_forms: {
    fetchAction: () => Promise<void>;
    loading: boolean;
  };
};

export type SmartListQueryParams = {
  id__in?: number[];
  tag?: number;
};
