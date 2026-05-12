import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line bsport/no-redux-in-component
import { useDispatch, useSelector } from 'react-redux';
import { Paper, Typography } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Alert from '@material-ui/lab/Alert';

// @ts-expect-error
import FeatureListProvider from '#src/libs/company/hocs/feature-list-provider.hoc';
import type { FeatureList } from '#src/libs/company/types';
import {
  finalizeTicketbaiSetup,
  getIsCompanyAllSetup,
  onboardFiskalyCompany,
} from '#src/libs/invoice/actions';
import {
  FiskalyOnboardingRequirement,
  SIGN_ES_TERRITORY,
} from '#src/libs/invoice/types';
import TicketbaiDeviceSetupStep from '#src/libs/invoice/sign-es/ticketbai/components/TicketbaiDeviceSetupStep.component';
import TicketbaiOnboardingEntryStep from '#src/libs/invoice/sign-es/ticketbai/components/TicketbaiOnboardingEntryStep.component';
import type { TicketbaiTerritory } from '#src/libs/invoice/sign-es/ticketbai/types';
import { UPSELL_IDENTIFIER_FISKALY_SIGN_ES } from '#src/libs/platform-billing/upsell-identifiers';
import { hasUpsell } from '#src/libs/platform-billing/utils';
import { snackbarError, snackbarSuccess } from '#src/libs/snackbar/actions';
import type { RootState } from '#src/reducers';
import { useVerifactuOnboardingStatus } from '#src/libs/invoice/sign-es/hooks/useVerifactuOnboardingStatus';

export type { TicketbaiTerritory } from '#src/libs/invoice/sign-es/ticketbai/types';

type Props = {
  territory: TicketbaiTerritory;
};

