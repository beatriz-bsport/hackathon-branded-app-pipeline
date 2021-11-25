export type MarketingNotification = {
  id: number;
  company: number;
  kind: number;
  event_rules: {
    days_left?: number; // 3
    smartlist_exclude?: number[]; // 3
    smartlist_include?: number[]; // 3
    credits_left?: number; // 4
    payment_pack_id?: number; // 3, 4
    meta_activity_id?: number; // 2
    establishment_id?: number; // 2
    private_service_id?: number; // 1
    notify_booking_nb?: number; // 1, 2
    hours?: number; // 2
    kind?: number; // 1
  };
  email_design: number;
  is_event_based: boolean;
  active: boolean;
  push_notification_content: string;
  push_notification_title: string;
};

export type MarketingNotificationState = {
  byId: { [key: string]: MarketingNotification };
  allIds: number[];
  notifications: MarketingNotification[];
  loading: boolean;
  error?: Error;
  createOrUpdate: {
    loading: boolean;
    error?: Error;
  };
};
