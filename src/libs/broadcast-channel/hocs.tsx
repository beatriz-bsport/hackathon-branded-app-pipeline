import React from 'react';
import { useBroadcastChannel } from './hooks';

export const withSendToBroadcastChannel = <T extends {}, PayloadType = any>(
  Component: React.ComponentType<T>,
) => {
  return React.memo((props: React.PropsWithChildren<T>) => {
    const sendToBroadcastChannel = useBroadcastChannel<PayloadType>();

    return (
      <Component {...props} sendToBroadcastChannel={sendToBroadcastChannel} />
    );
  });
};
