import React from 'react';
import clsx from 'clsx';

import Skeleton from '#src/components/css-only/Skeleton';

import './styles.css';

type Props = {
  className?: string;
};

const ConsumerHeaderSkeleton: React.FC<Props> = ({ className }) => {
  return (
    <div className={clsx('bs-consumer-header-skeleton__root', className)}>
      <Skeleton className="bs-consumer-header-skeleton__title" />
      <div className="bs-consumer-header-skeleton__tabs">
        <Skeleton className="bs-consumer-header-skeleton__tabs__tab" />
        <Skeleton className="bs-consumer-header-skeleton__tabs__tab" />
        <Skeleton className="bs-consumer-header-skeleton__tabs__tab" />
        <Skeleton className="bs-consumer-header-skeleton__tabs__tab" />
      </div>
      <div className="bs-consumer-header-skeleton__filter-tabs">
        <Skeleton className="bs-consumer-header-skeleton__filter-tabs__tab" />
        <Skeleton className="bs-consumer-header-skeleton__filter-tabs__tab" />
      </div>
    </div>
  );
};

export default React.memo(ConsumerHeaderSkeleton);
