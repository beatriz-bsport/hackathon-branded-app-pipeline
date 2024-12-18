import React, { memo } from 'react';

import classNames from 'classnames';
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
    <div className={classNames('bs-consumer-page__root', contentClassName)}>
      {children}
    </div>
  );
};

export default memo(PageContentContainer);
