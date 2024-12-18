import React from 'react';
import { Alert, AlertTitle } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  textColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  smsMainMessage: {
    paddingBottom: theme.spacing(1),
    fontStyle: 'italic',
  },
}));

export const AlertSmsProviderSmsNotVerified: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation('communication');
  return (
    <Alert severity="warning" style={{ alignItems: 'center' }}>
      <AlertTitle>{t('sms.warningProviderNotVerified.title')}</AlertTitle>
      <div className={classes.textColumn}>
        <div className={classes.smsMainMessage}>
          {t('sms.warningProviderNotVerified.mainMessage')}
        </div>
        {t('sms.warningProviderNotVerified.regulatoryNotice')}
      </div>
    </Alert>
  );
};

export default React.memo(AlertSmsProviderSmsNotVerified);
