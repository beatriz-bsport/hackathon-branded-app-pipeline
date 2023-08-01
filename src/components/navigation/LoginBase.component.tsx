// @ts-nocheck
import React from 'react';

import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import { makeStyles, Theme } from '@material-ui/core';
import { CompanyTheme } from '#libs/theme/types';

import B_ASSET from '../../public/images/b_dark.jpg';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    maxWidth: 320,
    textAlign: 'center',
    padding: 0,
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  bsportLogo: {
    marginTop: 30,
    height: 80,
    width: 80,
  },
  content: {
    padding: theme.spacing(1),
  },
}));

type Props = {
  children: Object;
  loading?: boolean;
  theme: CompanyTheme;
};

export function LoginBase(props: Props) {
  const { loading, children, theme } = props;
  const classes = useStyles();
  return (
    <Paper className={classes.container}>
      <img
        alt={`${theme?.company_name || 'bsport'} logo`}
        className={classes.bsportLogo}
        src={theme?.cover || B_ASSET}
      />
      <div className={classes.content}>{children}</div>
      {loading ? <LinearProgress /> : null}
    </Paper>
  );
}

export default LoginBase;
