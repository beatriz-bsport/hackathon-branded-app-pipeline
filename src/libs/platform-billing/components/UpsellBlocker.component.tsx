import React, { JSX } from 'react';
import { useLocation } from 'react-router';

// eslint-disable-next-line bsport/no-redux-in-component
import { connect, ConnectedProps } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Paper, Button, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import classNames from 'classnames';
import WelcomeIcon from '#components/icons/WelcomeIcon.component';
import { hasUpsell } from '#libs/platform-billing/utils';
import {
  requestUpsellPackage as requestUpsellPackageAction,
  subscribeUpsellPackage as subscribeUpsellPackageAction,
} from '#libs/platform-billing/actions';

import Config from '../../../config';
import type { Dispatch } from '../../../state/types';
import type { RootState } from '../../../reducers';
import type { UpsellPackage } from '#libs/company/types';
// @ts-expect-error
import FeatureRequestDialog from '#libs/platform-billing/components/FeatureRequestDialog.component';

const useStyles = makeStyles((theme) => ({
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
  blockerFrameForContentPages: {
    width: 'auto',
    height: 'auto',
    bottom: `-${theme.spacing(1)}px`,
    top: `-${theme.spacing(2)}px`,
    [theme.breakpoints.up('md')]: {
      left: `-${theme.spacing(3)}px`,
      right: `-${theme.spacing(3)}px`,
    },
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
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
  knowMoreButton: {
    color: theme.palette.grey[700],
    marginRight: theme.spacing(2),
  },
  largeIconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '100%',
    width: '110px',
    height: '110px',
  },
}));

type Props = {
  upsellIdentifier: number;
  handleOpenSubscriptionForm?: () => void;
  // Since the upsell package subscription form component content is dynamic (title, icon etc.), it depends on its upsell package data.
  // That is why the 'open form' button should be disabled as long as redux hasn't fetched the corresponding data in the API.
  upsellPackage?: UpsellPackage;
  CustomIconComponent?: JSX.Element;
} & ConnectedProps<typeof connector>;

export const UpsellBlockerDialog = React.memo(
  ({
    upsellIdentifier,
    CustomIconComponent,
    requestUpsellPackage,
    handleOpenSubscriptionForm,
    upsellPackage,
  }: Omit<Props, 'featureList' | 'subscribeUpsellPackage'>) => {
    const classes = useStyles();
    const theme = useTheme();
    const { t } = useTranslation('platformBilling');

    const location = useLocation();

    const [isFeatureRequestDialogOpen, setIsFeatureRequestDialogOpen] =
      React.useState(false);

    const handleCloseFeatureRequestDialog = React.useCallback(() => {
      setIsFeatureRequestDialogOpen(false);
    }, []);

    const handleRequestUpsellPackage = React.useCallback(() => {
      requestUpsellPackage(upsellIdentifier);
      setIsFeatureRequestDialogOpen(true);
    }, [requestUpsellPackage, upsellIdentifier]);

    const isPageContent = !(
      location.pathname.includes('/spot-scheduling') ||
      /\/audience\/\d+/.test(location.pathname) ||
      location.pathname.includes('/inbox/')
    );

    return (
      <div
        className={classNames(classes.blockerFrame, {
          [classes.blockerFrameForContentPages]: isPageContent,
        })}
      >
        <div className={classes.pseudoDialogContainer}>
          <Paper className={classes.pseudoDialog} elevation={3}>
            <div className={classes.innerPaper}>
              {CustomIconComponent ? (
                <div className={classes.largeIconContainer}>
                  {CustomIconComponent}
                </div>
              ) : (
                <WelcomeIcon
                  fill={theme.palette.primary.main}
                  height={96}
                  width={96}
                />
              )}
              <Typography align="center" variant="h6">
                {t(`upsellPackage.lockDialog.${upsellIdentifier}.intro`)}
              </Typography>
              <Typography align="center">
                {t(`upsellPackage.lockDialog.${upsellIdentifier}.explain`)}
              </Typography>
              <div className={classes.buttonsContainer}>
                {!handleOpenSubscriptionForm && (
                  <Button
                    className={classes.knowMoreButton}
                    onClick={handleRequestUpsellPackage}
                  >
                    {t('upsellPackage.lockDialog.requestAccess')}
                  </Button>
                )}
                {handleOpenSubscriptionForm && (
                  <Button
                    color="primary"
                    disabled={!upsellPackage}
                    onClick={handleOpenSubscriptionForm}
                    variant="contained"
                  >
                    {t('upsellPackage.seeMore')}
                  </Button>
                )}
              </div>
            </div>
          </Paper>
        </div>
        <FeatureRequestDialog
          onClose={handleCloseFeatureRequestDialog}
          open={isFeatureRequestDialogOpen}
        />
      </div>
    );
  },
);

const UpsellBlocker = React.memo(
  ({
    upsellIdentifier,
    CustomIconComponent,
    featureList,
    requestUpsellPackage,
    handleOpenSubscriptionForm,
    upsellPackage,
  }: Props) => {
    const allow = hasUpsell(featureList, upsellIdentifier);

    if (allow || Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production') {
      return null;
    }

    return (
      <UpsellBlockerDialog
        CustomIconComponent={CustomIconComponent}
        handleOpenSubscriptionForm={handleOpenSubscriptionForm}
        requestUpsellPackage={requestUpsellPackage}
        upsellIdentifier={upsellIdentifier}
        upsellPackage={upsellPackage}
      />
    );
  },
);

const connector = connect(
  (state: RootState) => ({
    featureList: state.company.feature.data,
  }),
  (dispatch: Dispatch) => ({
    requestUpsellPackage(upsellIdentifier: number) {
      dispatch(requestUpsellPackageAction(upsellIdentifier));
    },
    subscribeUpsellPackage: subscribeUpsellPackageAction,
  }),
);

export default connector(UpsellBlocker);
