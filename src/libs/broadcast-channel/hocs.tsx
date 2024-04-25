import React from 'react';

import { useAccessControlBroadcastChannel } from './hooks';

export const withAccessControlBroadcastChannel = <T extends {}>(
  Component: React.ComponentType<T>,
) => {
  return React.memo((props: React.PropsWithChildren<T>) => {
    const sendToAccessControlBroadcastChannel =
      useAccessControlBroadcastChannel();

    return (
      <Component
        {...props}
        sendToAccessControlBroadcastChannel={
          sendToAccessControlBroadcastChannel
        }
      />
    );
  });
};
