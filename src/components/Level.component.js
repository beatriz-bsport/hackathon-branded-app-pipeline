import React from 'react';

import { Typography } from '@material-ui/core';
import { getLevelColorById } from 'bsport-commons/lib/colors';
import { translate } from 'react-i18next';

const LEVELS = [
  'level.all',
  'level.beginner',
  'level.intermediate',
  'level.advanced',
];

export function Level(props) {
  const { noStyle, levelId, t } = props;
  const variant = props.variant || 'normal';

  const stylesheet = noStyle
    ? {}
    : {
        padding: '10px',
        paddingVertical: '6px',
        borderRadius: 5,
        backgroundColor: getLevelColorById(levelId),
        color: 'white',
      };

  return (
    <Typography variant={variant} style={stylesheet}>
      {t(LEVELS[levelId])}
    </Typography>
  );
}

export default translate()(Level);
