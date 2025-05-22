export const DEFAULT_NAME = "UNKNOWN";
export const DEFAULT_MESSAGE = "An error occured";
export const DEFAULT_STATUS_CODE = 400;
export const DEFAULT_CUSTOM_ERROR_CODES: number[] = [];

export const HTTP_STATUSES = {
  [400]: 400,
  [500]: 500,
};

export type HTTPExceptionType = "ClientError" | "ServerError" | "Unknown";

export type Serializable =
  | string
  | number
  | boolean
  | null
  | undefined
  | readonly Serializable[]
  | { readonly [key: string]: Serializable }
  | { toJSON(): Serializable };
