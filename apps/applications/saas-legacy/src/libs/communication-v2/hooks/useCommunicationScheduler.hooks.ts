import { useCallback } from 'react';

import { useDispatch } from 'react-redux';

import type {
  CommunicationScheduled,
  CommunicationScheduledCreate,
} from '#src/libs/communication-v2/types';
import type { OptionCallback } from '#src/state/types';

import {
  createCommunicationScheduled as createCommunicationScheduledAction,
  fetchCommunicationScheduledListForSmartlist as fetchCommunicationScheduledListForSmartlistAction,
  sendNowCommunicationScheduled as sendNowCommunicationScheduledAction,
  updateCommunicationScheduled as updateCommunicationScheduledAction,
} from '#src/libs/communication-v2/actions';

export type CreateScheduledCommunicationParams = {
  data: Omit<CommunicationScheduledCreate, 'smartlist'>;
  options?: OptionCallback<CommunicationScheduled>;
};

export type EditScheduledCommunicationParams = {
  data: CommunicationScheduled;
  options?: OptionCallback<CommunicationScheduled>;
};

export type ScheduledCommunicationCommandParams = {
  scheduledCommunicationId: number;
  options?: OptionCallback<CommunicationScheduled>;
};

type CommunicationSchedulerHook = {
  communicationObjectId: number;
};

export const useCommunicationSchedulers = ({
  communicationObjectId,
}: CommunicationSchedulerHook) => {
  const dispatch = useDispatch();

  const scheduleCommunication = useCallback(
    ({ data, options }: CreateScheduledCommunicationParams) => {
      dispatch(
        createCommunicationScheduledAction(
          {
            ...data,
            smartlist: communicationObjectId,
          },
          {
            onSuccess: () => {
              dispatch(
                fetchCommunicationScheduledListForSmartlistAction({
                  smartlistId: communicationObjectId,
                }),
              );
              options?.onSuccess?.();
            },
          },
        ),
      );
    },
    [communicationObjectId, dispatch],
  );

  const editScheduledCommunication = useCallback(
    ({ data, options }: EditScheduledCommunicationParams) => {
      dispatch(
        updateCommunicationScheduledAction(data.id, data, {
          ...options,
          onSuccess: () => {
            dispatch(
              fetchCommunicationScheduledListForSmartlistAction({
                smartlistId: communicationObjectId,
              }),
            );
            options?.onSuccess?.();
          },
        }),
      );
    },
    [communicationObjectId, dispatch],
  );

  const sendScheduledCommunicationNow = useCallback(
    ({
      scheduledCommunicationId,
      options,
    }: ScheduledCommunicationCommandParams) => {
      dispatch(
        sendNowCommunicationScheduledAction(scheduledCommunicationId, {
          onSuccess: () => {
            dispatch(
              fetchCommunicationScheduledListForSmartlistAction({
                smartlistId: communicationObjectId,
              }),
            );
            options?.onSuccess?.();
          },
        }),
      );
    },
    [communicationObjectId, dispatch],
  );

  return {
    scheduleCommunication,
    editScheduledCommunication,
    sendScheduledCommunicationNow,
  };
};
