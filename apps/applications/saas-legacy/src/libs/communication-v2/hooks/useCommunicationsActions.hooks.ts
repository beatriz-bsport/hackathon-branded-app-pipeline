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
  communicationIdentifier,
  communicationObjectId,
}: CommunicationIdentifiers) => {
  const dispatch = useDispatch();

  const sendCommunication = useCallback(
    ({ data, memberSelectedCategories, options }: SendCommunicationParams) => {
      const formattedQueryParams = getFormattedQueryParamsFromContext(
        communicationIdentifier,
        communicationObjectId,
        memberSelectedCategories,
      );

      const dataWithContext = {
        ...data,
        context_identifier: communicationIdentifier,
        context_object_id: communicationObjectId,
        member_filters: { ...formattedQueryParams },
      };
      return dispatch(sendCommunicationAction(dataWithContext, options));
    },
    [dispatch, communicationIdentifier, communicationObjectId],
  );

  const flagAllUnreadCommunicationsAsRead = useCallback(() => {
    const params = {
      context_identifier: communicationIdentifier,
      context_object_id: communicationObjectId,
    };
    dispatch(
      flagAllUnreadCommunicationsAsReadInContextAction(params, {
        onSuccess: () => {
          dispatch(fetchAction(UNREAD_COMMUNICATION.alert_kind, 1));
          dispatch(getUnreadAnswersCountAction(params));
        },
      }),
    );
  }, [dispatch, communicationIdentifier, communicationObjectId]);

  return { sendCommunication, flagAllUnreadCommunicationsAsRead };
};
