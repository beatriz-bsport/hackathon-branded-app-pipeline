import React from 'react';
import classNames from 'classnames';

import Skeleton from '#csscomponents/Skeleton';

import './styles.css';

type Props = {
  className?: string;
};

const UnsubscribeSkeleton: React.FC<Props> = ({ className }) => (
  <div className={classNames('bs-unsubscribe-skeleton__root', className)}>
    <Skeleton className="bs-unsubscribe-skeleton__logo" variant="rectangle" />
    <div className="bs-unsubscribe-skeleton__text__container">
      <Skeleton className="bs-unsubscribe-skeleton__text" variant="rectangle" />
      <Skeleton className="bs-unsubscribe-skeleton__text" variant="rectangle" />
    </div>
    <Skeleton className="bs-unsubscribe-skeleton__button" variant="rectangle" />
  </div>
);

export default React.memo(UnsubscribeSkeleton);
