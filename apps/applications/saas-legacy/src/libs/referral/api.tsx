import { getAuth, patchAuth, postAuth } from '../../http';
import type {
  ReferralProgram,
  ReferralMemberStatus,
  ReferralLinkStatus,
} from './types';
import Config from '../../config';

const API_V1_URI = Config.REACT_APP_BASE_URI_CDP_V1;

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

export const retrieveReferralLinkStatus = (referral_uuid: string) => {
  return getAuth<ReferralLinkStatus>(
    `${API_V1_URI}/referral/referral-link-status/${referral_uuid}/`,
  );
};
