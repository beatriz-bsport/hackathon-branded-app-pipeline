import React, { memo } from 'react';
import clsx from 'clsx';
import { Color } from '#src/components/css-only/Fabrique/Types';

import './styles.css';

type Props = {
  color?: Color;
};

export const LinearProgress: React.FC<Props> = ({ color }) => {
  return (
    <progress
      className={clsx('bs-linear_progess', {
        'bs-linear_progess--secondary': color === Color.SECONDARY,
      })}
    />
  );
};

export default memo(LinearProgress);
