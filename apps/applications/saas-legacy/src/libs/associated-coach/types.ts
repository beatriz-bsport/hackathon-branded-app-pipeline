import { ErrorAndLoading } from '#src/libs/types';
import { ActivitySimplified } from '../../api/types';

export type CoachUpdateOrCreatedPayload = {
  avatar: File;
  birthday: string;
  color: string;
  date_joined_company: string | null;
  date_left_company: string | null;
  description: string;
  email: string;
  facebook_url: string;
  firstname: string;
  gender: string;
  instagram_url: string;
  lastname: string;
  notes: string;
  phone: string;
};

export type Coach = {
  firstname: string;
  lastname: string;
  name: string;
  gender: string;
  rating: string;
  id: number;
  birthday: string;
  photo?: string;
  description: string;
  phone?: string;
  email?: string;
  color?: string;
  associated_coach_id: number;
  default_payment_rule_id?: number;
  coach_payment_rule_id?: number;
  private_coach_payment_rule_id: number;
  workshop_coach_payment_rule_id: number;
  coach_payment_rule_group_id: number;
  facebook_url?: string;
  instagram_url?: string;
  disabled: boolean;
  associatedcoach_set: number[];
  private_slots_coach_payment_rules: Array<{
    private_slot: number;
    coach_payment_rule: number;
  }>;
  has_access_to_coach_space: boolean;
  activities?: Array<ActivitySimplified>;
  meta_activities_taught: number[];
  workshops_taught: number[];
  categories_taught: number[];
  discipline_group_establishments: number[];
  discipline_group_establishment_groups: number[];
  is_teaching_all_activities: boolean;
  is_teaching_all_workshops: boolean;
  is_teaching_all_categories: boolean;
  discipline_group: number;
  date_joined_company?: string;
  date_left_company?: string;
  notes?: string;
};

export type CoachPerformance = {
  date_start: string;
  name: string;
  duration_minute: number;
  nb_booking: number;
  price_coach: number;
  payment_rule_id?: number;
  id: number;
  performanceLoading?: boolean;
};

export type CoachPerformanceContainer = {
  loading: boolean;
  error?: Error;
  result: Array<CoachPerformance>;
};

export type CoachState = {
  loading: boolean;
  error?: Error;
  byId: { [key: string]: Coach };
  byAssociatedCoachId: { [key: number]: Coach };
  myAssociatedCoachProfile: {
    me: Coach | null;
  } & ErrorAndLoading;
  allIds: [];
  companyAssociated: Array<Coach>;
  performance: {
    [id: number]: CoachPerformanceContainer;
  };
  upsert: {
    loading: boolean;
    error?: Error;
  };
  editAccessToCoachSpaceActions: {
    loading: boolean;
    error?: Error;
  };
  lateReplacementRequestStatus: ErrorAndLoading & {
    data: CoachLateReplacementRequestStatus;
  };
};

export type CoachReplacementPreferencesData = {
  meta_activities_taught: number[];
  workshops_taught: number[];
  categories_taught: number[];
  discipline_group_establishments: number[];
  discipline_group_establishment_groups: number[];
  is_teaching_all_activities: boolean;
  is_teaching_all_workshops: boolean;
  is_teaching_all_categories: boolean;
};

export type CoachLateReplacementRequestStatus = {
  days_before_offer_replacement_request_is_late: number;
  is_late_replacement_request_limited: boolean;
  max_late_requests_per_limitation_period?: number;
  nb_late_requests_in_current_limitation_period?: number;
  current_limitation_period_start?: string;
  current_limitation_period_end?: string;
};

export type UpdateCoachPrivateSlotsPaymentRuleData = {
  id: number;
  associated_coach_id: number;
  private_slots_coach_payment_rules: Array<{
    private_slot: number;
    coach_payment_rule: number;
  }>;
};

export type AssociatedCoachFilters = {
  company?: number;
  disabled?: boolean;
  with_workshop?: boolean;
  id__in?: number[];
  id__not_in?: number[];
  has_coach_payment_rule_group_id?: boolean;
  associated_coach__in?: number[];
};

export type CoachProfilePerformanceFilterParams = {
  isCoachSpace: boolean;
  companyId: number;
};

/**
 * Represents minimal coach data as defined by the CoachSerializerOld in the backend.
 */
export type CoachMinimal = {
  id: number;
  name: string;
  rating: string;
  age: number;
  photo: string | null;
};

export type FetchCoachParams = {
  id__in?: number[];
  associated_coach__in?: number[];
  company?: number;
};
