import React from 'react';
import classNames from 'classnames';

import Skeleton from '#src/components/css-only/Skeleton';
import Card from '#Fabrique/Card';

import './styles.css';

type Props = {
  className?: string;
};

const ConsumerDetailsCardSkeleton: React.FC<Props> = ({ className }) => (
  <Card
    className={classNames('bs-consumer-details-card-skeleton__root', className)}
  >
    <Skeleton
      className="bs-consumer-details-card-skeleton__header-section"
      variant="rectangle"
    />

    <Skeleton
      className="bs-consumer-details-card-skeleton__section__title"
      variant="rectangle"
    />
    <Skeleton
      className="bs-consumer-details-card-skeleton__location-section__list"
      variant="rectangle"
    />
    <Skeleton
      className="bs-consumer-details-card-skeleton__description-section"
      variant="rectangle"
    />

    <Skeleton
      className="bs-consumer-details-card-skeleton__cancelled-section"
      variant="rectangle"
    />

    <div className="bs-consumer-details-card-skeleton__avatar">
      <Skeleton
        className="bs-consumer-details-card-skeleton__avatar__icon"
        variant="circle"
      />
      <Skeleton
        className="bs-consumer-details-card-skeleton__avatar__label"
        variant="rectangle"
      />
    </div>
  </Card>
);

export default React.memo(ConsumerDetailsCardSkeleton);
