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
