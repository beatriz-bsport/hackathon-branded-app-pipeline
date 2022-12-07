import React from 'react';
import { useTranslation } from 'react-i18next';
import { pure } from 'recompose';
import classNames from 'classnames';
import chroma from 'chroma-js';

import Typography from '@material-ui/core/Typography';
import { IconButton, makeStyles, Theme } from '@material-ui/core';
import { Variant } from '@material-ui/core/styles/createTypography';
import CloseIcon from '@material-ui/icons/Close';

import { getTextColorFromRGB } from '../../../utils/color';
import { getLevelColor, getLevelTrad } from '../utils';

export type Props = {
  customLevel: { id: number; color: string; name: string };
  noStyle?: boolean;
  isChip?: boolean;
  showVoid?: boolean;
  className?: string;
  variant?: Variant;
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
  onRemove?: (() => void) | null;
  smallFont?: boolean;
};

export const LevelComponent: React.FC<Props> = ({
  customLevel,
  className,
  noStyle = false,
  variant = 'body1',
  align = 'center',
  isChip = false,
  showVoid = false,
  onRemove = null,
  smallFont = false,
}) => {
  const { t } = useTranslation();
  const classes = useStyles(customLevel?.id, customLevel?.color)();

  if (!customLevel || (customLevel.id === 5 && !showVoid)) return null;

  return (
    // TODO: Typo should be wrapped in a container, to center vertically
    <Typography
      align={align}
      variant={variant}
      noWrap
      className={classNames(
        {
          [classes.level]: !noStyle,
          [classes.noStyle]: noStyle,
          [classes.chip]: isChip,
          [classes.removableChip]: isChip && onRemove,
          [classes.smallFont]: smallFont,
        },
        className,
      )}
    >
      {getLevelTrad(customLevel.id, customLevel.name, t)}
      {onRemove && (
        <IconButton size="small" onClick={onRemove}>
          <CloseIcon className={classes.icon} />
        </IconButton>
      )}
    </Typography>
  );
};

const useStyles = (id: number, color: string) =>
  makeStyles((theme: Theme) => {
    const levelColor = getLevelColor(id, color, theme);

    return {
      level: {
        padding: theme.spacing(2),
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        borderRadius: 5,
        backgroundColor: levelColor ?? '#fff',
        color: getTextColorFromRGB(chroma(levelColor ?? '#fff').rgb()),
      },
      noStyle: {
        color: levelColor ?? '#fff',
      },
      chip: {
        padding: theme.spacing(2),
        paddingTop: 0,
        paddingBottom: 0,
        borderRadius: 12,
        height: 24,
      },
      removableChip: {
        paddingRight: 0,
      },
      icon: {
        color: getTextColorFromRGB(chroma(levelColor ?? '#fff').rgb()),
        height: theme.spacing(2),
      },
      smallFont: {
        [theme.breakpoints.down('xs')]: { fontSize: '12px', height: 20 },
      },
    };
  });

export default pure(LevelComponent);
