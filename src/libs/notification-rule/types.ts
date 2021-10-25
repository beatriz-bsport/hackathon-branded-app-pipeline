import { ErrorAndLoading } from '../types';

export type NotificationRule = {
  id: number;
  company: number;
  notification_event: number;
  email_design: number;
  title: string;
  companies: number[];
  is_active: boolean;
  send_franchisor_carbon_copy: boolean;
  franchisor: number | null;
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
    data: Array<number>;
  };
  settings: ErrorAndLoading & {
    data: any[];
    update: ErrorAndLoading;
  };
};
