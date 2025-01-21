import React from 'react';

import clsx from 'clsx';

import '../styles.css';

type Props = { children: React.ReactNode; className: string };

export const ConsumerGenericCardBodyContainer: React.FC<Props> = ({
  children,
  className,
}) => {
  return (
    <div className={clsx('bs-consumer__generic-card__body', className)}>
      {children}
    </div>
  );
};

export default React.memo(ConsumerGenericCardBodyContainer);
