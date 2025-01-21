import React from 'react';
import clsx from 'clsx';

import Skeleton from '#src/components/css-only/Skeleton';

import './styles.css';

type Props = {
  className?: string;
};

const UnsubscribeSkeleton: React.FC<Props> = ({ className }) => (
  <div className={clsx('bs-unsubscribe-skeleton__root', className)}>
    <Skeleton className="bs-unsubscribe-skeleton__logo" variant="rectangle" />
    <div className="bs-unsubscribe-skeleton__text__container">
      <Skeleton className="bs-unsubscribe-skeleton__text" variant="rectangle" />
      <Skeleton className="bs-unsubscribe-skeleton__text" variant="rectangle" />
    </div>
    <Skeleton className="bs-unsubscribe-skeleton__button" variant="rectangle" />
  </div>
);

export default React.memo(UnsubscribeSkeleton);
