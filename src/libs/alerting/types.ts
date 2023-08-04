import type { LanguageDict } from '#libs/platform-tutorial/types';
import { Member } from '#libs/member/types';
import {
  AlertKind,
  CompanyOnboardingTypes,
  AlertingActions,
} from './constants';

export type AlertGroup = {
  results: Array<Alerting>;
  loading: boolean;
  error?: Error;
  next?: number;
  count: number;
  alert_kind: string;
};

export type Alerting<T = unknown> = {
  company: number;
  silenced_at?: string;
  id: number;
  alert_kind: AlertKind;
  data: T;
};

type PrivateBookingAlertingData = {
  user_name: string;
  date_start: string;
  name: string;
};

export type PrivateBookingAlerting = Alerting<PrivateBookingAlertingData>;

type CompanyOnboardingAlertingData = {
  type:
    | CompanyOnboardingTypes.VERIFICATION
    | CompanyOnboardingTypes.CREATION
    | CompanyOnboardingTypes.PAYOUT;
  date: string;
  name: string;
};

export type CompanyOnboardingAlerting = Alerting<CompanyOnboardingAlertingData>;

type UnevenInvoiceAlertingData = {
  uuid: string;
  legal_identifier: string;
  price_payed: string;
  price_due: string;
  date_invoice: string;
  actions: [AlertingActions.EQUILIBRATE];
};

export type UnevenInvoiceAlerting = Alerting<UnevenInvoiceAlertingData>;

type NewOrderAlertingData = {
  order: string;
  price: string;
  member: number;
  name: string;
  actions: [AlertingActions.FINALIZE];
};

export type NewOrderAlerting = Alerting<NewOrderAlertingData>;

type TaskAlertingData = {
  name: string;
  description: string;
  date_due: string;
  member: Member;
};

export type TaskAlerting = Alerting<TaskAlertingData>;

type UnreadCommunicationAlertingData = {
  name: string;
  content: string;
  date_created: string;
  id: number;
  photo: string;
  member: number;
};

export type UnreadCommunicationAlerting =
  Alerting<UnreadCommunicationAlertingData>;

type NewTutorialSectionOrLessonAlertingData = {
  section_names: LanguageDict;
  lesson_names: LanguageDict;
  section_id: number;
  lesson_id: number;
  new_section: boolean;
};

export type NewTutorialSectionOrLessonAlerting =
  Alerting<NewTutorialSectionOrLessonAlertingData>;

type LateReplacementRequestAlertingData = {
  user_name: string;
  date_start: string;
  name: string;
};

export type LateReplacementRequestAlerting =
  Alerting<LateReplacementRequestAlertingData>;

export type AlertingState = {
  items_by_kind: {
    [alert_kind in AlertKind]: {
      results: AlertPayloadResult[];
      count: number;
      next: number | null;
      loading?: boolean;
    };
  };
  loading: boolean;
  error?: Error;
};

export type DeleteAlert = (kind: number, id: number) => void;

export type AlertPayloadResult = {
  data:
    | PrivateBookingAlertingData
    | CompanyOnboardingAlertingData
    | UnevenInvoiceAlertingData
    | NewOrderAlertingData
    | TaskAlertingData
    | UnreadCommunicationAlertingData
    | NewTutorialSectionOrLessonAlertingData
    | LateReplacementRequestAlertingData;
  alert_kind: AlertKind;
  company: number;
};

export type AlertPayloadSuccess = {
  alert_kind: AlertKind;
  results: AlertPayloadResult[];
  page: number;
  next_page: number | null;
  count: number;
  links: {
    next: string | null;
    previous: string | null;
  };
};

export type AlertPayloadLoading = {
  alert_kind: number;
  isLoading: boolean;
};
