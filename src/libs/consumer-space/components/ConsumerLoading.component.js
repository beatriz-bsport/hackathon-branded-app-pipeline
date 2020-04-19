// @flow

import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';

type Props = {
  classes: Object,
};

export const ConsumerLoading = (props: Props) => (
  <div className={props.classes.container}>
    <CircularProgress />
  </div>
);

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.unit * 4,
    width: '100vw',
  },
});

export default withStyles(styles)(ConsumerLoading);
