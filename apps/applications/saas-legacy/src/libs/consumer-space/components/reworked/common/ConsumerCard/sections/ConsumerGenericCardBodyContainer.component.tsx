import React from 'react';

import classNames from 'classnames';

import '../styles.css';

type Props = { children: React.ReactNode; className: string };

export const ConsumerGenericCardBodyContainer: React.FC<Props> = ({
  children,
  className,
}) => {
  return (
    <div className={classNames('bs-consumer__generic-card__body', className)}>
      {children}
    </div>
  );
};

export default React.memo(ConsumerGenericCardBodyContainer);
