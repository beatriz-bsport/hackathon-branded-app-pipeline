import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Config from '../../config';
import LOGO_ASSET from '../../public/images/banner_lowres.png';

export const LoadingBackoffice = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      {Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production' && (
        <img alt="bsport logo" height={40} src={LOGO_ASSET} />
      )}
      <CircularProgress className={classes.loading} />
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    height: '60vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    marginTop: theme.spacing(2),
  },
  textLoading: {
    marginTop: theme.spacing(1),
  },
}));

export default LoadingBackoffice;
