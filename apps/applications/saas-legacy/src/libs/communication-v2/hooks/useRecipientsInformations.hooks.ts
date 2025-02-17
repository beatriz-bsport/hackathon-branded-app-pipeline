import { useCallback } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import type { RootState } from '#src/reducers/index';
import type {
  Communication,
  Recipient,
} from '#src/libs/communication-v2/types';

import { PAGINATION_SIZE_RECIPIENTS } from '#src/libs/communication-v2/constants';

import { fetchCommunicationRecipientList as fetchCommunicationRecipientListAction } from '#src/libs/communication-v2/actions';
import { fetchMemberBulkById as fetchMemberBulkByIdAction } from '#src/libs/member/actions';

import { getRecipientWithMemberPaginatedList } from '#src/libs/communication-v2/selectors';

import { getFormatedQueryParamsToFetchRecipientPaginatedList } from '#src/libs/communication-v2/utils';

type FetchRecipientsParams = {
  communication: Communication;
  page: number;
  memberSelectedCategories?: number[];
};

export const useRecipientInformation = (contextMember?: { id: number }) => {
  const dispatch = useDispatch();

  const recipientList = useSelector(getRecipientWithMemberPaginatedList);
  const loadingRecipientList = useSelector(
    (state: RootState) => state.communicationV2.recipient.loading,
  );
  const recipientListCount = useSelector(
    (state: RootState) => state.communicationV2.recipient.count,
  );

  const fetchRecipients = useCallback(
    ({
      communication,
      page,
      memberSelectedCategories,
    }: FetchRecipientsParams) => {
      const params = {
        ...(contextMember
          ? { member_id__in: [contextMember.id] }
          : getFormatedQueryParamsToFetchRecipientPaginatedList(
              communication,
              memberSelectedCategories,
            )),
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
