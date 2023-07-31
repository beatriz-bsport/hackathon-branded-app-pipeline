// @flow
import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles, Theme } from '@material-ui/core/styles';
import LOGO_ASSET from '../../public/images/banner_lowres.png';

export const LoadingBackoffice = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <img src={LOGO_ASSET} alt="bsport logo" height={40} />
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
