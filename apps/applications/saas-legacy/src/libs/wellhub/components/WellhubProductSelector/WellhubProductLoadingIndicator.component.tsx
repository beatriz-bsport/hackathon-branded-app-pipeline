import React from 'react';
import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  loadingIndicator: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(1),
  },
}));

const WellhubProductLoadingIndicator: React.FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.loadingIndicator}>
      <CircularProgress size={16} />
    </div>
  );
};

export default React.memo(WellhubProductLoadingIndicator);
