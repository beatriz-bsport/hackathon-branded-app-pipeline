import { API_V1_URI, postAuth, getAuth, buildUrlParams } from '../../http';
import type { MemberMailData } from './types';

export const sendMailToMembers = async (data: MemberMailData) => {
  return postAuth(`${API_V1_URI}/member/send_email/`, data);
};

export const sendMailToMembersFromTemplate = async (data: MemberMailData) => {
  return postAuth(`${API_V1_URI}/member/send_email_from_template/`, data);
};

export const sendSmsToMembers = async (data: any) => {
  return postAuth(`${API_V1_URI}/member/send_sms/`, data);
};

export const sendCommunication = async (data: any) => {
  return postAuth(
    `${API_V1_URI}/communication/communication_sent/send_communication/`,
    data,
  );
};

export const fetchCampaignList = async (params: any) => {
  return getAuth(`${API_V1_URI}/communication/email/${buildUrlParams(params)}`);
};

export const fetchCampaignReport = async (id: number) => {
  return getAuth(`${API_V1_URI}/communication/email/${id}/report/`);
};

export const fetchCampaignSummary = async (params: { id: number }) => {
  return postAuth(
    `${API_V1_URI}/communication/email/campaign_summary/`,
    params,
  );
};

export const fetchCampaign = async (id: number) => {
  return getAuth(`${API_V1_URI}/communication/email/${id}/`);
};

export const fetchRecipientList = async (params: any) => {
  return getAuth(
    `${API_V1_URI}/communication/recipient/${buildUrlParams(params)}`,
  );
};

export const fetchPushNotificationAvailableMember = (ids: number[]) => {
  return getAuth(
    `${API_V1_URI}/push_notification/get_available_member/${buildUrlParams({
      ids,
    })}`,
  );
};
