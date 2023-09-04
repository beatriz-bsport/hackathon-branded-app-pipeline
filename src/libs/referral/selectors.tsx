import type { RootState } from '../../reducers';

const _getState = (state: RootState) => state.referral;

export const getReferralProgramsById = (state: RootState) =>
  _getState(state).referralProgram.byId;

export const getReferralProgramsLoading = (state: RootState) =>
  _getState(state).referralProgram.loading;

export const getTheReferralProgram = (state: RootState) =>
  Object.values(getReferralProgramsById(state))[0] ?? null;

export const getReferralMemberStatusByMemberId = (state: RootState) =>
  _getState(state).referralMemberStatus.byId;

export const getReferralMemberStatusLoading = (state: RootState) =>
  _getState(state).referralMemberStatus.loading;
