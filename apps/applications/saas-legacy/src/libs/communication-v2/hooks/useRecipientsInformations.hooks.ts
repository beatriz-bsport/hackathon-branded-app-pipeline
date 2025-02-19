import { useCallback } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import type {
  Communication,
  Recipient,
} from '#src/libs/communication-v2/types';

import { PAGINATION_SIZE_RECIPIENTS } from '#src/libs/communication-v2/constants';

import { fetchCommunicationRecipientList as fetchCommunicationRecipientListAction } from '#src/libs/communication-v2/actions';
import { fetchMemberBulkById as fetchMemberBulkByIdAction } from '#src/libs/member/actions';

import {
  getRecipientsCount,
  getRecipientsLoading,
  getRecipientWithMemberPaginatedList,
} from '#src/libs/communication-v2/selectors';

import { getFormatedQueryParamsToFetchRecipientPaginatedList } from '#src/libs/communication-v2/utils';

export type FetchRecipientsParams = {
  communication: Communication;
  page: number;
  memberSelectedCategories?: number[];
};

export const useRecipientInformation = (contextMember?: { id: number }) => {
  const dispatch = useDispatch();

  const recipientList = useSelector(getRecipientWithMemberPaginatedList);
  const loadingRecipientList = useSelector(getRecipientsLoading);
  const recipientListCount = useSelector(getRecipientsCount);

  const fetchRecipients = useCallback(
    ({
      communication,
      page,
      memberSelectedCategories,
    }: FetchRecipientsParams) => {
      const memberFilter = contextMember
        ? { member_id__in: [contextMember.id] }
        : getFormatedQueryParamsToFetchRecipientPaginatedList(
            communication,
            memberSelectedCategories,
          );

      const params = {
        ...memberFilter,
        page_size: PAGINATION_SIZE_RECIPIENTS,
        page,
        communication_sent: communication.id,
      };
      dispatch(
        fetchCommunicationRecipientListAction(params, {
          onSuccess: (data: Array<Recipient>) => {
            dispatch(
              fetchMemberBulkByIdAction(
                data.map((recipient) => recipient.member),
              ),
            );
          },
        }),
      );
    },
    [dispatch, contextMember],
  );

  return {
    recipientList,
    loadingRecipientList,
    recipientListCount,
    fetchRecipients,
  };
};
