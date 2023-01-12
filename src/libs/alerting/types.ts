import type { LanguageDict } from '#libs/platform-tutorial/types';
import { Member } from '#libs/member/types';

export type AlertGroup = {
  results: Array<Alerting>;
  loading: boolean;
  error?: Error;
  next?: number;
  count: number;
  alert_kind: string;
};

export type Alerting = {
  company: number;
  silenced_at?: string;
  id: number;
  alert_kind: number;
  data: any;
};

export type PrivateBookingAlerting = Alerting & {
  data: {
    user_name: string;
    date_start: string;
    name: string;
  };
};

export type CompanyOnboardingAlerting = Alerting & {
  data: {
    type: 'verification' | 'creation' | 'payout';
    date: string;
    name: string;
  };
};

export type UnevenInvoiceAlerting = Alerting & {
  data: {
    uuid: string;
    legal_identifier: string;
    price_payed: string;
    price_due: string;
    date_invoice: string;
    actions: ['equilibrate'];
  };
};

export type NewOrderAlerting = Alerting & {
  data: {
    order: string;
    price: string;
    member: number;
    name: string;
    actions: ['finalize'];
  };
};

export type TaskAlerting = Alerting & {
  data: {
    name: string;
    description: string;
    date_due: string;
    member: Member;
  };
};

export type UnreadCommunicationAlerting = Alerting & {
  data: {
    name: string;
    content: string;
    date_created: string;
    id: number;
    photo: string;
    member: number;
  };
};

export type NewTutorialSectionOrLessonAlerting = Alerting & {
  data: {
    section_names: LanguageDict;
    lesson_names: LanguageDict;
    section_id: number;
    lesson_id: number;
    new_section: boolean;
  };
};

export type LateReplacementRequestAlerting = Alerting & {
  data: {
    user_name: string;
    date_start: string;
    name: string;
  };
};
// TODO TYPES
export type AlertingState = {
  items_by_kind: any; // TODO CHECK THIS
  items_processing: any[]; // TODO CHECK THIS
  loading: boolean;
  error?: Error;
};

export type DeleteAlert = (kind: number, id: number) => void;
