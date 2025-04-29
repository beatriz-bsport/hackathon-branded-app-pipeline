export type PaginatedState<M> = {
  byId: { [key: number]: M };
  count: number;
  ids: number[];
  page: number;
};
