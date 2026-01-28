import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { AxiosLockOptions } from './types';
import { sendBridgeMessage } from '#src/libs/widget/bridge';
import { WidgetMessageType } from '#src/libs/widget/types';
import { nanoid } from 'nanoid';

const TIMEOUT_BRIDGE = 30000;
const RETRY_BRIDGE_INTERVAL = 200;

const DEBUG = false;

const debugLog = (message: string, ...args: unknown[]) =>
  // eslint-disable-next-line no-console
  DEBUG && console.debug(`[BRIDGE CLIENT] ${message}`, ...args);

const sendRequestToBridge = (data: any, key: string) => {
  debugLog('Sending message to proxy bridge', data);
  sendBridgeMessage({ type: WidgetMessageType.API_REQUEST, key, data });
};

type RequestListenerProps = {
  requestId: string;
  onRequestResolved: (data: any, isError: boolean) => void;
  onRequestAcknowledged: () => void;
};

const createRequestListener =
  ({
    requestId,
    onRequestResolved,
    onRequestAcknowledged,
  }: RequestListenerProps) =>
  (event: MessageEvent) => {
    if (
      WidgetMessageType.API_ACKNOWLEDGE === event.data.type &&
      event.data.key === requestId
    ) {
      onRequestAcknowledged();
    }

    if (
      [WidgetMessageType.API_SUCCESS, WidgetMessageType.API_ERROR].includes(
        event.data.type,
      ) &&
      event.data.key === requestId
    ) {
      debugLog('Received API message', event.data);
      onRequestResolved(
        event.data.data,
        event.data.type === WidgetMessageType.API_ERROR,
      );
    }
  };

type RetryIntervalProps = {
  isAcked: () => boolean;
  sendRequest: () => void;
  stopRetry: () => void;
};

const createRetryInterval = ({
  isAcked,
  sendRequest,
  stopRetry,
}: RetryIntervalProps) =>
  setInterval(() => {
    if (isAcked()) {
      stopRetry();
      return;
    }
    sendRequest();
  }, RETRY_BRIDGE_INTERVAL);

export const sendWithProxyBridge = async <T = unknown>(
  config: AxiosRequestConfig & { lockOptions?: AxiosLockOptions },
): Promise<AxiosResponse<T>> => {
  return new Promise((resolve, reject) => {
    let clearListeners: () => void = () => {};
    let stopRetry: () => void = () => {};
    let isRequestReceivedByBridge = false;

    const requestId = nanoid();
    const sendRequest = () => sendRequestToBridge({ config }, requestId);

    sendRequest();

    const retryIntervalId = createRetryInterval({
      isAcked: () => isRequestReceivedByBridge,
      sendRequest,
      stopRetry,
    });

    stopRetry = () => clearInterval(retryIntervalId);

    const listener = createRequestListener({
      requestId,
      onRequestResolved: (data, isError) => {
        const resolver = isError ? reject : resolve;
        resolver(data);
        clearListeners();
      },
      onRequestAcknowledged: () => {
        isRequestReceivedByBridge = true;
      },
    });

    const timeoutId = setTimeout(() => {
      reject(new Error(`API call timeout for request ${requestId}`));
      clearListeners();
    }, TIMEOUT_BRIDGE);

    clearListeners = () => {
      window.removeEventListener('message', listener);
      clearTimeout(timeoutId);
      clearInterval(retryIntervalId);
    };

    window.addEventListener('message', listener);
  });
};
