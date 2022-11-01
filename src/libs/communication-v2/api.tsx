import { API_V1_URI, postAuth, getAuth, buildUrlParams } from '../../http';
import { MessageParams, FetchCommunicationParams } from './types';
import { FetchRecipientsParams } from '#libs/member/types';

export const sendCommunication = async (data: MessageParams) => {
  return postAuth(
    `${API_V1_URI}/communication/communication_sent/send_communication/`,
    data,
  );
};

export const fetchCommunicationSentList = async (
  params: FetchCommunicationParams,
) => {
  return getAuth(
    `${API_V1_URI}/communication/communication_sent/${buildUrlParams(params)}`,
  );
};

export const fetchCommunicationRecipientList = async (params: {
  page_size: number;
  page: number;
  communication_sent: number;
  member_id__in?: number[];
  offer_with_selected_categories?: string;
}) => {
  return getAuth(
    `${API_V1_URI}/communication/communication_recipient/${buildUrlParams(
      params,
    )}`,
  );
};

export const fetchFirstSelectedRecipientsForChatAllKinds = async (
  params: {
    blacklist_email: number[];
    blacklist_phone: number[];
    blacklist_notification: number[];
  } & FetchRecipientsParams,
) => {
  return getAuth(
    `${API_V1_URI}/member/selected_members_for_communication_chat_all_kinds/${buildUrlParams(
      params,
    )}`,
  );
};
