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
  associated_coach_id: number;
  default_payment_rule_id?: number;
  coach_payment_rule?: number;
  facebook_url?: string;
  instagram_url?: string;
  disabled: boolean;
  associatedcoach_set: number[];
};

export type CoachPerformance = {
  date_start: string;
  name: string;
  duration_minute: number;
  nb_booking: number;
  price_coach: number;
  payment_rule_id?: number;
  id: number;
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
  allIds: [];
  companyAssociated: Array<Coach>;
  performance: {
    [id: number]: CoachPerformanceContainer;
  };
  upsert: {
    loading: boolean;
    error?: Error;
  };
};
