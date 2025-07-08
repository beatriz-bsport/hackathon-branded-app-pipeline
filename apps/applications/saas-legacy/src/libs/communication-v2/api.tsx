import type { AxiosResponse } from 'axios';
import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox.js';
import type { GenericPaginationResults } from '#src/libs/types';
import {
  buildUrlParams,
  deleteAuth,
  getAuth,
  getAuthDeprecated,
  patchAuth,
  postAuth,
  postAuthDeprecated,
  putAuth,
} from '#src/http';
import type {
  CommunicationContext,
  CommunicationProvider,
  CommunicationProviderSettings,
  CommunicationScheduled,
  CommunicationScheduledCreate,
  CommunicationScheduledFilters,
  CommunicationThread,
  FetchCommunicationParams,
  FetchFirstReachedRecipientsParams,
  InboxThreadListParams,
  MemberListDataByCommunicationKind,
  MessageParams,
  SmartListPopupSending,
  UnreadAnswersCount,
} from '#src/libs/communication-v2/types';
import type { PaginatedResponse } from '#src/state/types';

import Config from '#src/config';

const API_V1_URI = Config.REACT_APP_BASE_URI_COMMUNICATE_V1;
const API_V1_URI_CORE_DATA = Config.REACT_APP_BASE_URI_CORE_V1;
const API_V1_URI_MEMBER_EXPERIENCE =
  Config.REACT_APP_BASE_URI_MEMBER_EXPERIENCE_V1;

export const sendCommunication = async (data: MessageParams) => {
  const params = {
    ...data,
    isHotfixCompatible: true,
  };
  return postAuthDeprecated(
    `${API_V1_URI}/communication/communication_sent/send_communication/`,
    params,
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
  params: FetchFirstReachedRecipientsParams,
) => {
  return getAuth<MemberListDataByCommunicationKind>(
    `${API_V1_URI_CORE_DATA}/member/selected_members_for_communication_chat_all_kinds/${buildUrlParams(
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

export const retrieveCommunicationSMSProviderVerification = () =>
  getAuth<boolean>(`${API_V1_URI}/communication/provider/sms/0/is_verified/`);

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
    `${API_V1_URI_MEMBER_EXPERIENCE}/mobile_app/smartlist_popup_sending/${buildUrlParams(
      params,
    )}`,
  );

export const sendSmartListPopup = async (
  data: FormData,
): Promise<AxiosResponse<SmartListPopupSending>> =>
  postAuth(
    `${API_V1_URI_MEMBER_EXPERIENCE}/mobile_app/smartlist_popup_sending/send_smartlist_popup/`,
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
    `${API_V1_URI}/communication/communication_scheduled/${id}/`,
  );
};

export const deleteCommunicationScheduled = (id: number) => {
  return deleteAuth<CommunicationScheduled>(
    `${API_V1_URI}/communication/communication_scheduled/${id}/`,
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
  return postAuth<void>(
    `${API_V1_URI}/communication/communication_scheduled/${id}/send_now/`,
  );
};
