import React from 'react';
import { useBroadcastChannel } from './hooks';

/**
 * This higher-order component provides the `sendToBroadcastChannel` prop to the
 * wrapped component, using the `useBroadcastChannel` hook (without listener callback).
 *
 * @param Component The component to wrap
 */
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
