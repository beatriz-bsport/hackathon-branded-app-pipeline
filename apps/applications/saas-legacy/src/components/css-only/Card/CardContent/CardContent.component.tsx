import React from 'react';
import clsx from 'clsx';

import './styles.css';

export type Props = {
  children: React.ReactNode;
  padding?: boolean;
  classes?: { [key: string]: string | boolean };
};

export const CardContent: React.FC<Props> = ({
  children,
  padding,
  classes,
}) => {
  return (
    <div
      className={clsx('bs-generic-card__content', {
        'with-padding': padding,
        ...classes,
      })}
    >
      {children}
    </div>
  );
};

export default CardContent;
