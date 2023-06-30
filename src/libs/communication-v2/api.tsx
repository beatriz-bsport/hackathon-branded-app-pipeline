import { AxiosResponse } from 'axios';
import {
  API_V1_URI,
  postAuth,
  getAuth,
  buildUrlParams,
  patchAuth,
} from '../../http';
import {
  MessageParams,
  FetchCommunicationParams,
  CommunicationContext,
  CommunicationProvider,
  CommunicationProviderSettings,
  SmartListPopupSending,
  InboxThreadListParams,
  UnreadAnswersCount,
  CommunicationThread,
} from './types';
import { FetchRecipientsParams } from '#libs/member/types';
import { GenericPaginationResults } from '#libs/types';

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

export const fetchCommunicationProviderSettings = async (
  kind: string,
): Promise<AxiosResponse<CommunicationProvider>> => {
  // Overrides get_object method in the backend: replaces 0 by the good pk
  return getAuth(`${API_V1_URI}/communication/provider/${kind}/0/`);
};

export const updateCommunicationProviderSettings = async (
  kind: string,
  data: CommunicationProviderSettings,
): Promise<AxiosResponse<CommunicationProvider>> => {
  // idem
  return patchAuth(`${API_V1_URI}/communication/provider/${kind}/0/`, data);
};

export const fetchSmartListPopupSendings = async (params: {
  smartlist_id: number;
}): Promise<AxiosResponse<Array<SmartListPopupSending>>> =>
  getAuth(
    `${API_V1_URI}/mobile_app/smartlist_popup_sending/${buildUrlParams(
      params,
    )}`,
  );

export const sendSmartListPopup = async (
  data: FormData,
): Promise<AxiosResponse<SmartListPopupSending>> =>
  postAuth(
    `${API_V1_URI}/mobile_app/smartlist_popup_sending/send_smartlist_popup/`,
    data,
  );

// INBOX THREAD

export const fetchInboxThreadList = async (
  params: InboxThreadListParams,
): Promise<AxiosResponse<GenericPaginationResults<CommunicationThread>>> => {
  return getAuth(
    `${API_V1_URI}/communication/communication_thread/${buildUrlParams(
      params,
    )}`,
  );
};

export const fetchBatchUnreadAnswersCounts = async (params: {
  thread_ids: number[];
}): Promise<AxiosResponse<UnreadAnswersCount[]>> => {
  return getAuth(
    `${API_V1_URI}/communication/communication_thread/unread_count/${buildUrlParams(
      params,
    )}`,
  );
};

export const getUnreadAnswersCountFromThread = async (
  id: number,
): Promise<AxiosResponse<number>> => {
  return getAuth(
    `${API_V1_URI}/communication/communication_thread/${id}/get_unread_answers_count/`,
  );
};

export const switchFavoriteStatus = async (
  id: number,
): Promise<AxiosResponse<CommunicationThread>> => {
  return postAuth(
    `${API_V1_URI}/communication/communication_thread/${id}/switch_favorite_status/`,
  );
};

export const switchMutedStatus = async (
  id: number,
): Promise<AxiosResponse<CommunicationThread>> => {
  return postAuth(
    `${API_V1_URI}/communication/communication_thread/${id}/switch_muted_status/`,
  );
};

export const switchDisabledStatus = async (
  id: number,
): Promise<AxiosResponse<CommunicationThread>> => {
  return postAuth(
    `${API_V1_URI}/communication/communication_thread/${id}/switch_disabled_status/`,
  );
};

export const flagAsRead = async (
  id: number,
): Promise<AxiosResponse<CommunicationThread>> => {
  return postAuth(
    `${API_V1_URI}/communication/communication_thread/${id}/flag_as_read/`,
  );
};

export const flagAsUnread = async (
  id: number,
): Promise<AxiosResponse<CommunicationThread>> => {
  return postAuth(
    `${API_V1_URI}/communication/communication_thread/${id}/flag_as_unread/`,
  );
};

export const fetchInboxThreadFromId = async (
  id: number,
): Promise<AxiosResponse<CommunicationThread>> => {
  return getAuth(`${API_V1_URI}/communication/communication_thread/${id}/`);
};
