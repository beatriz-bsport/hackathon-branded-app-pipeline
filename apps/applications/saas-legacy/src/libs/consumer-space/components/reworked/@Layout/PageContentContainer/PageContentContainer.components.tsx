import React, { memo } from 'react';

import clsx from 'clsx';
import './styles.css';

type Props = {
  contentClassName: string;
  children: React.ReactNode;
};

export const PageContentContainer: React.FC<Props> = ({
  children,
  contentClassName,
}) => {
  return (
    <div className={clsx('bs-consumer-page__root', contentClassName)}>
      {children}
    </div>
  );
};

export default memo(PageContentContainer);
