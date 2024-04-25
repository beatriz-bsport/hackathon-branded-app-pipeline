import { useCallback, useEffect, useRef } from 'react';

import { getAccessControlBroadcastsChannelId } from '../../http';

export const useAccessControlBroadcastChannel = (
  onMessageCallback?: (data: any) => void,
) => {
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
  channel.onmessage = (event) => {
    onMessageCallback?.(event.data);
  };

  useEffect(() => {
    // Close the channel when the component unmounts
    return () => {
      channel.close();
    };
  }, [channel]);

  // Return a function to send messages through the channel
  return useCallback(
    (message) => {
      channel.postMessage(message);
    },
    [channel],
  );
};
