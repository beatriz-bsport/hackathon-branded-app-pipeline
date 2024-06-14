import type { PaginatedResponse } from 'src/state/types';
import {
  PAYMENT_ENGINE_STRIPE,
  PAYMENT_ENGINE_PAYPAL,
} from '@bsport/common/lib/master-data/payment-group';
import type { LanguageDict } from '#src/libs/platform-tutorial/types';
import type { MemberMinimalNoPhoto } from '#src/libs/member/types';
import {
  AlertKind,
  CompanyOnboardingTypes,
  AlertingActions,
  PayPalPendingActionType,
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

export type CompanyOnboardingAlertingData =
  | {
      type:
        | CompanyOnboardingTypes.VERIFICATION
        | CompanyOnboardingTypes.CREATION
        | CompanyOnboardingTypes.PAYOUT;
      level?: number;
      date?: string;
      count?: number;
      payment_engine_identifier: typeof PAYMENT_ENGINE_STRIPE;
    }
  | {
      type:
        | PayPalPendingActionType.PRIMARY_EMAIL_CONFIRMATION
        | PayPalPendingActionType.REQUIRES_MORE_INFORMATION
        | PayPalPendingActionType.ISSUE_CHECK_ACCOUNT
        | PayPalPendingActionType.ISSUE_REPEAT_ONBOARDING;
      level?: number;
      date?: string;
      count?: number;
      payment_engine_identifier: typeof PAYMENT_ENGINE_PAYPAL;
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
