import React from 'react';
import classNames from 'classnames';
import GridItem from './GridItem';

import './styles.css';

export type Props = {
  children: React.ReactNode;
  classes?: { [key: string]: string | boolean };
};

export const Grid: React.FC<Props> = ({ children, classes }) => {
  const GridItemComponents = React.Children.toArray(children).filter(
    // @ts-expect-error
    (child) => child?.type?.name === GridItem.name,
  );

  return (
    <div
      className={classNames('bs-generic-card__content__grid ', { ...classes })}
    >
      {GridItemComponents.length !== 0 &&
        GridItemComponents.map((ItemComponent) => ItemComponent)}
    </div>
  );
};

export default Grid;
