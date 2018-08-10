import React from 'react';

import { Typography } from '@material-ui/core';
import { getLevelColor } from 'bsport-commons/lib/colors';
import { translate } from 'react-i18next';

const LEVELS = [
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
        color: getLevelColor(levelId),
      }
    : {
        padding: '10px',
        paddingTop: '4px',
        paddingBottom: '4px',
        borderRadius: 5,
        backgroundColor: getLevelColor(levelId),
        color: 'white',
      };

  return (
    <Typography variant={variant} style={stylesheet}>
      {t(LEVELS[levelId - 1])}
    </Typography>
  );
}

export default translate()(Level);
