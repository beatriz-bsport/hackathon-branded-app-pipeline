import React from 'react';

import { useBroadcastChannel } from './hooks';

export const withSendToBroadcastChannel = <T extends {}>(
  Component: React.ComponentType<T>,
) => {
  return React.memo((props: React.PropsWithChildren<T>) => {
    const sendToBroadcastChannel = useBroadcastChannel();

    return (
      <Component {...props} sendToBroadcastChannel={sendToBroadcastChannel} />
    );
  });
};
