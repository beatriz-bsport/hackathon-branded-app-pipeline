import React from 'react';

import Skeleton from '#csscomponents/Skeleton';

import './styles-skeleton.css';

const StatusMessageWithIconSkeleton: React.FC = () => (
  <div className="bs-status-message-with-icon__skeleton__centered-container">
    <Skeleton className="bs-status-message-with-icon__skeleton__icon" />
    <div className="bs-status-message-with-icon__skeleton__centered-container">
      <Skeleton className="bs-status-message-with-icon__skeleton__text bs-status-message-with-icon__skeleton__title" />
      <Skeleton className="bs-status-message-with-icon__skeleton__text bs-status-message-with-icon__skeleton__message" />
    </div>
    <div className="bs-status-message-with-icon__skeleton__actions-container">
      <Skeleton className="bs-status-message-with-icon__skeleton__actions__button" />
      <Skeleton className="bs-status-message-with-icon__skeleton__actions__button" />
    </div>
  </div>
);

export default StatusMessageWithIconSkeleton;
