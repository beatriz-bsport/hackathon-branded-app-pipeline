import { getAuth, patchAuth, API_V1_URI, postAuth } from '../../http';
import type { ReferralProgram, ReferralMemberStatus } from './types';

export const retrieveReferralProgram = () => {
  return getAuth<ReferralProgram>(
    `${API_V1_URI}/referral/referral-program/me/`,
  );
};

export const retrieveReferralProgramForCompany = (company_id: number) => {
  return postAuth<ReferralProgram>(
    `${API_V1_URI}/referral/referral-program/get_for_company/`,
    { company_id },
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
