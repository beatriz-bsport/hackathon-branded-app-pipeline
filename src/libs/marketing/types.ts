export type MarketingNotification = {
  id?: number;
  company?: number;
  kind: number;
  event_rules: {
    days_left?: number; // 3
    smartlist_exclude?: number[]; // 3
    smartlist_include?: number[]; // 3
    credits_left?: number; // 4
    name?: string; // 3, 4, 5, 6
    contains_all_payment_packs?: boolean; // 3, 4
    payment_pack_ids?: number[]; // 3, 4
    contains_all_private_passes?: boolean; // 5, 6
    private_pass_ids?: number[]; // 5, 6
    contract_id?: number;
    meta_activity_id?: number; // 2
    establishment_id?: number; // 2
    establishment_group_id?: number;
    private_service_id?: number; // 1
    notify_booking_nb?: number; // 1, 2
    days?: number;
    hours?: number; // 2
    kind?: number; // 1
    disabled_if_in_contract?: boolean;
  };
  email_design: number;
  is_event_based?: boolean;
  active?: boolean;
  push_notification_content: string;
  push_notification_title: string;
  smartlist_include?: Array<number>;
  smartlist_exclude?: Array<number>;
};

export type MarketingNotificationState = {
  byId: { [key: string]: MarketingNotification };
  byEstablishmentGroupId: { [key: string]: Array<number> };
  allIds: number[];
  notifications: MarketingNotification[];
  loading: boolean;
  error?: Error;
  createOrUpdate: {
    loading: boolean;
    error?: Error;
  };
};
