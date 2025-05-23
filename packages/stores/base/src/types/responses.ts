export type PaginatedResponse<T = unknown> = {
  count: number;
  links: { next: number | null; previous: number | null };
  next_page: number | null;
  page: number;
  results: Array<T>;
};

export type SearchResponse<T = unknown> = {
  results: Array<T>;
  count: number;
  next: string | null;
  previous: string | null;
};
