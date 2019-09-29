// @flow
import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import LOGO_ASSET from '../../public/images/banner_lowres.png';

type Props = {
  classes: Object,
  t: TFunction,
};
export const LoadingBackoffice = (props: Props) => (
  <div className={props.classes.container}>
    <img src={LOGO_ASSET} alt="bsport logo" height={40} />
    <Typography
      className={props.classes.textLoading}
      variant="caption"
      color="textSecondary"
    >
      {props.t('common.isRefreshing')}
    </Typography>
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
    marginTop: theme.spacing.unit * 2,
  },
  textLoading: {
    marginTop: theme.spacing.unit,
  },
});

export default withNamespaces()(withStyles(styles)(LoadingBackoffice));
