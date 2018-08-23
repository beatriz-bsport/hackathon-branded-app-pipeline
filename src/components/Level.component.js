import React from 'react';

import { Typography } from '@material-ui/core';
import { getLevelColorById } from 'bsport-commons/lib/colors';
import { translate } from 'react-i18next';

export const LEVELS = [
  'level.all',
  'level.beginner',
  'level.intermediate',
  'level.advanced',
];

export function Level(props) {
  const { noStyle, levelId, t } = props;
  const variant = props.variant || 'body1';

  const stylesheet = noStyle
    ? {
        color: getLevelColorById(levelId),
      }
    : {
        padding: '10px',
        paddingTop: '4px',
        paddingBottom: '4px',
        borderRadius: 5,
        backgroundColor: getLevelColorById(levelId),
        color: 'white',
      };

  return (
    <Typography variant={variant} style={stylesheet}>
      {t(LEVELS[levelId - 1])}
    </Typography>
  );
}

export default translate()(Level);
