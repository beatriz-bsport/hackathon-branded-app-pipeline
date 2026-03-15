/**
 * Helper type for common properties that search results might have.
 * This provides a baseline structure for the default formatter in BackendSelector.
 */
export type SearchResultItem = {
  id: number | string;
  title?: string;
  name?: string;
  subject?: string;
  description?: string;
};
