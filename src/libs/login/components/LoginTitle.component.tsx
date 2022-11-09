import React from 'react';

import Typography from '@material-ui/core/Typography';

import { makeStyles, Theme } from '@material-ui/core';
import chroma from 'chroma-js';
import classNames from 'classnames';

type Props = {
  title: string;
  company?: boolean;
  isMobile?: boolean;
};

export const LoginTitle = (props: Props) => {
  const { title } = props;
  const classes = useStyles();

  return (
    <div className={classes.signupTitle}>
      <Typography
        className={classNames(classes.title, {
          [classes.titleIsMobile]: props?.isMobile,
        })}
      >
        {title}
      </Typography>
      <div
        className={`${classes.rectangle} ${
          props.company
            ? classes.rectangleCompanyBackground
            : classes.rectangleBackground
        }`}
      />
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    fontSize: 36,
    fontWeight: 700,
  },
  titleIsMobile: {
    fontSize: 28,
    fontWeight: 700,
    minWidth: '300px',
  },
  signupTitle: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  rectangle: {
    height: 5,
    width: '90%',
    marginBottom: theme.spacing(3),
  },
  rectangleBackground: {
    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  },
  rectangleCompanyBackground: {
    background: `linear-gradient(90deg,${
      theme.palette.primary.main
    } 4.66%, ${chroma(theme.palette.primary.main).darken(1.5)} 88.6%)`,
  },
}));

export default LoginTitle;
