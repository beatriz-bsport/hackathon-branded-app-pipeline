import { TFunction } from 'i18next';
import { ReactNode } from 'react';
import { Subscription } from '#src/libs/subscription/types';

type SubscriptionEventPauseData = {
  nb_days?: number;
  pause?: number;
  pause_name?: string;
  from_date?: string;
  until_date?: string;
  created_by_staff?: string;
  deleted_by_staff?: string;
  is_update?: boolean;
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

type SubscriptionEventStopData = {
  tag_ids?: number[];
  has_been_stopped_by_member?: boolean;
  stopping_user_name?: string;
  stopping_user_email?: string;
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
    SubscriptionEventUpdateData &
    SubscriptionEventStopData;
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
    getSecondaryText?: (event: SubscriptionEvent, t?: TFunction) => string;
    i18nText: string;
    icon: any;
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
      // @ts-expect-error
      items: Array<GenericEvent>;
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

export type GenericEvent<T> = {
  company_event: string;
  company_id: number;
  date: number;
  event_type: string;
  identifier: string;
  uuid: string;
} & T;

export type GenericEventSpec<T> = Record<
  string,
  {
    getPrimaryText: (event?: GenericEvent<T>, t?: TFunction) => string;
    getSecondaryText?: (event?: GenericEvent<T>, t?: TFunction) => string;
    titlePrefix?: (event?: GenericEvent<T>, t?: TFunction) => string; // prefix to add before the primaryText
    icon: ReactNode;
    i18nText: string; // translation key
    disableOnClick?: boolean;
  }
>;

export type MemberEvent = {
  data: MemberEventBasketPaid &
    MemberEventBookingRegistered &
    MemberEventCustomFormFilled &
    MemberEventGiftcardUsed &
    MemberEventInvoicePaid &
    MemberEventLoginSuccessful &
    MemberEventPrivateBookingRegistered &
    MemberEventTagApplied &
    MemberEventVODBought;
};

type MemberEventBasketPaid = {
  basket_id?: string;
  invoice_uuid?: string;
  amount?: string;
};

type MemberEventBookingRegistered = {
  booker_name?: string;
  booking_id?: number;
  by_manager?: boolean;
  nb_booked_offers?: number;
  offer_date_str?: string;
  offer_id?: number;
  offer_name?: string;
  spot_id?: number;
  source_device?: string;
};

type MemberEventCustomFormFilled = {
  custom_form_filled_id?: number;
  custom_form_name?: string;
};

type MemberEventGiftcardUsed = {
  consumer_giftcard_id?: number;
  giftcard_name?: string;
};

type MemberEventInvoicePaid = {
  amount?: string;
  invoice_uuid?: string;
};

type MemberEventLoginSuccessful = {
  from_mobile_app?: boolean;
};

type MemberEventPrivateBookingRegistered = {
  booker_name?: string;
  by_manager?: boolean;
  private_booking_id?: number;
  private_service_date_str?: string;
  private_service_id: number;
  private_service_name?: string;
  private_slot_id?: number;
  private_slot_name?: string;
  source_device?: string;
};

type MemberEventTagApplied = {
  member_tag_id?: number;
  tag_group_name?: string;
  tag_id?: number;
  tag_name?: string;
};

type MemberEventVODBought = {
  member_pass_id?: string;
  member_pass_type?: string;
  video_purchase?: number;
  vod_id?: number;
  vod_name?: string;
};
