// @flow

import type { State } from '../types';

export const associatedCoachSelector = (state: State, coachId: number) =>
  state.coach.companyAssociated.find((x) => x.associated_coach_id === coachId);

export const coachSelector = (state: State, coachId: number) =>
  state.coach.companyAssociated.find((x) => x.id === coachId);
