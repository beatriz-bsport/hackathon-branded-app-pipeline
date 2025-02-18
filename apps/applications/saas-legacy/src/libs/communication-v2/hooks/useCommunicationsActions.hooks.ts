import { useCallback } from 'react';

import { useDispatch } from 'react-redux';

import { UNREAD_COMMUNICATION } from '@bsport/common/lib/master-data/alerting_kind.js';

import type {
  CommunicationIdentifiers,
  Communication,
  MessageData,
} from '#src/libs/communication-v2/types';
import type { OptionCallback } from '#src/state/types';

import {
  flagAllUnreadCommunicationsAsReadInContext as flagAllUnreadCommunicationsAsReadInContextAction,
  getUnreadAnswersCount as getUnreadAnswersCountAction,
  sendCommunication as sendCommunicationAction,
} from '#src/libs/communication-v2/actions';
import { fetch as fetchAction } from '#src/libs/alerting/actions';

import { getFormattedQueryParamsFromContext } from '#src/libs/communication-v2/utils';

export type SendCommunicationParams = {
  data: MessageData;
  memberSelectedCategories: number[];
  options: OptionCallback<void> & {
    storeInCallback: (communication: Communication) => boolean;
  };
};

export const useCommunicationActions = ({
  contextIdentifier,
  contextObjectId,
}: CommunicationIdentifiers) => {
  const dispatch = useDispatch();

  const sendCommunication = useCallback(
    ({ data, memberSelectedCategories, options }: SendCommunicationParams) => {
      const formattedQueryParams = getFormattedQueryParamsFromContext(
        contextIdentifier,
        contextObjectId,
        memberSelectedCategories,
      );

      const dataWithContext = {
        ...data,
        context_identifier: contextIdentifier,
        context_object_id: contextObjectId,
        member_filters: { ...formattedQueryParams },
      };
      return dispatch(sendCommunicationAction(dataWithContext, options));
    },
    [dispatch, contextIdentifier, contextObjectId],
  );

  const flagAllUnreadCommunicationsAsRead = useCallback(() => {
    const params = {
      context_identifier: contextIdentifier,
      context_object_id: contextObjectId,
    };
    dispatch(
      flagAllUnreadCommunicationsAsReadInContextAction(params, {
        onSuccess: () => {
          dispatch(fetchAction(UNREAD_COMMUNICATION.alert_kind, 1));
          dispatch(getUnreadAnswersCountAction(params));
        },
      }),
    );
  }, [dispatch, contextIdentifier, contextObjectId]);

  return { sendCommunication, flagAllUnreadCommunicationsAsRead };
};
