// @flow

export type NotificationRule = {
  id: number,
  company: number,
  notification_event: number,
  email_design: number,
};

export type NotificationRuleState = {
  tag: {
    loading: boolean,
    error: ?Error,
    data: { [tag_name: string]: Array<string> },
  },
  rule: {
    byId: { [number]: NotificationRule },
    allIds: Array<number>,
    loading: boolean,
    error: ?Error,
    createOrUpdate: {
      loading: boolean,
      error: ?Error,
    },
  },
  eventType: {
    data: Array<number>,
    loading: boolean,
    error: ?Error,
  },
};
