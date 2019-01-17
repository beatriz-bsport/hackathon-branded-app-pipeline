// @flow

import React from 'react';

import { LinearProgress, Paper, withStyles } from '@material-ui/core';

import B_ASSET from '../../public/images/b_dark.jpg';

const styles = (theme) => ({
  container: {
    maxWidth: 500,
    margin: '50px auto',
    textAlign: 'center',
    padding: 0,
  },
  bsportLogo: {
    marginTop: 30,
    height: 80,
    width: 80,
  },
  content: {
    padding: theme.spacing.unit,
  },
});

type Props = {
  children: Object,
  classes: Object,
  loading?: boolean,
};
export function LoginBase(props: Props) {
  const { classes, loading, children } = props;
  return (
    <Paper className={classes.container}>
      <img className={classes.bsportLogo} src={B_ASSET} alt="bsport logo" />
      <div className={classes.content}>{children}</div>
      {loading ? <LinearProgress /> : null}
    </Paper>
  );
}

LoginBase.defaultProps = { loading: false };

export default withStyles(styles)(LoginBase);
