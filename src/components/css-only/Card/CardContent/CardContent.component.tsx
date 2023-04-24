// @ts-nocheck
import React from 'react';
import './styles.css';
import classNames from 'classnames';

export type Props = {
  children: React.ReactNode;
  padding?: boolean;
  classes?: { [key: string]: string };
};

export const CardContent: React.FC<Props> = ({
  children,
  padding,
  classes,
}) => {
  return (
    <div
      className={classNames('bs-generic-card__content', {
        'with-padding': padding,
        ...classes,
      })}
    >
      {children}
    </div>
  );
};

export default CardContent;
