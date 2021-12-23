import React from 'react';

import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import HelpIcon from '@material-ui/icons/Help';

import { makeStyles, Theme } from '@material-ui/core';
import chroma from 'chroma-js';
import { openIntercomHelp } from '../../../intercom';

type Props = {
  title: string;
  company: boolean;
};

export const CustomFormTitle = (props: Props) => {
  const { title } = props;
  const classes = useStyles(props);

  return (
    <div className={classes.signupTitle}>
      <Typography className={classes.title}>{title}</Typography>
      <div
        className={`${classes.rectangle} ${
          props.company
            ? classes.rectangleCompanyBackground
            : classes.rectangleBackground
        }`}
      />
      <IconButton
        className={classes.iconButton}
        onClick={() => openIntercomHelp('login')}
      >
        <HelpIcon />
      </IconButton>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    fontSize: 36,
    fontWeight: 700,
  },
  signupTitle: {
    position: 'relative',
    marginBottom: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  iconButton: {
    position: 'absolute',
    top: 4,
    right: '-30%',
    marginLeft: theme.spacing(2),
  },
  rectangle: {
    height: 5,
    width: 146,
    marginBottom: theme.spacing(3),
  },
  rectangleBackground: {
    background: 'linear-gradient(90deg, #499C7C 4.66%, #2D767F 88.6%)',
  },
  rectangleCompanyBackground: {
    background: `linear-gradient(90deg,${
      theme.palette.primary.main
    } 4.66%, ${chroma(theme.palette.primary.main).darken(1.5)} 88.6%)`,
  },
}));

export default CustomFormTitle;
