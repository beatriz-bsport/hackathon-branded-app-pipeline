import React from 'react';
import clsx from 'clsx';

import Skeleton from '#src/components/css-only/Skeleton';

import './styles.css';

type Props = {
  className?: string;
};

const ConfirmMarketingEmailSkeleton: React.FC<Props> = ({ className }) => (
  <div className={clsx('bs-confirm-marketing-email-skeleton__root', className)}>
    <Skeleton
      className="bs-confirm-marketing-email-skeleton__logo"
      variant="rectangle"
    />
    <div className="bs-confirm-marketing-email-skeleton__text__container">
      <Skeleton
        className="bs-confirm-marketing-email-skeleton__text"
        variant="rectangle"
      />
      <Skeleton
        className="bs-confirm-marketing-email-skeleton__text"
        variant="rectangle"
      />
    </div>
  </div>
);

export default React.memo(ConfirmMarketingEmailSkeleton);
