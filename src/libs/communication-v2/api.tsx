import { AxiosResponse } from 'axios';
import { API_V1_URI, postAuth, getAuth, buildUrlParams } from '../../http';
import {
  MessageParams,
  FetchCommunicationParams,
  CommunicationContext,
} from './types';
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

export const fetchCommunicationSent = async (campaign_id: string) => {
  return getAuth(
    `${API_V1_URI}/communication/communication_sent/${campaign_id}`,
  );
};

export const getUnreadAnswersCount = async (
  params: CommunicationContext,
): Promise<AxiosResponse<number>> => {
  return getAuth(
    `${API_V1_URI}/communication/communication_sent/get_unread_answers_count/${buildUrlParams(
      params,
    )}`,
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

export const flagCommunicationRecipientAsRead = async (id: number) => {
  return postAuth(
    `${API_V1_URI}/communication/communication_recipient/${id}/flag_as_read/`,
  );
};

export const flagAllUnreadCommunicationsAsReadInContext = async (
  params: CommunicationContext,
): Promise<AxiosResponse> => {
  return postAuth(
    `${API_V1_URI}/communication/communication_sent/flag_all_unread_communications_as_read_in_context/${buildUrlParams(
      params,
    )}`,
  );
};
