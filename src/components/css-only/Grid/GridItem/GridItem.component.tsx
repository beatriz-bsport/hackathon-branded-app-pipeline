// @ts-nocheck
import React from 'react';
import './styles.css';
import classNames from 'classnames';

import { Alignment, Direction, Justification } from './types';

export type Props = {
  rowStart?: number;
  rowEnd?: number;
  columnStart?: number;
  columnEnd?: number;
  alignment?: Alignment;
  direction?: Direction;
  justification?: Justification;
  classes?: { [key: string]: string };
};

export const Item: React.FC<Props> = ({
  children,
  rowStart,
  rowEnd,
  columnStart,
  columnEnd,
  alignment,
  direction,
  justification,
  classes,
}) => {
  return (
    <div
      className={classNames('bs-generic-card__content__grid__item', {
        'bs-grid-item-row-start-1': !rowStart,
        'bs-grid-item-justification-center': !justification,
        'bs-grid-item-direction-column': !direction,
        [`bs-grid-item-row-start-${rowStart}`]: rowStart,
        [`bs-grid-item-row-end-${rowEnd}`]: rowEnd,
        [`bs-grid-item-column-start-${columnStart}`]: columnStart,
        [`bs-grid-item-column-end-${columnEnd}`]: columnEnd,
        [`bs-grid-item-alignment-${alignment}`]: alignment,
        [`bs-grid-item-direction-${direction}`]: direction,
        [`bs-grid-item-justification-${justification}`]: justification,
        ...classes,
      })}
    >
      {children}
    </div>
  );
};

export default Item;
