// @flow
import React from 'react';

import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { getLevelColorById as getLevelColorByIdDefault } from '@bsport/common/lib/colors';

import { withNamespaces } from 'react-i18next';

const getLevelColorById = (id: number, theme) => {
  if (!theme) return getLevelColorByIdDefault(id);
  switch (id) {
    case 1:
      return theme.palette.primary.light;
    case 2:
      return theme.palette.primary.light;
    case 3:
      return theme.palette.primary;
    case 4:
      return theme.palette.primary.dark;
    default:
      return theme.palette.primary.main;
  }
};

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
  t: TFunction,
  theme: ?any,
  align: ?string,
};

export function Level(props: Props) {
  const { noStyle, levelId, t } = props;
  const variant = props.variant || 'body2';

  let stylesheet = {
    padding: '10px',
    paddingTop: '4px',
    paddingBottom: '4px',
    borderRadius: 5,
    backgroundColor: getLevelColorById(levelId, props.theme),
    color: 'white',
  };
  if (noStyle) {
    stylesheet = {
      color: getLevelColorById(levelId, props.theme),
    };
  }

  return (
    <Typography
      align={props.align || 'left'}
      variant={variant}
      style={stylesheet}
    >
      {t(LEVELS[levelId - 1])}
    </Typography>
  );
}

export default withNamespaces()(
  withStyles(() => {}, { withTheme: true })(Level),
  // Level,
);
