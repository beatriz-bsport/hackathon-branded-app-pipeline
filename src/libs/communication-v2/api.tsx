import { API_V1_URI, postAuth, getAuth, buildUrlParams } from '../../http';
import {
  MessageParams,
  FetchCommunicationParams,
  FormatedContext,
} from './types';

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
  member_id__in: number[];
}) => {
  return getAuth(
    `${API_V1_URI}/communication/communication_recipient/${buildUrlParams(
      params,
    )}`,
  );
};

export const fetchAvailableRecipientMemberLists = async (
  context: FormatedContext,
) => {
  return getAuth(
    `${API_V1_URI}/member/available_members_lists_for_communication/${buildUrlParams(
      context,
    )}`,
  );
};
