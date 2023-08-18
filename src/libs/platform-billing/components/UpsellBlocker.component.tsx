import React from 'react';

// eslint-disable-next-line bsport/no-redux-in-component
import { connect, type ConnectedProps } from 'react-redux';
import { makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import { Paper, Button, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import WelcomeIcon from '#components/icons/WelcomeIcon.component';
import { hasUpsell } from '#libs/platform-billing/utils';
import { requestUpsellPackage as requestUpsellPackageAction } from '#libs/platform-billing/actions';

import Config from '../../../config';
import type { Dispatch } from '../../../state/types';
import type { RootState } from '../../../reducers';

const useStyles = makeStyles((theme: Theme) => ({
  blockerFrame: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 100000 /* some high z-index */,
    width: '100%',
    height: '100%',
    backdropFilter: 'blur(3px)',
    userSelect:
      'none' /* prevents double clicking from highlighting entire page */,
  },
  pseudoDialogContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  pseudoDialog: {
    padding: theme.spacing(4),
  },
  innerPaper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    '&>*': {
      marginBottom: theme.spacing(4),
    },
    maxWidth: 500,
  },
}));

type Props = {
  upsellIdentifier: number;
} & ConnectedProps<typeof connector>;

const UpsellBlocker = ({
  upsellIdentifier,
  featureList,
  requestUpsellPackage,
}: Props) => {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation('platformBilling');

  const allow = hasUpsell(featureList, upsellIdentifier);

  if (allow || Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production') {
    return null;
  }

  return (
    <div className={classes.blockerFrame}>
      <div className={classes.pseudoDialogContainer}>
        <Paper className={classes.pseudoDialog} elevation={3}>
          <div className={classes.innerPaper}>
            <WelcomeIcon
              fill={theme.palette.primary.main}
              height={96}
              width={96}
            />
            <Typography align="center">
              {t(`upsellPackage.lockDialog.${upsellIdentifier}.intro`)}
            </Typography>
            <Typography align="center">
              {t(`upsellPackage.lockDialog.${upsellIdentifier}.explain`)}
            </Typography>
            <Button
              color="primary"
              onClick={() => requestUpsellPackage(upsellIdentifier)}
              variant="contained"
            >
              {t('upsellPackage.lockDialog.requestAccess')}
            </Button>
          </div>
        </Paper>
      </div>
    </div>
  );
};

const connector = connect(
  (state: RootState) => ({
    featureList: state.company.feature.data,
  }),
  (dispatch: Dispatch) => ({
    requestUpsellPackage(upsellIdentifier: number) {
      dispatch(requestUpsellPackageAction(upsellIdentifier));
      // @ts-expect-error
      window.Intercom('trackEvent', 'Upsell feature requested', {
        upsellIdentifier,
      });
    },
  }),
);

export default connector(UpsellBlocker);
