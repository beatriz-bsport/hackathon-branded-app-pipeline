import { TFunction } from 'i18next';
import { Subscription } from '#libs/subscription/types';

type SubscriptionEventPauseData = {
  nb_days?: number;
  pause?: number;
  pause_name?: string;
};

type SubscriptionEventUpdateData = {
  author_id?: number;
  auto_renewal?: boolean;
  canceled_at?: string;
  company_id?: number;
  contract_id?: number;
  description?: string;
  editable?: boolean;
  has_ended?: boolean;
  id?: number;
  interval?: string;
  is_v2?: boolean;
  legal_contract?: string;
  member_id?: number;
  metadata?: any;
  name?: string;
  nb_interval?: number;
  note?: string;
  payment_combo_id?: number;
  payment_engine?: number;
  payment_method?: number;
  payment_method_identifier?: number;
  payment_pack_id?: number;
  private_pass_id?: number;
  recurrence_basis?: number;
  source_device?: number;
  started_at?: string;
  use_stripe_connected?: boolean;
};

export type SubscriptionEvent = {
  company_event: string;
  company_id: number;
  data: {
    billing_plan: number;
    payment_pack?: number;
    private_pass?: number;
    payment_combo?: number;
    amount?: number;
  } & SubscriptionEventPauseData &
    SubscriptionEventUpdateData;
  date: number;
  event_type: string;
  identifier: string;
  subscription?: Subscription;
  uuid: string;
};

export type SubscriptionEventSpec = Record<
  any,
  {
    getPrimaryText: (event?: SubscriptionEvent, t?: TFunction) => any;
    i18nText: string;
    icon: any;
    secondarySuffix?: (event: SubscriptionEvent, t?: TFunction) => string;
    titlePrefix?: (event: SubscriptionEvent) => string;
  }
>;

export type EventState = {
  byIdentifier: {
    [identifier: string]: {
      identifier: string;
      page: number;
      error: boolean;
      loading: boolean;
      items: Array<SubscriptionEvent>;
    };
  };
};

export type EventListParams = {
  page?: number;
  page_size?: number;
  billing_plan?: number;
  object_id?: number;
  event_types?: Array<string>;
};
