import React, { memo } from 'react';

import classNames from 'classnames';
import Typography from '#Fabrique/Typography';
import './styles.css';

type Props = {
  classes?: { root?: string; emptyPlaceholder?: string };
  isEmpty: boolean;
  emptyPlaceholder: string;
  InfiniteScrollComponent: React.ReactNode;
  DetailComponent: React.ReactNode;
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
      className={classNames(
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
  InfiniteScrollComponent,
  DetailComponent,
}) => {
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
      className={classNames(
        'bs-consumer-page-inner-content__root-layout',
        classes?.root,
      )}
    >
      <ul className="bs-consumer-page-inner-content__root--left-component">
        {InfiniteScrollComponent}
      </ul>

      {DetailComponent}
    </div>
  );
};

export default memo(PageInnerContentLayout);
