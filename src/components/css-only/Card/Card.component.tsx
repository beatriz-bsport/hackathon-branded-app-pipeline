// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import './styles.css';

import { CardSize } from './types';

export type Props = {
  children: React.ReactNode;
  size?: CardSize;
  classes?: { [key: string]: string };
  onClick?: () => void;
};

export const Container: React.FC<Props> = ({
  children,
  size,
  classes,
  onClick,
}) => {
  return (
    <div
      className={classNames('bs-generic-card', {
        'size-m': !size,
        [`size-${size}`]: size,
        ...classes,
      })}
      onClick={onClick}
      aria-hidden="true"
    >
      {children}
    </div>
  );
};
export default Container;
