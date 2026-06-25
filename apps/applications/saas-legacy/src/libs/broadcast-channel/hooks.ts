import { useCallback, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useDispatch, useSelector } from 'react-redux';

import { getAccessControlBroadcastsChannelId } from '../../http';
import { senderLocalIdActions } from './actions';

import type { BroadcastChannelMessage } from './types';
import type { RootState } from '../../reducers';
import { STORAGE_KEY_BSPORT_ACCM_CHANNEL_ID } from '#src/actions/constants';

/**
 * @hook
 * This hook provides a function to send messages through a BroadcastChannel.
 *
 * @param {function} onMessageCallback - The function that is called when a message is received.
 * @param {Object} options - An object containing the options for the hook.
 * @param {boolean} options.listenSelf - If true, the listener will receive messages sent by the same page.
 *
 * Each message must have a type, defined in {@link BroadcastChannelMessageType}, and a payload. (See {@link BroadcastChannelMessage})
 *
 * The hook also uses a local id to avoid listening to the messages sent by the same page (the sender id is shared in the redux store).
 * On the contrary, the broadcast channel id is shared in the local storage, i.e., between different tabs or windows.
 *
 * @returns {function} A function that can be used to send messages through the BroadcastChannel.
 */
export const useBroadcastChannel = <PayloadType = any>(
  onMessageCallback?: (data: BroadcastChannelMessage<PayloadType>) => void,
  { listenSelf }: { listenSelf?: boolean } = {},
) => {
  /**
   * BroadcastChannel is not available for some older browsers
   * Sentry - https://bsport-cg.sentry.io/issues/5487093653/
   */
  const isBroadcastChannelAvailable = 'BroadcastChannel' in globalThis;

  const dispatch = useDispatch();
  const senderLocalId = useSelector(
    (state: RootState) => state.broadcastChannel.senderLocalId,
  );

  // Create a BroadcastChannel instance
  const channelRef = useRef(
    isBroadcastChannelAvailable
      ? new BroadcastChannel(getAccessControlBroadcastsChannelId())
      : null,
  );
  const channel = channelRef?.current;

  // Update the channel id when the storage event is triggered
  useEffect(() => {
    const updateBroadcastChannelId = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY_BSPORT_ACCM_CHANNEL_ID) {
        channel?.close?.();
        if (isBroadcastChannelAvailable) {
          channelRef.current = new BroadcastChannel(
            getAccessControlBroadcastsChannelId(),
          );
        }
      }
    };
    document.addEventListener('storage', updateBroadcastChannelId);
    return () =>
      document.removeEventListener('storage', updateBroadcastChannelId);
  }, [channel, isBroadcastChannelAvailable]);

  // Add a listener to the channel
  if (channel) {
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
  }

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
      channel?.close?.();
    };
  }, [channel]);

  // Return a function to send messages through the channel
  return useCallback(
    (message: BroadcastChannelMessage<PayloadType>) => {
      if (!senderLocalId) {
        return;
      }
      channel?.postMessage?.({
        ...message,
        senderLocalId,
      });
    },
    [channel, senderLocalId],
  );
};
