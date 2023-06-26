import React from 'react';
import classNames from 'classnames';
import './styles.css';

import { CardSize } from './types';

export type Props = {
  children: React.ReactNode;
  size?: CardSize;
  classes?: { [key: string]: string | boolean };
  customRef?: React.RefObject<HTMLDivElement>;
  onClick?: () => void;
  isSelected?: boolean;
};

export const Container: React.FC<Props> = React.memo(
  ({ children, size, classes, customRef, onClick, isSelected }) => {
    return (
      <div
        className={classNames('bs-generic-card', {
          'bs-generic-card--selected': !!isSelected,
          'size-m': !size,
          [`size-${size}`]: size,
          ...classes,
        })}
        onClick={onClick}
        aria-hidden="true"
        ref={customRef}
      >
        {children}
      </div>
    );
  },
);

export default React.memo(Container);
