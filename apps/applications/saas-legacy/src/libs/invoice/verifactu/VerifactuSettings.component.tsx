import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line bsport/no-redux-in-component
import { useSelector } from 'react-redux';
import { Paper, Typography } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Alert from '@material-ui/lab/Alert';

import { FeatureFlags, useSafeFlag } from '#src/utils/feature-flag';
// @ts-expect-error
import FeatureListProvider from '#src/libs/company/hocs/feature-list-provider.hoc';
import type { FeatureList } from '#src/libs/company/types';
import { FiskalyOnboardingRequirement } from '#src/libs/invoice/types';
import {
  getPlatformCustomerEntityRepresentatives,
  getPlatformCustomerEntityRepresentativesLoading,
  // @ts-expect-error - selectors.js has no type definitions
} from '#src/libs/platform-billing/selectors';
import { UPSELL_IDENTIFIER_FISKALY_SIGN_ES } from '#src/libs/platform-billing/upsell-identifiers';
import { hasUpsell } from '#src/libs/platform-billing/utils';
import type { RootState } from '#src/reducers';
import type { FormValues } from '#src/libs/invoice/verifactu/types';
import VerifactuRepresentativeForm from '#src/libs/invoice/verifactu/components/VerifactuRepresentativeForm.component';
import VerifactuSignedAgreementForm from '#src/libs/invoice/verifactu/components/VerifactuSignedAgreementForm.component';
import VerifactuActive from '#src/libs/invoice/verifactu/components/VerifactuActive.component';
import { useVerifactuHandlers } from '#src/libs/invoice/verifactu/hooks/useVerifactuHandlers';
import { useVerifactuOnboardingStatus } from '#src/libs/invoice/verifactu/hooks/useVerifactuOnboardingStatus';

const VerifactuSettings: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation('b2b_invoice');
  const isFiskalySignEsEnabled = useSafeFlag(FeatureFlags.FISKALY_SIGN_ES);
  const representatives = useSelector((state: RootState) =>
    getPlatformCustomerEntityRepresentatives(state),
  );
  const isLoadingRepresentatives = useSelector((state: RootState) =>
    getPlatformCustomerEntityRepresentativesLoading(state),
  );
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  // Get the first representative from Redux state
  const representative = representatives?.[0] || null;

  // Fetch and manage Verifactu onboarding status and related data
  const {
    isOnboarded,
    setIsOnboarded,
    isLoadingOnboarding,
    agreementUrl,
    setAgreementUrl,
    signedAgreementFile,
    setSignedAgreementFile,
    isLoadingSignedAgreement,
    requirements,
  } = useVerifactuOnboardingStatus();

  const {
    handleSaveForLater,
    handleOnboardCompany,
    handleUploadSignedAgreement,
  } = useVerifactuHandlers(
    representative,
    setAgreementUrl,
    setIsOnboarded,
    setSignedAgreementFile,
  );

  const initialValues: FormValues = useMemo(
    () => ({
      first_name: representative?.first_name || '',
      last_name: representative?.last_name || '',
      dni_nie: representative?.identification_number || '',
      address: representative?.address_street || '',
      street_number: representative?.address_number || '',
      postal_code: representative?.address_postal_code || '',
      city: representative?.address_city || '',
      municipality: representative?.address_municipality || '',
      country: representative?.address_country_code || 'ES',
    }),
    [representative],
  );

  const handleDownloadPDF = useCallback(() => {
    if (agreementUrl) {
      window.open(agreementUrl, '_blank');
    }
  }, [agreementUrl]);

  const handleUploadFile = useCallback(
    (file: File) => {
      return handleUploadSignedAgreement(file, setIsUploadingFile);
    },
    [handleUploadSignedAgreement],
  );

  const renderContent = (isUpsellEnabled: boolean): React.ReactElement => {
    // Show loading only on initial load when we don't have representatives yet
    // Don't hide the form during update/create operations (isLoadingRepresentatives
    // becomes true during those operations but we already have data)
    const shouldShowLoading =
      isLoadingOnboarding ||
      (isLoadingRepresentatives && !representatives?.length);
    if (shouldShowLoading) {
      return (
        <Typography variant="body2">
          {t('configuration.verifactu.loading')}
        </Typography>
      );
    }

    // Company is already onboarded - check signed agreement status
    if (isOnboarded) {
      if (isLoadingSignedAgreement) {
        return (
          <Typography variant="body2">
            {t('configuration.verifactu.loading')}
          </Typography>
        );
      }

      // Signed agreement uploaded - show active state (3rd step)
      if (signedAgreementFile) {
        return (
          <VerifactuActive
            agreementUrl={signedAgreementFile}
            // TODO: Certificate URL - This should be a link to BSPORT's VERI*FACTU responsibility declaration certificate
            // This should be a static link
            certificateUrl={null}
            onEdit={() => setIsOnboarded(false)}
            representative={representative}
          />
        );
      }

      // Signed agreement not uploaded - show sign & upload form (2nd step)
      return (
        <VerifactuSignedAgreementForm
          isUploading={isUploadingFile}
          onDownloadPDF={handleDownloadPDF}
          onEdit={() => setIsOnboarded(false)}
          onUploadPDF={handleUploadFile}
          representative={representative}
        />
      );
    }

    // Upsell not activated - show info alert to contact Account Manager
    if (!isUpsellEnabled) {
      return (
        <Alert className={classes.alert} severity="info">
          {t('configuration.verifactu.info')}
        </Alert>
      );
    }

    // Upsell activated and not onboarded - show onboarding form (1st step)
    return (
      <VerifactuRepresentativeForm
        initialValues={initialValues}
        onSaveForLater={handleSaveForLater}
        onSubmit={handleOnboardCompany}
        requirements={requirements}
      />
    );
  };

  if (!isFiskalySignEsEnabled) return null;

  return (
    <FeatureListProvider>
      {(featureList: FeatureList) => {
        const hasUpsellActivated = hasUpsell(
          featureList,
          UPSELL_IDENTIFIER_FISKALY_SIGN_ES,
        );
        // Check if upsell is enabled, but override to false if UPSELL_NOT_ACTIVATED
        // requirement is present (indicates upsell was deactivated)
        const isUpsellEnabled =
          hasUpsellActivated &&
          !requirements.includes(
            FiskalyOnboardingRequirement.UPSELL_NOT_ACTIVATED,
          );

        return (
          <Paper className={classes.paper}>
            <div className={classes.header}>
              <Typography component="h3" variant="h6">
                {t('configuration.verifactu.title')}
              </Typography>
            </div>
            {!signedAgreementFile && (
              <div className={classes.content}>
                <Typography className={classes.bodyText} variant="body2">
                  {t('configuration.verifactu.description')}
                </Typography>
              </div>
            )}

            {renderContent(isUpsellEnabled)}
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
  content: {
    marginBottom: theme.spacing(2),
    width: '100%',
  },
  bodyText: {
    width: '100%',
    color: theme.palette.text.secondary,
  },
  alert: {
    marginTop: theme.spacing(2),
    alignItems: 'center',
  },
}));

export default VerifactuSettings;
