import { RootState } from '../../reducers';

export const getVideoPlaybackUrlState = (state: RootState) =>
  state.bridge.video.playbackUrl.byId;

export const getCompanyReferralProgram = (
  state: RootState,
  companyId: number,
) => state.bridge.referralProgram.byCompanyId[companyId];

export const getMembershipByCompanyId = (state: RootState, companyId: number) =>
  state.bridge.membership.byCompanyId[companyId];

export const getMemberById = (state: RootState, memberId: number) => {
  return state.bridge.member.byId[memberId];
};

export const getMemberUsingCompanyId = (
  state: RootState,
  companyId: number,
) => {
  const membership = getMembershipByCompanyId(state, companyId);
  return state.bridge.member.byId[membership?.id];
};

export const getReferralMemberStatusUsingCompanyId = (
  state: RootState,
  companyId: number,
) => {
  const membership = getMembershipByCompanyId(state, companyId);
  return state.bridge.referralMemberStatus.byMemberId[membership?.id];
};
