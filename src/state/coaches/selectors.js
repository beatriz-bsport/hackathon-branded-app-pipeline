// @flow

import { createSelector } from 'reselect';

export const associatedCoachSelector = (state, coachId) =>
  state.coach.companyAssociated.find((x) => x.associated_coach_id === coachId);
