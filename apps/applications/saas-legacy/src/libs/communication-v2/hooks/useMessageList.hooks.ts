import { useCallback } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import uniq from 'lodash/uniq';

import type {
  Communication,
  CommunicationIdentifiers,
  FetchCommunicationParams,
} from '#src/libs/communication-v2/types';

import {
  MAX_DISPLAY,
  REFRESH_THREAD_PAGINATION_SIZE,
} from '#src/libs/communication-v2/constants';

import { fetchCommunicationSentList as fetchCommunicationSentListAction } from '#src/libs/communication-v2/actions';
import { fetchMemberBulkById as fetchMemberBulkByIdAction } from '#src/libs/member/actions';

import {
  getCommunicationMessageList,
  getCommunicationMessageListHasNextPage,
  getCommunicationMessageListLoading,
} from '#src/libs/communication-v2/selectors';

import { getFormatedFiltersToFetchCommunicationSent } from '#src/libs/communication-v2/utils';

export type FetchMessageListParams = {
  filters: number[];
  dateStart: number | null;
  dateEnd: number | null;
  page: number;
  isRefreshing?: boolean;
} & CommunicationIdentifiers;

export const useMessageList = () => {
  const dispatch = useDispatch();

  const messageList = useSelector(getCommunicationMessageList);
  const loadingMessageList = useSelector(getCommunicationMessageListLoading);
  const hasNextMessageListPage = useSelector(
    getCommunicationMessageListHasNextPage,
  );

  const fetchMessages = useCallback(
    ({
      communicationIdentifier,
      communicationObjectId,
      filters,
      dateStart,
      dateEnd,
      page,
      isRefreshing,
    }: FetchMessageListParams) => {
      const params: FetchCommunicationParams = {
        page,
        ...getFormatedFiltersToFetchCommunicationSent(
          filters,
          dateStart,
          dateEnd,
        ),
        context_identifier: communicationIdentifier,
        context_object_id: communicationObjectId,
        ...(isRefreshing && { page_size: REFRESH_THREAD_PAGINATION_SIZE }),
      };

      return dispatch(
        fetchCommunicationSentListAction(params, !!isRefreshing, {
          onSuccess: (responseData?: Communication[]) => {
            if (responseData) {
              const memberIds = uniq(
                responseData.flatMap(
                  (sent: Communication) =>
                    sent.recipient_member_id_list
                      ?.slice(
                        0,
                        Math.min(
                          MAX_DISPLAY,
                          sent.recipient_member_id_list.length,
                        ),
                      )
                      .filter((id: number) => !!id) || [],
                ),
              );
              dispatch(fetchMemberBulkByIdAction(memberIds));
            }
          },
        }),
      );
    },
    [dispatch],
  );

  return {
    messageList,
    loadingMessageList,
    hasNextMessageListPage,
    fetchMessages,
  };
};
