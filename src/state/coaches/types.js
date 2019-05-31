// @flow

import type { CoachDetailed } from '../../api/types';

export type CoachPerformance = {
  date_start: string,
  name: string,
  duration_minute: number,
  nb_booking: number,
  price_coach: number,
  payment_rule_id: ?number,
  id: number,
};

export type CoachPerformanceContainer = {
  loading: boolean,
  error: ?Error,
  result: Array<CoachPerformance>,
};

export type CoachesState = {
  companyAssociated: CoachDetailed[],
  loading: boolean,
  error: string,
  performance: {
    [id: number]: CoachPerformanceContainer,
  },
  upsert: {
    loading: boolean,
    error: ?Error,
  },
};
