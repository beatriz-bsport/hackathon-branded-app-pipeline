import { RootState } from '../../reducers';

const _getState = (state: RootState) => state.referral;

export const getReferralProgramsById = (state: RootState) =>
  _getState(state).referralProgram.byId;

export const getTheReferralProgram = (state: RootState) =>
  Object.values(getReferralProgramsById(state))[0] ?? null;

export const getReferralMemberStatusByMemberId = (state: RootState) =>
  _getState(state).referralMemberStatus.byId;
