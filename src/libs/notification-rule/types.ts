import { ErrorAndLoading } from '../types';

export type NotificationRule = {
  id: number;
  company: number;
  notification_event: number;
  is_notification_push_active: boolean;
  push_notification_title: string;
  push_notification_content: string;
  email_design: number;
  title: string;
  companies: number[];
  is_active: boolean;
  send_franchisor_carbon_copy: boolean;
  email_template?: string;
  franchisor: number | null;
};

export type NotificationRuleSettings = {
  disabled: boolean;
  send_company: boolean;
};

export type NotificationRuleEventType = {
  is_editable: boolean;
  is_instance_specific: boolean;
  notification_event: number;
  notification_group: string;
};

export type NotificationRuleState = {
  tag: ErrorAndLoading & {
    data: { [tag_name: string]: Array<string> };
  };
  rule: ErrorAndLoading & {
    byId: { [key: string]: NotificationRule };
    allIds: Array<number>;
    createOrUpdate: ErrorAndLoading;
  };
  eventType: ErrorAndLoading & {
    data: NotificationRuleEventType[];
  };
  settings: ErrorAndLoading & {
    data:
      | [
          {
            company: number;
            id: number;
            settings: Record<number, NotificationRuleSettings>;
          },
        ]
      | [];
    update: ErrorAndLoading;
  };
};
