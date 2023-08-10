import React from 'react';

import Skeleton, { SkeletonVariant } from '#csscomponents/Skeleton';

import './styles-skeleton.css';

const StatusMessageWithIconSkeleton: React.FC = () => (
  <div className="bs-status-message-with-icon__skeleton__centered-container">
    <Skeleton
      className="bs-status-message-with-icon__skeleton__icon"
      variant={SkeletonVariant.RECTANGLE}
    />
    <div className="bs-status-message-with-icon__skeleton__centered-container">
      <Skeleton
        className="bs-status-message-with-icon__skeleton__text bs-status-message-with-icon__skeleton__title"
        variant={SkeletonVariant.RECTANGLE}
      />
      <Skeleton
        className="bs-status-message-with-icon__skeleton__text bs-status-message-with-icon__skeleton__message"
        variant={SkeletonVariant.RECTANGLE}
      />
    </div>
    <div className="bs-status-message-with-icon__skeleton__actions-container">
      <Skeleton
        className="bs-status-message-with-icon__skeleton__actions__button"
        variant={SkeletonVariant.RECTANGLE}
      />
      <Skeleton
        className="bs-status-message-with-icon__skeleton__actions__button"
        variant={SkeletonVariant.RECTANGLE}
      />
    </div>
  </div>
);

export default StatusMessageWithIconSkeleton;
