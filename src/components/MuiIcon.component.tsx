import React from 'react';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import muiIconNames from './input/muiIcon/muiIconNames';

type Props = {
  icon: string;
  className?: string;
};

const MuiIcon = (props: Props) => {
  const { icon } = props;
  const MuiIconComponent = muiIconNames[icon];
  const classes = useStyles();
  // const iconComponent = React.createElement(muiIconComponent?.type, {
  //   className: props.className || classes.small,
  // });

  return MuiIconComponent ? (
    <>
      <MuiIconComponent className={props.className || classes.small} />
    </>
  ) : (
    <div className={props.className || classes.small} />
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

export default MuiIcon;
