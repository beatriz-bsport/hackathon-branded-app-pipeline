import React, { useCallback, useMemo } from 'react';
import clsx from 'clsx';

import IconButton from '#Fabrique/IconButton';
import {
  ChevronLeft,
  ChevronLeftDouble,
  ChevronRight,
  ChevronRightDouble,
} from '#src/components/untitledui';

import './styles.css';

type Props = {
  className?: string;
  classes?: { button?: string };
  /** Disables the previous/next page controls */
  hidePaginationControls?: boolean;
  /** The total count of elements retrieved from the API call */
  count: number;
  /** The page size used in the API calls. Used to compute the available number of pages */
  pageSize: number;
  /** The current page number stored in redux store */
  currentPage: number;
  disabled?: boolean;
  onPageChange: (page: number) => void;
};

export const Pagination: React.FC<Props> = ({
  classes,
  className,
  hidePaginationControls,
  count = 0,
  pageSize = 0,
  currentPage = 1,
  disabled,
  onPageChange,
}) => {
  const pageCount = useMemo(
    () => (!!pageSize && !!count ? Math.ceil(count / pageSize) : 1),
    [count, pageSize],
  );

  const pageLinkList = useMemo(
    () => [...Array(pageCount).keys()].map((page) => page + 1),
    [pageCount],
  );

  /** Limit the display to a maximum of 3 pages + arrow navigation controls */
  const getIsCurrentPageInRange = useCallback(
    (page: number) => page >= currentPage - 1 && page <= currentPage + 1,
    [currentPage],
  );

  const showFirstPageLink = useMemo(
    () =>
      !hidePaginationControls &&
      currentPage !== 1 &&
      !getIsCurrentPageInRange(1),
    [currentPage, getIsCurrentPageInRange, hidePaginationControls],
  );

  const showLastPageLink = useMemo(
    () =>
      !hidePaginationControls &&
      pageLinkList.length > 1 &&
      currentPage !== pageLinkList.length &&
      !getIsCurrentPageInRange(pageLinkList.length),
    [
      currentPage,
      getIsCurrentPageInRange,
      hidePaginationControls,
      pageLinkList.length,
    ],
  );

  const handlePreviousPage = useCallback(() => {
    if (currentPage === 1) return;
    onPageChange(currentPage - 1);
  }, [currentPage, onPageChange]);

  const handleNextPage = useCallback(() => {
    if (pageCount === currentPage) return;
    onPageChange(currentPage + 1);
  }, [currentPage, onPageChange, pageCount]);

  const handlePageChange = useCallback(
    (page) => () => onPageChange(page),
    [onPageChange],
  );

  return (
    <div className={clsx('bs-pagination__root', className)}>
      {showFirstPageLink && (
        <IconButton
          className="bs-pagination__button bs-pagination__button-control bs-pagination__button--default"
          isDisabled={disabled}
          onClick={handlePageChange(1)}
          size="md"
        >
          <ChevronLeftDouble stroke="currentColor" />
        </IconButton>
      )}
      {!hidePaginationControls && currentPage !== 1 && (
        <IconButton
          className="bs-pagination__button bs-pagination__button-control bs-pagination__button--default"
          isDisabled={disabled}
          onClick={handlePreviousPage}
          size="md"
        >
          <ChevronLeft stroke="currentColor" />
        </IconButton>
      )}
      {(pageLinkList ?? []).map((page) => (
        <IconButton
          key={page}
          className={clsx(
            'bs-pagination__button',
            {
              'bs-pagination__button--default': currentPage !== page,
              'bs-pagination__button--selected': currentPage === page,
              'bs-pagination__button--hidden': !getIsCurrentPageInRange(page),
            },
            classes?.button,
          )}
          isDisabled={disabled || currentPage === page}
          onClick={handlePageChange(page)}
          size="md"
        >
          {page}
        </IconButton>
      ))}
      {!hidePaginationControls &&
        pageLinkList.length > 1 &&
        currentPage !== pageLinkList.length && (
          <IconButton
            className="bs-pagination__button bs-pagination__button-control bs-pagination__button--default"
            isDisabled={disabled}
            onClick={handleNextPage}
            size="md"
          >
            <ChevronRight stroke="currentColor" />
          </IconButton>
        )}
      {showLastPageLink && (
        <IconButton
          className="bs-pagination__button bs-pagination__button-control bs-pagination__button--default"
          isDisabled={disabled}
          onClick={handlePageChange(pageLinkList.length)}
          size="md"
        >
          <ChevronRightDouble stroke="currentColor" />
        </IconButton>
      )}
    </div>
  );
};

export default React.memo(Pagination);
