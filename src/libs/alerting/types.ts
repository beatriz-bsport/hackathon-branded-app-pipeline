import type { PaginatedResponse } from 'src/state/types';
import type { LanguageDict } from '#libs/platform-tutorial/types';
import type { MemberMinimalNoPhoto } from '#libs/member/types';
import {
  AlertKind,
  CompanyOnboardingTypes,
  AlertingActions,
} from './constants';

type PrivateBookingAlertingData = {
  user_name: string;
  date_start: string;
  name: string;
  private_booking: number;
  member: MemberMinimalNoPhoto;
};

export type PrivateBookingAlerting = Alerting<PrivateBookingAlertingData>;

type UnpaidPrivateBookingAlertingData = {
  credits_due: number;
} & PrivateBookingAlertingData;

export type UnpaidPrivateBookingAlerting =
  Alerting<UnpaidPrivateBookingAlertingData>;

type CompanyOnboardingAlertingData = {
  type:
    | CompanyOnboardingTypes.VERIFICATION
    | CompanyOnboardingTypes.CREATION
    | CompanyOnboardingTypes.PAYOUT;
  level: number;
  date?: string;
  count?: number;
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
  name: string;
  actions: [AlertingActions.FINALIZE];
};

export type NewOrderAlerting = Alerting<NewOrderAlertingData>;

type TaskAlertingData = {
  name: string;
  description: string;
  date_due: string;
  member: MemberMinimalNoPhoto;
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
  id?: number;
  coach: string;
  date_start: string;
  activity_name: string;
};

export type LateReplacementRequestAlerting =
  Alerting<LateReplacementRequestAlertingData>;

type AlertingData =
  | PrivateBookingAlertingData
  | UnpaidPrivateBookingAlertingData
  | CompanyOnboardingAlertingData
  | UnevenInvoiceAlertingData
  | NewOrderAlertingData
  | TaskAlertingData
  | UnreadCommunicationAlertingData
  | NewTutorialSectionOrLessonAlertingData
  | LateReplacementRequestAlertingData;

export type AlertGroup = {
  results: Alerting[];
  loading: boolean;
  error?: Error;
  next?: number;
  count: number;
  alert_kind: number;
};

export type Alerting<T = AlertingData> = {
  company?: number;
  silenced_at?: string;
  id?: number;
  alert_kind: AlertKind;
  data: T;
};

export type AlertingState = {
  items_by_kind: {
    [alert_kind in AlertKind]: {
      results: Alerting[];
      count: number;
      next: number | null;
      loading?: boolean;
    };
  };
  loading: boolean;
  error?: Error;
};

export type DeleteAlert = (kind: number, id: number) => void;

export type AlertPayloadSuccess = {
  alert_kind: AlertKind;
} & PaginatedResponse<Alerting>;

export type AlertPayloadLoading = {
  alert_kind: number;
  isLoading: boolean;
};
