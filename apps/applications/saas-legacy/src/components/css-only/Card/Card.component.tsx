import React from 'react';
import clsx from 'clsx';

import { CardSize } from './types';

import './styles.css';

export type Props = {
  children: React.ReactNode;
  size?: CardSize;
  classes?: { [key: string]: string | boolean };
  customRef?: React.RefObject<HTMLDivElement>;
  onClick?: () => void;
  isSelected?: boolean;
  id?: string;
};

export const Container: React.FC<Props> = React.memo(
  ({ children, size, classes, customRef, onClick, isSelected, id }) => {
    return (
      <div
        ref={customRef}
        aria-hidden="true"
        className={clsx('bs-generic-card', {
          'bs-generic-card--selected': !!isSelected,
          'size-m': !size,
          [`size-${size}`]: size,
          ...classes,
        })}
        id={id}
        onClick={onClick}
      >
        {children}
      </div>
    );
  },
);

export default React.memo(Container);
