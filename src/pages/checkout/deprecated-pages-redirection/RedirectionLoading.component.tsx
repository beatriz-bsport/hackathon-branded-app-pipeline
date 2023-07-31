import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

export default () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <CircularProgress />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: theme.spacing(4),
    flexDirection: 'column',
    width: '100vw',
    height: '100vh',
  },
}));
