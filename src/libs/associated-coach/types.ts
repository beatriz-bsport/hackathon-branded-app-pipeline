import { ActivitySimplified } from '../../api/types';
import { ErrorAndLoading } from '#libs/types';

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
  is_teaching_all_activities: boolean;
  is_teaching_all_workshops: boolean;
  is_teaching_all_categories: boolean;
  discipline_group: number;
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
