import React, { memo } from 'react';
import classNames from 'classnames';
import { Color } from '#csscomponents/Fabrique/Types';

import './styles.css';

type Props = {
  color?: Color;
};

export const LinearProgress: React.FC<Props> = ({ color }) => {
  return (
    <progress
      className={classNames('bs-linear_progess', {
        'bs-linear_progess--secondary': color === Color.SECONDARY,
      })}
    />
  );
};

export default memo(LinearProgress);
