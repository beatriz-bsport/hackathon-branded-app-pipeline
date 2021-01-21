export type ErrorAndLoading = {
  loading: boolean;
  error?: Error;
};

export type WithPagination = {
  count: number;
  page: number;
};
