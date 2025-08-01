import React, { JSX } from 'react';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { push } from 'connected-react-router';
import clsx from 'clsx';

// eslint-disable-next-line bsport/no-redux-in-component
import { connect, ConnectedProps } from 'react-redux';
import useTheme from '@material-ui/core/styles/useTheme';
import makeStyles from '@material-ui/core/styles/makeStyles';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';

import { BLOCKER_FRAME_ID } from '#src/libs/platform-billing/constant';
import { hasUpsell } from '#src/libs/platform-billing/utils';
import {
  requestUpsellPackage as requestUpsellPackageAction,
  subscribeUpsellPackage as subscribeUpsellPackageAction,
} from '#src/libs/platform-billing/actions';
import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';
import { rudderStackFormTrackingFunctionsRegistry } from '#src/components/analytics/rudderstack/utils';
import { UPSELL_IDENTIFIER_CADENCE } from '#src/libs/platform-billing/upsell-identifiers';
import AudienceUpsellBlockerDialog from './AudienceUpsellBlockerDialog';
import FeatureRequestDialog from '#src/libs/platform-billing/components/FeatureRequestDialog.component';
import WelcomeIcon from '#src/components/icons/WelcomeIcon.component';

import type { UpsellPackage } from '#src/libs/company/types';
import type { Dispatch } from '../../../state/types';
import type { RootState } from '../../../reducers';

const { trackFormSubmitIntent: trackFormSubmitIntentUpsellRequest } =
  rudderStackFormTrackingFunctionsRegistry(
    SegmentAnalyticsFormObjectIdentifier.UpsellRequest,
  );

const useStyles = makeStyles((theme) => ({
  blockerFrame: {
    position: 'absolute',
    left: 0,
    right: 0,
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
    bottom: 0,
    top: 0,
    right: 0,
    left: 0,
  },
  pseudoDialogContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  paperRoot: {
    padding: theme.spacing(1),
  },
  innerPaper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(2),
    maxWidth: 500,
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    marginBottom: 0,
  },
  iconContainer: {
    padding: theme.spacing(1),
  },
  largeIconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '100%',
    width: '110px',
    height: '110px',
  },
  textContainer: {
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
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
  }: Omit<Props, 'featureList' | 'subscribeUpsellPackage' | 'redirectTo'>) => {
    const classes = useStyles();
    const theme = useTheme();
    const { t } = useTranslation('platformBilling');

    // Here we need to force the rerender of the component because the Dialog is
    // rendered before its parent which then makes the body his container

    const [_, setForceRerender] = React.useState(false);
    const location = useLocation();

    const [isFeatureRequestDialogOpen, setIsFeatureRequestDialogOpen] =
      React.useState(false);

    const handleCloseFeatureRequestDialog = React.useCallback(() => {
      setIsFeatureRequestDialogOpen(false);
    }, []);

    const handleRequestUpsellPackage = React.useCallback(() => {
      trackFormSubmitIntentUpsellRequest(upsellIdentifier, {
        source_component: 'UpsellBlockerDialog',
      });
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
        ref={() => setForceRerender(true)}
        className={clsx(classes.blockerFrame, {
          [classes.blockerFrameForContentPages]: isPageContent,
        })}
        id={BLOCKER_FRAME_ID}
      >
        <div className={classes.pseudoDialogContainer}>
          <Dialog
            open
            BackdropProps={{ invisible: true }}
            container={document.getElementById(BLOCKER_FRAME_ID)}
            PaperProps={{
              elevation: 3,
              className: classes.paperRoot,
            }}
          >
            <div className={classes.innerPaper}>
              <div className={classes.iconContainer}>
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
              </div>
              <div className={classes.textContainer}>
                <Typography align="center" variant="h6">
                  {t(`upsellPackage.lockDialog.${upsellIdentifier}.intro`)}
                </Typography>
              </div>
              <div className={classes.textContainer}>
                <Typography align="center">
                  {t(`upsellPackage.lockDialog.${upsellIdentifier}.explain`)}
                </Typography>
              </div>
              <div className={classes.buttonsContainer}>
                {requestUpsellPackage &&
                  handleRequestUpsellPackage &&
                  !handleOpenSubscriptionForm && (
                    <Button
                      color="primary"
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
                  >
                    {t('upsellPackage.seeMore')}
                  </Button>
                )}
              </div>
            </div>
          </Dialog>
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
    redirectTo,
  }: Props) => {
    const hasAccessToUpsell = hasUpsell(featureList, upsellIdentifier);
    const isAudienceUpsell = upsellIdentifier === UPSELL_IDENTIFIER_CADENCE;

    if (hasAccessToUpsell) {
      return null;
    }

    if (isAudienceUpsell) {
      return (
        <AudienceUpsellBlockerDialog
          redirectTo={redirectTo}
          requestUpsellPackage={requestUpsellPackage}
          upsellIdentifier={upsellIdentifier}
        />
      );
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
    redirectTo(page: string) {
      dispatch(push(page));
    },
    subscribeUpsellPackage: subscribeUpsellPackageAction,
  }),
);

export default connector(UpsellBlocker);