const TicketbaiSettings: React.FC<Props> = ({ territory }) => {
  const classes = useStyles();
  const { t } = useTranslation('b2b_invoice');
  const dispatch = useDispatch();
  const [isSetupConfirmed, setIsSetupConfirmed] = useState(false);

  const platformCustomerEntity = useSelector(
    (state: RootState) => state.platformBilling.platformCustomerEntity?.data,
  );

  const deviceCertificateSerialNumber = useSelector(
    (state: RootState) =>
      state.invoice.fiskalyOnboarding.deviceCertificateSerialNumber,
  );
  const onboardLoading = useSelector(
    (state: RootState) => state.invoice.fiskalyOnboarding.loading,
  );
  const isTicketbaiSetupFinalized = useSelector(
    (state: RootState) =>
      state.invoice.fiskalyOnboarding.isTicketbaiSetupFinalized ?? false,
  );
  const isCompanyAllSetup = useSelector(
    (state: RootState) => state.invoice.fiskalyOnboarding.isCompanyAllSetup,
  );
  const onboardingRequirements = useSelector(
    (state: RootState) => state.invoice.fiskalyOnboarding.requirements,
  );
  const isOnboardingStatusResolved = useSelector(
    (state: RootState) => state.invoice.fiskalyOnboarding.isOnboarded !== null,
  );
  const finalizeTicketbaiSetupLoading = useSelector(
    (state: RootState) =>
      state.invoice.fiskalyOnboarding.finalizeTicketbaiSetupLoading,
  );
  const finalizeTicketbaiSetupError = useSelector(
    (state: RootState) =>
      state.invoice.fiskalyOnboarding.finalizeTicketbaiSetupError,
  );

  const { isOnboarded, isLoadingOnboarding } = useVerifactuOnboardingStatus({
    skipAgreementFetch: true,
    skipRepresentativesFetch: true,
    fetchDeviceCertificateIfMissing: true,
  });

  const isTicketbaiSetupComplete =
    isTicketbaiSetupFinalized || isCompanyAllSetup === true;
  const areRequirementsLoaded = isOnboardingStatusResolved && !onboardLoading;

  const isConfigStepOpen = isOnboarded || !!deviceCertificateSerialNumber;

  const criticalRequirementsMet = useMemo(
    () =>
      !onboardingRequirements.some(
        (req) =>
          req === FiskalyOnboardingRequirement.BUSINESS_VAT_ID_NOT_VERIFIED ||
          req === FiskalyOnboardingRequirement.BUSINESS_ADDRESS_NOT_PROVIDED ||
          req === FiskalyOnboardingRequirement.LEGAL_IDENTIFIER_NOT_ACTIVATED,
      ),
    [onboardingRequirements],
  );

  const handleFinalizeTicketbai = useCallback(() => {
    dispatch(
      finalizeTicketbaiSetup({
        onSuccess: () => {
          dispatch(getIsCompanyAllSetup());
          dispatch(
            snackbarSuccess(t('configuration.ticketbai.finalize.success')),
          );
        },
        onError: () => {
          dispatch(snackbarError(t('configuration.ticketbai.finalize.error')));
        },
      }),
    );
  }, [dispatch, t]);

  const handleConfigureTicketbai = useCallback(() => {
    dispatch(
      onboardFiskalyCompany({
        onSuccess: (data) => {
          if (data?.device_certificate_serial_number) {
            dispatch(
              snackbarSuccess(
                t('configuration.ticketbai.onboarding.device_registered'),
              ),
            );
            return;
          }

          dispatch(
            snackbarError(t('configuration.ticketbai.onboarding.device_error')),
          );
        },
        onError: () => {
          dispatch(
            snackbarError(
              t('configuration.ticketbai.onboarding.register_error'),
            ),
          );
        },
      }),
    );
  }, [dispatch, t]);

  return (
    <FeatureListProvider>
      {(featureList: FeatureList) => {
        const hasUpsellActivated = hasUpsell(
          featureList,
          UPSELL_IDENTIFIER_FISKALY_SIGN_ES,
        );
        const isUpsellEnabled =
          hasUpsellActivated &&
          !onboardingRequirements.includes(
            FiskalyOnboardingRequirement.UPSELL_NOT_ACTIVATED,
          );

        return (
          <Paper className={classes.paper}>
            <div className={classes.header}>
              <Typography component="h3" variant="h6">
                {t('configuration.ticketbai.title')}
              </Typography>
            </div>

            {!isTicketbaiSetupComplete ? (
              <Typography className={classes.bodyText} variant="body2">
                {t('configuration.ticketbai.description')}
              </Typography>
            ) : null}

            {deviceCertificateSerialNumber && (
              <Alert className={classes.successAlert} severity="success">
                {t('configuration.ticketbai.active.success_message')}
              </Alert>
            )}

            {isTicketbaiSetupComplete &&
            territory === SIGN_ES_TERRITORY.GIPUZKOA ? (
              <Alert className={classes.infoAlert} severity="info">
                <Typography
                  className={classes.infoAlertTitle}
                  variant="subtitle2"
                >
                  {t('configuration.ticketbai.active.gipuzkoa_followup_title')}
                </Typography>
                <Typography variant="body2">
                  {t(
                    'configuration.ticketbai.active.gipuzkoa_followup_description',
                  )}
                </Typography>
              </Alert>
            ) : null}

            {isLoadingOnboarding ? (
              <Typography variant="body2">
                {t('configuration.ticketbai.loading')}
              </Typography>
            ) : isConfigStepOpen ? (
              <TicketbaiDeviceSetupStep
                deviceCertificateSerialNumber={deviceCertificateSerialNumber}
                finalizeTicketbaiSetupError={finalizeTicketbaiSetupError}
                finalizeTicketbaiSetupLoading={finalizeTicketbaiSetupLoading}
                handleFinalizeTicketbai={handleFinalizeTicketbai}
                isSetupConfirmed={isSetupConfirmed}
                isTicketbaiSetupFinalized={isTicketbaiSetupComplete}
                setIsSetupConfirmed={setIsSetupConfirmed}
                territory={territory}
              />
            ) : !isUpsellEnabled ? (
              <Alert className={classes.alert} severity="info">
                {t('configuration.ticketbai.info')}
              </Alert>
            ) : !areRequirementsLoaded || isCompanyAllSetup !== false ? (
              <Typography variant="body2">
                {t('configuration.ticketbai.loading')}
              </Typography>
            ) : (
              <TicketbaiOnboardingEntryStep
                criticalRequirementsMet={criticalRequirementsMet}
                handleConfigureTicketbai={handleConfigureTicketbai}
                onboardLoading={onboardLoading}
                platformCustomerEntity={platformCustomerEntity}
                requirements={onboardingRequirements}
                territory={territory}
              />
            )}
          </Paper>
        );
      }}
    </FeatureListProvider>
  );
};

const useStyles = makeStyles<Theme>((theme) => ({
  paper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  bodyText: {
    width: '100%',
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
  },
  alert: {
    marginTop: theme.spacing(2),
    alignItems: 'center',
  },
  successAlert: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  infoAlert: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  infoAlertTitle: {
    fontWeight: 590,
  },
}));

export default TicketbaiSettings;
