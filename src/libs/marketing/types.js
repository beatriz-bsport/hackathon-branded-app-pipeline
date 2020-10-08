// @flow

export type MarketingNotification = {
  id: number,
  company: number,
  kind: number,
  event_rules: number,
  email_design: number,
  is_event_based: boolean,
};

export type MarketingNotificationState = {
  notifications: Array<MarketingNotification>,
  loading: boolean,
  error: ?Error,
  createOrUpdate: {
    loading: boolean,
    error: ?Error,
  },
};
