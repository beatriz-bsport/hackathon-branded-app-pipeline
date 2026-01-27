import { HTTPException, getFetch } from "@bsport/fetch";

import {
  APIRequestConfig,
  ApiError,
  BridgeEvents,
  EventPayload,
} from "../types";
import { debugLog, listenOnMessage, postMessageToParent } from "../utils";

const fetch = getFetch();

const makeUrlRelative = (url: string) => {
  const parsedUrl = new URL(url);
  let sanitizedPathname = parsedUrl.pathname;

  if (sanitizedPathname.startsWith("/")) {
    sanitizedPathname = sanitizedPathname.slice(1);
  }
  if (!sanitizedPathname.endsWith("/")) {
    sanitizedPathname = sanitizedPathname + "/";
  }
  return sanitizedPathname + parsedUrl.search;
};

const isFetchError = (error: unknown): error is HTTPException => {
  return error instanceof HTTPException;
};

const sendAPIRequest = async (config: APIRequestConfig) => {
  if (!config.url) {
    throw new Error("URL is required");
  }

  const response = await fetch(makeUrlRelative(config.url), {
    method: config.method,
    body: JSON.stringify(config.data),
    headers: config.headers,
  });
  return {
    data: response.data,
    status: response.status,
    statusText: response.status.toString(),
  };
};

const ongoingRequestIds = new Set<string>();

export const handleAPIMessages = () => {
  const listener = async (payload: EventPayload) => {
    if (payload.type === BridgeEvents.API_REQUEST) {
      const requestId = payload.key;
      if (!requestId) {
        debugLog("Request ID is required");
        return;
      }
      postMessageToParent({
        type: BridgeEvents.API_ACKNOWLEDGE,
        key: requestId,
      });
      if (ongoingRequestIds.has(requestId)) {
        debugLog("Request already in progress", requestId);
        return;
      }
      ongoingRequestIds.add(requestId);
      try {
        const response = await sendAPIRequest(payload.data.config);
        postMessageToParent({
          type: BridgeEvents.API_SUCCESS,
          data: response,
          key: requestId,
        });
      } catch (e) {
        const fetchError: ApiError | null = isFetchError(e)
          ? {
              message: e.message,
              config: {},
              name: e.name,
              response: {
                status: e.statusCode,
                data: e.message,
                headers: {},
                statusText: e.statusCode.toString(),
                config: {},
              },
            }
          : null;

        postMessageToParent({
          type: BridgeEvents.API_ERROR,
          data: fetchError ?? e,
          key: requestId,
        });
      }
    }
  };
  return listenOnMessage(listener);
};
