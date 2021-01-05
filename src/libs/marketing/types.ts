export type MarketingNotification = {
  id: number;
  company: number;
  kind: number;
  event_rules: number;
  email_design: number;
  is_event_based: boolean;
  active: boolean;
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
