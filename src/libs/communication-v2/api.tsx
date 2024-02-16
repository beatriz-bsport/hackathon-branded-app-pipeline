import type { AxiosResponse } from 'axios';
import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox';
import {
  API_V1_URI,
  buildUrlParams,
  deleteAuth,
  getAuth,
  getAuthDeprecated,
  patchAuth,
  postAuth,
  postAuthDeprecated,
  putAuth,
} from '../../http';
import type {
  CommunicationContext,
  CommunicationProvider,
  CommunicationProviderSettings,
  CommunicationScheduled,
  CommunicationScheduledCreate,
  CommunicationScheduledFilters,
  CommunicationThread,
  FetchCommunicationParams,
  InboxThreadListParams,
  MessageParams,
  SmartListPopupSending,
  UnreadAnswersCount,
} from './types';
import type { FetchRecipientsParams } from '#libs/member/types';
import type { GenericPaginationResults } from '#libs/types';
import type { PaginatedResponse } from '../../state/types';

export const sendCommunication = async (data: MessageParams) => {
  return postAuthDeprecated(
    `${API_V1_URI}/communication/communication_sent/send_communication/`,
    data,
  );
};

export const fetchCommunicationSentList = async (
  params: FetchCommunicationParams,
) => {
  return getAuthDeprecated(
    `${API_V1_URI}/communication/communication_sent/${buildUrlParams(params)}`,
  );
};

export const fetchCommunicationSent = async (campaign_id: string) => {
  return getAuthDeprecated(
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
  return getAuthDeprecated(
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
  return getAuthDeprecated(
    `${API_V1_URI}/member/selected_members_for_communication_chat_all_kinds/${buildUrlParams(
      params,
    )}`,
  );
};

export const flagCommunicationRecipientAsRead = async (id: number) => {
  return postAuthDeprecated(
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

export const getOrCreateThread = async (
  context: ChatThreadKinds,
  resourceId: number,
): Promise<AxiosResponse<CommunicationThread>> => {
  return postAuth(
    `${API_V1_URI}/communication/communication_thread/get_or_create/`,
    { related_object_kind: context, related_object_id: resourceId },
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

// COMMUNICATION SCHEDULED

export const createCommunicationScheduled = (
  communicationScheduled: CommunicationScheduledCreate,
) => {
  return postAuth<CommunicationScheduled>(
    `${API_V1_URI}/communication/communication_scheduled/`,
    communicationScheduled,
  );
};

export const fetchCommunicationScheduledList = (
  filters?: CommunicationScheduledFilters,
) => {
  return getAuth<PaginatedResponse<CommunicationScheduled>>(
    `${API_V1_URI}/communication/communication_scheduled/${buildUrlParams(
      filters,
    )}`,
  );
};

export const retrieveCommunicationScheduled = (id: number) => {
  return getAuth<CommunicationScheduled>(
    `${API_V1_URI}/communication/communication_scheduled/${id}`,
  );
};

export const deleteCommunicationScheduled = (id: number) => {
  return deleteAuth<CommunicationScheduled>(
    `${API_V1_URI}/communication/communication_scheduled/${id}`,
  );
};

export const updateCommunicationScheduled = (
  id: number,
  updatedCommunicationScheduled: CommunicationScheduled,
) => {
  return putAuth<CommunicationScheduled>(
    `${API_V1_URI}/communication/communication_scheduled/${id}/`,
    updatedCommunicationScheduled,
  );
};

export const sendNowCommunicationScheduled = (id: number) => {
  return postAuth<CommunicationScheduled>(
    `${API_V1_URI}/communication/communication_scheduled/${id}/send_now/`,
  );
};
