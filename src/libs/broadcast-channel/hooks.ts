import { useCallback, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useDispatch, useSelector } from 'react-redux';

import { getAccessControlBroadcastsChannelId } from '../../http';
import { senderLocalIdActions } from './actions';

import type { BroadcastChannelMessage } from './types';
import type { RootState } from '../../reducers';

export const useBroadcastChannel = <PayloadType = any>(
  onMessageCallback?: (data: BroadcastChannelMessage<PayloadType>) => void,
  { listenSelf }: { listenSelf?: boolean } = {},
) => {
  const dispatch = useDispatch();
  const senderLocalId = useSelector(
    (state: RootState) => state.broadcastChannel.senderLocalId,
  );

  // Create a BroadcastChannel instance
  const channelRef = useRef(
    new BroadcastChannel(getAccessControlBroadcastsChannelId()),
  );
  const channel = channelRef.current;

  // Update the channel id when the storage event is triggered
  useEffect(() => {
    const updateBroadcastChannelId = (event: StorageEvent) => {
      if (event.key === 'bsport:accm-channel:id') {
        channel.close();
        channelRef.current = new BroadcastChannel(
          getAccessControlBroadcastsChannelId(),
        );
      }
    };
    document.addEventListener('storage', updateBroadcastChannelId);
    return () =>
      document.removeEventListener('storage', updateBroadcastChannelId);
  }, [channel]);

  // Add a listener to the channel
  channel.onmessage = (
    event: MessageEvent<
      BroadcastChannelMessage<PayloadType> & {
        senderLocalId: string;
      }
    >,
  ) => {
    if (!listenSelf && event.data.senderLocalId === senderLocalId) {
      return;
    }
    onMessageCallback?.(event.data);
  };

  useEffect(() => {
    if (!senderLocalId) {
      // Initialize the sender local id
      const uniqueId = uuidv4();
      dispatch(senderLocalIdActions.init(uniqueId));
    }
  }, [dispatch, senderLocalId]);

  useEffect(() => {
    // Close the channel when the component unmounts
    return () => {
      channel.close();
    };
  }, [channel]);

  // Return a function to send messages through the channel
  return useCallback(
    (message: BroadcastChannelMessage<PayloadType>) => {
      if (!senderLocalId) {
        return;
      }
      channel.postMessage({
        ...message,
        senderLocalId,
      });
    },
    [channel, senderLocalId],
  );
};
