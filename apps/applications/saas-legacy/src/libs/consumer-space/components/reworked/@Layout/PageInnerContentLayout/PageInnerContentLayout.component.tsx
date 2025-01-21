import React, { memo } from 'react';
import clsx from 'clsx';

import Typography from '#Fabrique/Typography';
import Pagination from '#Fabrique/Pagination';
import useViewport from '#src/components/css-only/Fabrique/hooks/useViewport';
import {
  CONSUMER_SPACE_API_PAGE_SIZE,
  CONSUMER_SPACE_MOBILE_BREAKPOINT,
} from '#src/libs/consumer-space/constants';

import './styles.css';

type Props = {
  classes?: { root?: string; emptyPlaceholder?: string };
  isEmpty: boolean;
  emptyPlaceholder: string;
  VirtualizedListComponent: React.ReactNode;
  DetailComponent: React.ReactNode;
  isLoading: boolean;
  count: number;
  page: number;
  onPageChange: (page: number) => void;
};

type EmptyInnerContentProps = {
  placeholder: string;
  classes?: { emptyPlaceholder?: string };
};

const EmptyInnerContentPlaceholder: React.FC<EmptyInnerContentProps> = ({
  placeholder,
  classes,
}) => {
  return (
    <div
      className={clsx(
        'bs-consumer-page-inner-content__root-layout__empty',
        classes?.emptyPlaceholder,
      )}
    >
      <Typography align="center" variant="body-lg">
        {placeholder}
      </Typography>
    </div>
  );
};

/**
 * @description To make our page layouts consistent, this component is used to wrap all inner page content.
 * All inner contents have the same layout, behaving as a two-column layout on desktop and a single-column layout on mobile.
 * On mobile, the right column content is shown within a modal that can be toggled open.
 * For all devices and container sizes, an empty placeholder can (and must) be shown to indicate to the user
 * that the current inner page content is indeed empty.
 */
export const PageInnerContentLayout: React.FC<Props> = ({
  classes,
  isEmpty,
  emptyPlaceholder,
  VirtualizedListComponent,
  DetailComponent,
  isLoading,
  count,
  page,
  onPageChange,
}) => {
  const { width } = useViewport();
  const computedRef = React.useRef<HTMLDivElement>(null);
  const isMobile = width < CONSUMER_SPACE_MOBILE_BREAKPOINT;

  if (isEmpty) {
    return (
      <EmptyInnerContentPlaceholder
        classes={{ emptyPlaceholder: classes?.emptyPlaceholder }}
        placeholder={emptyPlaceholder}
      />
    );
  }

  return (
    <div
      ref={computedRef}
      className={clsx(
        'bs-consumer-page-inner-content__root-layout',
        classes?.root,
      )}
    >
      <div className="bs-consumer-page-inner-content__root--left-component">
        <ul className="bs-consumer-page-inner-content__root--left-component__list">
          {VirtualizedListComponent}
        </ul>
        <Pagination
          className="bs-consumer-page-inner-content__root--left-component__pagination"
          count={count}
          currentPage={page}
          disabled={isLoading}
          onPageChange={onPageChange}
          pageSize={CONSUMER_SPACE_API_PAGE_SIZE}
        />
      </div>
      <aside
        className={clsx(
          'bs-consumer-page-inner-content__root--right-component',
          {
            'bs-consumer-page-inner-content__root--right-component--hidden':
              isMobile,
          },
        )}
      >
        {DetailComponent}
      </aside>
    </div>
  );
};

export default memo(PageInnerContentLayout);
