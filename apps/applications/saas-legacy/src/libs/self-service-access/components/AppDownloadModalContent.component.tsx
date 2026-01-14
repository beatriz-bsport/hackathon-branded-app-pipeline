import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { captureMessage } from '@sentry/react';
import { makeStyles } from '@material-ui/core';
import Button from '#src/components/css-only/Fabrique/ButtonV2';
import Typography from '#src/components/css-only/Fabrique/Typography';

type Props = {
  companyId: number;
  iosAppUrl: string;
  androidAppUrl: string;
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(3),
    padding: theme.spacing(4),
  },
  appDownloadButtons: {
    display: 'flex',
    gap: theme.spacing(2),
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
}));

export default function AppDownloadModalContent({
  companyId,
  iosAppUrl,
  androidAppUrl,
}: Props) {
  const { t } = useTranslation(['b2c_accessControl']);
  const classes = useStyles();

  useEffect(() => {
    if (!iosAppUrl && !androidAppUrl) {
      captureMessage(
        'Proximity proof enabled but no app download URLs configured',
        { level: 'error', extra: { companyId } },
      );
    }
  }, [iosAppUrl, androidAppUrl, companyId]);

  return (
    <div className={classes.container}>
      <Typography align="center" variant="body-md">
        {t('openDoorButton.proximityProof.message')}
      </Typography>
      <div className={classes.appDownloadButtons}>
        {iosAppUrl && (
          <Button
            onClick={() => window.open(iosAppUrl, '_blank')}
            size="md"
            variant="text"
          >
            {t('openDoorButton.proximityProof.downloadIos')}
          </Button>
        )}
        {androidAppUrl && (
          <Button
            onClick={() => window.open(androidAppUrl, '_blank')}
            size="md"
            variant="text"
          >
            {t('openDoorButton.proximityProof.downloadAndroid')}
          </Button>
        )}
      </div>
    </div>
  );
}
