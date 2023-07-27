import { getAuth, patchAuth, API_V1_URI } from '../../http';
import { ReferralProgram, ReferralMemberStatus } from './types';

export const retrieveReferralProgram = () => {
  return getAuth<ReferralProgram>(
    `${API_V1_URI}/referral/referral-program/me/`,
  );
};

export const updateReferralProgram = (data: ReferralProgram) => {
  return patchAuth<ReferralProgram>(
    `${API_V1_URI}/referral/referral-program/me/`,
    data,
  );
};

export const retrieveReferralMemberStatus = (memberId: number) => {
  return getAuth<ReferralMemberStatus>(
    `${API_V1_URI}/referral/referral-member-status/${memberId}`,
  );
};
