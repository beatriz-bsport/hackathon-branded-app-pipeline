import { useEffect, useState } from 'react';

/**
 * Encapsulation for pagination management

 * @param {number} default_page - Number of pixels up to the observable element from the top
 * @param {number}   page_size - Throttle observable listener, in ms
 * @param {function} callback - Execute callback when the page or size change
 * @returns { page, , pageSize, handleSetPage, handleSetPageSize, resetPage }
 */
export default function usePagination(
  default_page: number = 1,
  page_size: number = 5,
  callback?: (page: number, page_size: number) => void,
): {
  page: number;
  pageSize: number;
  handleSetPage: (page: number) => void;
  handleSetPageSize: (page_size: number) => void;
  resetPage: () => void;
} {
  const [page, setPage] = useState(default_page);
  const [pageSize, setPageSize] = useState(page_size);

  const handleSetPage = (_page: number) => {
    setPage(_page);
  };

  const handleSetPageSize = (_pageSize: number) => {
    setPageSize(_pageSize);
  };

  const resetPage = () => {
    setPage(1);
  };

  useEffect(() => {
    callback && callback(page, pageSize);
  }, [callback, page, pageSize]);

  return { page, pageSize, handleSetPage, handleSetPageSize, resetPage };
}
