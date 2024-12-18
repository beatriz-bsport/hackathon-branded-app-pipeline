import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Button, Typography } from '@material-ui/core';

type Props = {
  total: number;
  onActionClick: () => void;
};

const WellhubProductAlert: React.FC<Props> = ({ total, onActionClick }) => {
  const { t } = useTranslation('partnership');

  if (total <= 0) {
    return null;
  }

  return (
    <Alert
      action={
        <Button color="inherit" onClick={onActionClick}>
          {t('wellhub.productSelection.alert.action')}
        </Button>
      }
      severity="error"
    >
      <AlertTitle>{t('wellhub.productSelection.alert.title')}</AlertTitle>
      <Typography variant="body2">
        {t('wellhub.productSelection.alert.message')}
      </Typography>
    </Alert>
  );
};

export default React.memo(WellhubProductAlert);
