import React from 'react';
import Skeleton from '#src/components/css-only/Skeleton';
import './styles.css';

const MinimalCardSkeleton: React.FC = () => (
  <Skeleton className="bs-minimal-card__skeleton" />
);
export default MinimalCardSkeleton;
