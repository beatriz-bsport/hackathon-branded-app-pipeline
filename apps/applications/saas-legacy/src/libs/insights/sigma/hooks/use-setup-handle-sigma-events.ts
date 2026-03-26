import { useEffect, useRef } from 'react';

import { captureException } from '@sentry/react';

import {
  buildSigmaError,
  isSigmaEventWorkbookChartError,
  isSigmaEventWorkbookError,
} from '../utils';

export const useSetupHandleSigmaEvents = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only process messages from this iframe
      if (
        !iframeRef.current ||
        event.source !== iframeRef.current.contentWindow ||
        !event.data ||
        typeof event.data !== 'object'
      ) {
        return;
      }

      const eventData = event.data;

      if (isSigmaEventWorkbookChartError(eventData)) {
        captureException(buildSigmaError(eventData));
      }

      if (isSigmaEventWorkbookError(eventData)) {
        captureException(buildSigmaError(eventData));
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return iframeRef;
};
