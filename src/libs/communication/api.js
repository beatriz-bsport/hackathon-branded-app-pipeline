// @flow

import { API_V1_URI, postAuth, getAuth, buildUrlParams } from '../../http';
import type { MemberMailData } from './types';

export const sendMailToMembers = async (data: MemberMailData) => {
  return postAuth(`${API_V1_URI}/member/send_email/`, data);
};

export const fetchContactList = async (params: any) => {
  return getAuth(`${API_V1_URI}/communication/email/${buildUrlParams(params)}`);
};
