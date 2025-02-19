import { useCallback } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import type { OptionCallback } from '#src/state/types';
import type {
  FetchFirstReachedRecipientsParams,
  CommunicationIdentifiers,
} from '#src/libs/communication-v2/types';

import { PAGINATION_SIZE_RECIPIENTS } from '#src/libs/communication-v2/constants';

import { fetchCommunicationsPaginatedMembers as fetchCommunicationsPaginatedMembersAction } from '#src/libs/member/actions';
import { fetchFirstReachedRecipientsList as fetchFirstReachedRecipientsListAction } from '#src/libs/communication-v2/actions';

import {
  getAvailableRecipientsLoading,
  getAvailableRecipientsTotalCount,
  getAvailableRecipientsWithEmailCount,
  getAvailableRecipientsWithPhoneCount,
  getPaginatedMembers,
} from '#src/libs/member/selectors';
import {
  getFirstReachedRecipientsListByKind,
  getFirstReachedRecipientsListLoading,
} from '#src/libs/communication-v2/selectors';

import { getFormattedQueryParamsFromContext } from '#src/libs/communication-v2/utils';

export type FetchAvailableRecipientsParams = {
  page: number;
  memberSelectedCategories?: number[];
};

export type ResetRecipientsParams = {
  options: OptionCallback;
};

export const useAvailableRecipients = ({
  contextIdentifier,
  contextObjectId,
}: CommunicationIdentifiers) => {
  const dispatch = useDispatch();

  const availableRecipientsList = useSelector(getPaginatedMembers);
  const loadingAvailableRecipients = useSelector(getAvailableRecipientsLoading);
  const availableRecipientsTotalCount = useSelector(
    getAvailableRecipientsTotalCount,
  );
  const availableRecipientsWithEmailCount = useSelector(
    getAvailableRecipientsWithEmailCount,
  );
  const availableRecipientsWithPhoneCount = useSelector(
    getAvailableRecipientsWithPhoneCount,
  );
  const firstReachedRecipientsList = useSelector(
    getFirstReachedRecipientsListByKind,
  );

  const firstReachedRecipientsLoading = useSelector(
    getFirstReachedRecipientsListLoading,
  );

  const fetchAvailableRecipients = useCallback(
    ({
      page,
      memberSelectedCategories = [],
    }: FetchAvailableRecipientsParams) => {
      const formattedQueryParams = getFormattedQueryParamsFromContext(
        contextIdentifier,
        contextObjectId,
        memberSelectedCategories,
      );
      const params = {
        ...formattedQueryParams,
        page_size: PAGINATION_SIZE_RECIPIENTS,
        page,
        ignore_ids: true,
      };

      return dispatch(fetchCommunicationsPaginatedMembersAction(params));
    },
    [dispatch, contextIdentifier, contextObjectId],
  );

  const fetchFirstReachedRecipients = useCallback(
    (params: FetchFirstReachedRecipientsParams) => {
      return dispatch(fetchFirstReachedRecipientsListAction({ params }));
    },
    [dispatch],
  );

  const resetRecipients = useCallback(
    ({ options }: ResetRecipientsParams) => {
      dispatch(
        fetchCommunicationsPaginatedMembersAction({ reset: true }, options),
      );
    },
    [dispatch],
  );

  return {
    availableRecipientsList,
    loadingAvailableRecipients,
    availableRecipientsTotalCount,
    availableRecipientsWithEmailCount,
    availableRecipientsWithPhoneCount,
    firstReachedRecipientsList,
    firstReachedRecipientsLoading,
    fetchAvailableRecipients,
    fetchFirstReachedRecipients,
    resetRecipients,
  };
};
