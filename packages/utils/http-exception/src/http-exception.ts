import type { HTTPExceptionType, Serializable } from "./constants";
import {
  DEFAULT_CUSTOM_ERROR_CODES,
  DEFAULT_MESSAGE,
  DEFAULT_NAME,
  DEFAULT_STATUS_CODE,
  HTTP_STATUSES,
} from "./constants";

function getErrorType(status: number): HTTPExceptionType {
  if (status >= HTTP_STATUSES[400] && status < HTTP_STATUSES[500])
    return "ClientError";

  if (status >= HTTP_STATUSES[500]) return "ServerError";

  return "Unknown";
}

function getErrorName(name?: Serializable): string {
  if (!name) {
    return DEFAULT_NAME;
  }

  if (typeof name === "string") return name;

  return JSON.stringify(name);
}

export class HTTPException<
  CustomErrorCode extends number = number,
> extends Error {
  readonly path: string;
  readonly name: string;
  readonly statusCode: number;
  readonly type: HTTPExceptionType;
  readonly context: Serializable;
  readonly customErrorCodes: CustomErrorCode[];

  constructor({
    path,
    name = DEFAULT_NAME,
    message = DEFAULT_MESSAGE,
    statusCode = DEFAULT_STATUS_CODE,
    context = "",
    customErrorCodes = DEFAULT_CUSTOM_ERROR_CODES as CustomErrorCode[],
    cause,
  }: {
    path: string;
    name?: Serializable;
    message?: string;
    statusCode?: number;
    context?: Serializable;
    cause?: Error;
    customErrorCodes?: CustomErrorCode[];
  }) {
    super(
      `Error calling backend (path: ${path}) because: [${getErrorName(name)}] ${message}`,
      {
        cause,
      },
    );
    this.path = path;
    this.name = getErrorName(name);
    this.statusCode = statusCode;
    this.type = getErrorType(statusCode);
    this.context = context;
    this.customErrorCodes = customErrorCodes;
  }
}
