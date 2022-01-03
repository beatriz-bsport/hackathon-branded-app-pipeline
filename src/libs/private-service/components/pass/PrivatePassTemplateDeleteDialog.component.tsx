import React from 'react';

import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import RedButton from '../../../../components/button/RedButton.component';

type Props = { open?: boolean; onClose: () => void; onSubmit: () => void };

const PaymentPackTemplateDeleteDialog = (props: Props) => {
  const { t } = useTranslation(['paymentPack']);
  return (
    <Dialog open={props.open}>
      <DialogTitle>{t('paymentPackTemplate.deleteForm.title')}</DialogTitle>
      <DialogContent>
        {t('paymentPackTemplate.deleteForm.content')}
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>
          {t('paymentPackTemplate.deleteForm.actions.close')}
        </Button>
        <RedButton delayBeforeActivation={5} onClick={props.onSubmit}>
          {t('paymentPackTemplate.deleteForm.actions.submit')}
        </RedButton>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentPackTemplateDeleteDialog;
