import { createSelector } from 'reselect';
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

const _selectedMemberId = (_: RootState, memberId: number) => memberId;

export const getReferralMemberStatusWithMemberId = createSelector(
  [getReferralMemberStatusByMemberId, _selectedMemberId],
  (referalMemberStatusByMemberId, memberId) =>
    referalMemberStatusByMemberId[memberId],
);

export const getReferralMemberStatusLoading = (state: RootState) =>
  _getState(state).referralMemberStatus.loading;
