// @flow

import { API_V1_URI, postAuth } from '../../http';
import type { MemberMailData } from './types';

export const sendMailToMembers = async (data: MemberMailData) => {
  return postAuth(`${API_V1_URI}/member/send_email/`, data);
};

export default { sendMailToMembers };
