// @flow

import { API_V1_URI, postAuth, getAuth, buildUrlParams } from '../../http';
import type { MemberMailData } from './types';

export const sendMailToMembers = async (data: MemberMailData) => {
  return postAuth(`${API_V1_URI}/member/send_email/`, data);
};

export const fetchCampaignList = async (params: any) => {
  return getAuth(`${API_V1_URI}/communication/email/${buildUrlParams(params)}`);
};

export const fetchCampaignReport = async (id: number) => {
  return getAuth(`${API_V1_URI}/communication/email/${id}/report/`);
};

export const fetchCampaign = async (id: number) => {
  return getAuth(`${API_V1_URI}/communication/email/${id}/`);
};

export const fetchRecipientList = async (params: any) => {
  return getAuth(
    `${API_V1_URI}/communication/recipient/${buildUrlParams(params)}`,
  );
};
