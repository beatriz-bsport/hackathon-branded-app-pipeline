import React from 'react';
import { Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/styles';

const SmsCostWarningAlert: React.FC = () => {
  const { t } = useTranslation('marketing');
  const styles = useStyles();

  return (
    <Alert severity="info">
      <div className={styles.alertContainer}>
        <Typography className={styles.alertTitle} variant="body2">
          {t('audience.smsWarning.alert.title')}
        </Typography>
        <Typography className={styles.alertContent} variant="body2">
          {t('audience.smsWarning.alert.content')}
        </Typography>
      </div>
    </Alert>
  );
};

const useStyles = makeStyles(() => ({
  alertContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  alertTitle: {
    fontWeight: 500,
    fontSize: '16px',
  },
  alertContent: {
    fontWeight: 400,
    fontSize: '14px',
  },
}));

export default React.memo(SmsCostWarningAlert);
