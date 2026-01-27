export enum BridgeEvents {
  API_REQUEST = "API_REQUEST",
  API_SUCCESS = "API_SUCCESS",
  API_ACKNOWLEDGE = "API_ACKNOWLEDGE",
  API_ERROR = "API_ERROR",
  REQUEST_AUTHENTICATED_STATUS = "REQUEST_AUTHENTICATED_STATUS",
  RESPONSE_AUTHENTICATED_STATUS = "RESPONSE_AUTHENTICATED_STATUS",
  REQUEST_LOGOUT = "REQUEST_LOGOUT",
}

export type EventPayload = {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  key?: string;
};

export type APIRequestConfig = {
  url: string;
  method: string;
  data: BodyInit;
  headers: Record<string, string>;
};

export interface FetchError {
  message: string;
  statusCode: number;
}

export interface AxiosResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, unknown>;
  config: Record<string, unknown>;
  request?: unknown;
}

// Copied from Axios Response to keep retro compatibility
export interface ApiError extends Error {
  config: Record<string, unknown>;
  code?: string;
  request?: unknown;
  response?: AxiosResponse;
}
