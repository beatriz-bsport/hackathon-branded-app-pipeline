// @flow

import { API_V1_URI, postAuth } from '../../http';

export const sendMailToMembers = async (data: any) => {
  return postAuth(`${API_V1_URI}/member/send-email/`, data);
};

export default { sendMailToMembers };
