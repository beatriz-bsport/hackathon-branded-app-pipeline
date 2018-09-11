// @flow
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

type Props = {
  noStyle: boolean,
  levelId: number,
  variant: ?string,
  t: (x: string) => string,
};

export function Level(props: Props) {
  const { noStyle, levelId, t } = props;
  const variant = props.variant || 'body1';

  let stylesheet = {
    padding: '10px',
    paddingTop: '4px',
    paddingBottom: '4px',
    borderRadius: 5,
    backgroundColor: getLevelColorById(levelId),
    color: 'white',
  };
  if (noStyle) {
    stylesheet = {
      color: getLevelColorById(levelId),
    };
  }

  return (
    <Typography variant={variant} style={stylesheet}>
      {t(LEVELS[levelId - 1])}
    </Typography>
  );
}

export default translate()(Level);
