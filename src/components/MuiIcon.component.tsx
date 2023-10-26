import React from 'react';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import muiIconNames from './input/muiIcon/muiIconNames';
import TriggeredPersonIcon from './icons/TriggeredPersonIcon.component';
import type { MuiIconName } from './input/muiIcon/MuiIconNameType';

type Props = {
  icon: string;
  defaultIcon?: string;
  className?: string;
  fillColor?: string;
};

const MuiIcon: React.FC<Props> = ({
  icon,
  defaultIcon,
  className,
  fillColor,
}) => {
  const classes = useStyles();
  if (icon === 'TriggeredPerson')
    return (
      <TriggeredPersonIcon
        className={className || classes.small}
        fill={fillColor}
      />
    );

  const MuiIconComponent =
    muiIconNames[icon as MuiIconName] ??
    muiIconNames[defaultIcon as MuiIconName];

  return MuiIconComponent ? (
    <MuiIconComponent className={className || classes.small} />
  ) : (
    <div className={className || classes.small} />
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

export default React.memo(MuiIcon);
