// @flow

import React from 'react';

import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';

import B_ASSET from '../../public/images/b_dark.jpg';

const styles = (theme) => ({
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
