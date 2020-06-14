// @flow
import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import LOGO_ASSET from '../../public/images/banner_lowres.png';

type Props = {
  classes: Object,
};
export const LoadingBackoffice = (props: Props) => (
  <div className={props.classes.container}>
    <img src={LOGO_ASSET} alt="bsport logo" height={40} />
    <CircularProgress className={props.classes.loading} />
  </div>
);

const styles = (theme) => ({
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
});

export default withStyles(styles)(LoadingBackoffice);
