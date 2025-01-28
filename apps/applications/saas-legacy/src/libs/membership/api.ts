import { LinkToCompanyWithReferralPayload } from '#src/libs/referral/types';
import { getAuth, postAuth, buildUrlParams } from '../../http';
import { Membership } from './types';
import Config from '../../config';

const API_V1_URI = Config.REACT_APP_BASE_URI_CORE_V1;

export const fetchMembershipList = async (params: any = {}) => {
  return getAuth(`${API_V1_URI}/membership/${buildUrlParams(params)}`);
};

export const fetchMembership = async (
  id: number,
  params?: { member_id: number },
) => {
  return getAuth(`${API_V1_URI}/membership/${id}/${buildUrlParams(params)}`);
};

export const fetchMembershipByCompany = async (companyId: number) => {
  return getAuth<Membership>(
    `${API_V1_URI}/membership/${companyId}/by_company/`,
  );
};

export const fetchMembershipByBasket = async (data: {
  basket_uuid: string;
}) => {
  return postAuth(`${API_V1_URI}/membership/by_basket_uuid/`, {
    ...data,
  });
};

export async function linkMeToCompany(data: any) {
  return postAuth(`${API_V1_URI}/membership/link_to_company/`, data);
}

export async function linkMeToCompanyWithReferral(data: {
  company?: number;
  offer?: number;
  referral_uuid?: string;
}) {
  return postAuth<LinkToCompanyWithReferralPayload>(
    `${API_V1_URI}/membership/link_to_company_with_referral/`,
    data,
  );
}

export async function requestMembershipValidation(data: any) {
  return postAuth(`${API_V1_URI}/membership/need_membership_validation/`, data);
}
