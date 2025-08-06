import { DEFAULT_ALLOWED_PAGE_SIZES, DEFAULT_PAGE } from "#src/constants";

/**
 * Ensures the page number is at least 1.
 *
 * @param page - The requested page number.
 * @returns The valid page number, guaranteed to be 1 or greater.
 */
export const getValidPage = (page: number): number => {
  if (isNaN(page)) {
    return DEFAULT_PAGE;
  }

  return Math.max(Math.ceil(page), DEFAULT_PAGE);
};

/**
 * Returns a valid page size based on the allowed page sizes.
 *
 * If the provided `pageSize` is included in `DEFAULT_ALLOWED_PAGE_SIZES`, it is returned as is.
 * Otherwise, the closest allowed page size is returned.
 *
 * @param pageSize - The requested page size.
 * @returns The valid page size, guaranteed to be one of the allowed values.
 */
export const getValidPageSize = (pageSize: number): number => {
  if (DEFAULT_ALLOWED_PAGE_SIZES.includes(pageSize)) return pageSize;
  return DEFAULT_ALLOWED_PAGE_SIZES.reduce((prev, curr) =>
    Math.abs(curr - pageSize) < Math.abs(prev - pageSize) ? curr : prev,
  );
};
