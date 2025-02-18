import { useCallback } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import type { RootState } from '#src/reducers/index';
import type { OptionCallback } from '#src/state/types';
import type {
  FetchFirstReachedRecipientsParams,
  CommunicationIdentifiers,
} from '#src/libs/communication-v2/types';

import { PAGINATION_SIZE_RECIPIENTS } from '#src/libs/communication-v2/constants';

import { fetchCommunicationsPaginatedMembers as fetchCommunicationsPaginatedMembersAction } from '#src/libs/member/actions';
import { getPaginatedMembers } from '#src/libs/member/selectors';

import { getFormattedQueryParamsFromContext } from '#src/libs/communication-v2/utils';
import { fetchFirstReachedRecipientsList } from '../actions';
import {
  getFirstReachedRecipientsListByKind,
  getFirstReachedRecipientsListLoading,
} from '../selectors';

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
  const loadingAvailableRecipients = useSelector(
    (state: RootState) => state.member.communication.loading,
  );
  const availableRecipientsTotalCount = useSelector(
    (state: RootState) => state.member.communication.countTotal,
  );
  const availableRecipientsWithEmailCount = useSelector(
    (state: RootState) => state.member.communication.countWithEmail,
  );
  const availableRecipientsWithPhoneCount = useSelector(
    (state: RootState) => state.member.communication.countWithPhone,
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
      return dispatch(
        fetchCommunicationsPaginatedMembersAction({
          ...getFormattedQueryParamsFromContext(
            contextIdentifier,
            contextObjectId,
            memberSelectedCategories,
          ),
          page_size: PAGINATION_SIZE_RECIPIENTS,
          page,
          ignore_ids: true,
        }),
      );
    },
    [dispatch, contextIdentifier, contextObjectId],
  );

  const fetchFirstReachedRecipients = useCallback(
    (params: FetchFirstReachedRecipientsParams) => {
      return dispatch(fetchFirstReachedRecipientsList({ params }));
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
