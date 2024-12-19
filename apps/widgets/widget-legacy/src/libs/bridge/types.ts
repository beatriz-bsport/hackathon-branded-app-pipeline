export type QueryClientParams = {
  timeBetweenRefetchs: number,
  maxCallAttempts: number,
  retryOnError: boolean,
};

export type ActionOptions = {
  successCallbackExtractFn?: (data: unknown) => unknown,
};
