import { Offer } from '#src/libs/offer/types';
import { ErrorAndLoading } from '#src/libs/types';
import {
  ReplacementRequestStatus,
  ReplacementRequestCoachAnswerStatus,
} from './constants';

export type ReplacementRequest<
  Coach = number,
  Establishment = number,
  MetaActivity = number,
  Activity = number,
  Tag = number,
  Group = number,
  Level = number,
> = {
  id: number;
  company: number;
  status: ReplacementRequestStatus;
  reason: string;
  date_requested: string;
  closing_date: string;
  closing_date_override: string;
  offer: Offer<Coach, Establishment, MetaActivity, Activity, Tag, Group, Level>;
  coach_author: Coach;
  coach_answer: ReplacementRequestCoachAnswer[];
  has_requested_late: boolean;
};

export type ReplacementOffer<
  C = number,
  E = number,
  M = number,
  A = number,
  T = number,
  G = number,
  L = number,
> = Offer<C, E, M, A, T, G, L> & {
  coach_author?: C;
  selected_coach?: C;
};

export type ReplacementRequestCoachAnswer<C = number, R = number> = {
  id: number;
  date_created: string;
  date_answered: string;
  answer: ReplacementRequestCoachAnswerStatus;
  coach: C;
  replacementRequest: R;
};

export type DisciplineGroup<
  M = number,
  W = number,
  Ca = number,
  E = number,
  Eg = number,
  Co = number,
> = {
  id: number;
  name: string;
  meta_activities: M[];
  all_activities: boolean;
  workshops: W[];
  all_workshops: boolean;
  categories: Ca[];
  all_categories: boolean;
  establishments: E[];
  establishment_groups: Eg[];
  associated_coaches: Co[];
  company: number;
  date_created: string;
};

export type ReplacementRequestFilter = {
  page: number;
  company?: number;
  coach__in?: number[];
  coach?: number;
  approved_coach?: number;
  establishment__in?: number[];
  establishment_group__in?: number[];
  category__in?: number[];
  meta_activity__in?: number[];
  offer__date_start__gte?: string;
  offer__date_start__lte?: string;
  timePeriod?: string;
  me?: boolean;
  status__in?: number[];
  has_requested_late?: boolean;
  closing_date_exceeded?: boolean;
  offer_is_in_the_past?: boolean;
  offer_available?: boolean;
  page_size?: number;
};

export type ReplacementRequestCoachAnswerFilter = {
  // page: number;
  company?: number;
  coach?: number;
  id__in?: number[];
  replacement_request__in?: number[];
};

export type ReplacementRequestOfferHistoryFilter = {
  min_date?: string;
  max_date?: string;
  timePeriod: string;
};

export type ReplacementRequestState = ErrorAndLoading & {
  byId: Record<number, ReplacementRequest>;
  allIds: number[];
  count: number;
  page: number;
  updateRequest: ErrorAndLoading;
  pendingRequests: {
    byId: Record<number, ReplacementRequest>;
    allIds: number[];
    count: number;
    page: number;
    loading: boolean;
  };
  teacherFoundRequests: {
    byId: Record<number, ReplacementRequest>;
    allIds: number[];
    count: number;
    page: number;
    loading: boolean;
    hasUnseen: boolean;
  };
  substitutionHistory: {
    items: SubstitutionHistoryItem[];
    count: number;
    page: number;
    loading: boolean;
    error?: Error | null;
  };
  replacementRequestCoachAnswer: ErrorAndLoading & {
    byId: Record<number, ReplacementRequestCoachAnswer>;
    allIds: number[];
  };
  disciplineGroup: ErrorAndLoading & {
    byId: Record<number, DisciplineGroup>;
    allIds: number[];
    count: number;
    page: number;
  };
  configuration: {
    configuration: ReplacementRequestConfiguration;
  } & ErrorAndLoading;
  hasRequestsLinkedToCancelledOffers: {
    exists: boolean;
  } & ErrorAndLoading;
};

export type CompatibleCoachesByCategory = {
  activities: Record<number | string, number>;
  workshops: Record<number | string, number>;
  SCTs: Record<number | string, number>;
};

export type DisciplineGroupAPIData = {
  name: string;
  company: number;
  categories: number[];
  all_categories: boolean;
  meta_activities: number[];
  all_activities: boolean;
  workshops: number[];
  all_workshops: boolean;
  establishments: number[];
  establishment_groups: number[];
  associated_coaches: number[];
};

export type AssignAssociatedCoachDisciplineGroupParams = {
  associatedCoachId: number;
  associatedCoachDisciplineGroupId: number;
};

// API DATA
export type ReplacementRequestAPIData = {
  id?: number;
  company: number;
  offer: number;
  reason: string;
  date_created?: string;
  status?: ReplacementRequestStatus;
  has_requested_late?: boolean;
  closing_date?: string;
  coach_answer?: number[];
};

export type ReplacementRequestCoachAnswerAPIData = {
  id?: number;
  company: number;
  replacement_request: number;
  coach: number;
  answer: ReplacementRequestCoachAnswerStatus;
  date_created?: string;
};

export type ReplacementRequestConfiguration = {
  id?: number;
  company?: number;
  days_before_offer_replacement_request_is_late: number;
  days_before_offer_replacement_request_closing_date: number;
  is_late_replacement_request_limited: boolean;
  late_request_limitation_period_type: number;
  late_request_limitation_period_nb: number;
  max_late_requests_per_limitation_period: number;
};

export type SubstitutionHistoryItem = {
  offer: number;
  date_start: string;
  duration_minute: number;
  activity: number;
  activity_name: string;
  name_override: string | null;
  company: number;
  level: number | null;
  level_name: string | null;
  level_color: string | null;
  establishment_id: number;
  establishment_name: string;
  coach: number;
  coach_name: string;
  coach_override: number | null;
  coach_override_name: string | null;
  coach_author: number | null;
  coach_author_name: string | null;
  request_id: number | null;
  reason: string | null;
  replacement_request_status: number | null;
  selected_coach: number | null;
  selected_coach_name: string | null;
  date_requested?: string;
  closing_date?: string;
  closing_date_override?: string;
};

export type SubstitutionHistoryFilter = {
  company: number;
  coach?: number;
  min_date?: string;
  max_date?: string;
  page?: number;
  page_size?: number;
};
