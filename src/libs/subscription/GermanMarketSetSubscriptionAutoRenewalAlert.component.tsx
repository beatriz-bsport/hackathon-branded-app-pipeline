import React from 'react';

import { useTranslation } from 'react-i18next';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import RedButton from '#src/components/button/RedButton.component';

type Props = {
  onValidate: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const GermanMarketSetSubscriptionAutoRenewalAlert = ({
  onValidate,
  open,
  setOpen,
}: Props) => {
  const handleCancel = React.useCallback(() => setOpen(false), [setOpen]);
  const handleValidate = React.useCallback(() => {
    onValidate();
    setOpen(false);
  }, [onValidate, setOpen]);

  const { t } = useTranslation(['subscription', 'common']);

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      onClose={setOpen}
      open={open}
      scroll="paper"
    >
      <DialogTitle>
        {t('subscription:GermanMarketSetSubscriptionAutoRenewalAlert.title')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t(
            'subscription:GermanMarketSetSubscriptionAutoRenewalAlert.content',
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>{t('common:cancel')}</Button>

        <RedButton color="primary" onClick={handleValidate}>
          {t('common:confirm')}
        </RedButton>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(GermanMarketSetSubscriptionAutoRenewalAlert);
