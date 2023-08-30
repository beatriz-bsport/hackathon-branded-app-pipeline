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

export const getReferralLinkStatusByReferringMemberId = (state: RootState) =>
  _getState(state).referralLinkStatus.byId;

export const getTheReferralLinkStatus = (state: RootState) =>
  Object.values(getReferralLinkStatusByReferringMemberId(state))[0] ?? null;

export const getReferralLinkStatusLoading = (state: RootState) =>
  _getState(state).referralLinkStatus.loading;

export const getReferralRegistrationErrorCode = (state: RootState) =>
  _getState(state).referralException.registrationErrorCode;
