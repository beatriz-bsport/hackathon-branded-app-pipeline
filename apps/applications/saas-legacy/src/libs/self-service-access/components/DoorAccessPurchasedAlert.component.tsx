import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { captureMessage } from '@sentry/react';
import { makeStyles } from '@material-ui/core';
import Alert from '#Fabrique/Alert';
import Button from '#src/components/css-only/Fabrique/ButtonV2';
import { useDoorAccessProvider } from '../hooks/useDoorAccessProvider';

type Props = {
  companyId: number;
  iosAppUrl: string;
  androidAppUrl: string;
  onViewProfile: () => void;
};

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(3),
  },
  appDownloadButtons: {
    marginTop: theme.spacing(1.5),
    display: 'flex',
    gap: theme.spacing(2),
    flexWrap: 'wrap',
  },
}));

export default function DoorAccessPurchasedAlert({
  companyId,
  iosAppUrl,
  androidAppUrl,
  onViewProfile,
}: Props) {
  const classes = useStyles();
  const { t } = useTranslation(['checkout', 'b2c_accessControl']);
  const { provider, loading, error, isAvailable } =
    useDoorAccessProvider(companyId);

  const proximityProofEnabled = provider?.proximity_proof_protection_enabled;

  useEffect(() => {
    if (proximityProofEnabled && !iosAppUrl && !androidAppUrl) {
      captureMessage(
        'Proximity proof enabled but no app download URLs configured',
        {
          level: 'error',
          extra: { companyId },
        },
      );
    }
  }, [proximityProofEnabled, iosAppUrl, androidAppUrl, companyId]);

  if (loading || error || !isAvailable) {
    return null;
  }

  if (proximityProofEnabled) {
    return (
      <div className={classes.container}>
        <Alert
          color="info"
          title={t('validation.sections.doorAccessInfo.proximityProof.title', {
            ns: 'checkout',
          })}
          variant="weak"
        >
          <div>
            {t('validation.sections.doorAccessInfo.proximityProof.message', {
              ns: 'checkout',
            })}
          </div>
          <div className={classes.appDownloadButtons}>
            {iosAppUrl && (
              <Button
                onClick={() => window.open(iosAppUrl, '_blank')}
                size="md"
                variant="text"
              >
                {t('openDoorButton.proximityProof.downloadIos', {
                  ns: 'b2c_accessControl',
                })}
              </Button>
            )}
            {androidAppUrl && (
              <Button
                onClick={() => window.open(androidAppUrl, '_blank')}
                size="md"
                variant="text"
              >
                {t('openDoorButton.proximityProof.downloadAndroid', {
                  ns: 'b2c_accessControl',
                })}
              </Button>
            )}
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <Alert
        actionText={t('validation.actions.viewMyProfile', { ns: 'checkout' })}
        color="info"
        onActionClick={onViewProfile}
        title={t('validation.sections.doorAccessInfo.title', {
          ns: 'checkout',
        })}
        variant="weak"
      >
        {t('validation.sections.doorAccessInfo.message', { ns: 'checkout' })}
      </Alert>
    </div>
  );
}
