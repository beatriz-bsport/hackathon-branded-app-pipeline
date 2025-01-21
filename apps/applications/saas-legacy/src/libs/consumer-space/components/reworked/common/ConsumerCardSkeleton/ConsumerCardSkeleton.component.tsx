import React from 'react';
import clsx from 'clsx';

import Skeleton from '#src/components/css-only/Skeleton';
import Card from '#Fabrique/Card';

import './styles.css';

type Props = {
  className?: string;
};

const ConsumerCardSkeleton: React.FC<Props> = ({ className }) => (
  <Card className={clsx('bs-consumer-card-skeleton__root', className)}>
    <Skeleton
      className="bs-consumer-card-skeleton__title"
      variant="rectangle"
    />
    <Skeleton
      className="bs-consumer-card-skeleton__subtitle"
      variant="rectangle"
    />

    <Skeleton className="bs-consumer-card-skeleton__body" variant="rectangle" />

    <div className="bs-consumer-card-skeleton__avatar">
      <Skeleton
        className="bs-consumer-card-skeleton__avatar__icon"
        variant="circle"
      />
      <Skeleton
        className="bs-consumer-card-skeleton__avatar__label"
        variant="rectangle"
      />
    </div>
  </Card>
);

export default React.memo(ConsumerCardSkeleton);
