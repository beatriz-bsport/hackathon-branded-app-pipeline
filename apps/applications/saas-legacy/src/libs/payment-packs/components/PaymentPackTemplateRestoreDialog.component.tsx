import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import RedButton from '#src/components/button/RedButton.component';

type Props = {
  open?: boolean;
  onClose: () => void;
  onSubmit: () => void;
  isUniversal?: boolean;
};

type DialogText = {
  title: string;
  content: string;
  close: string;
  submit: string;
};

const PaymentPackTemplateRestoreDialog: React.FC<Props> = ({
  onClose,
  onSubmit,
  isUniversal,
  open,
}) => {
  const { t } = useTranslation('paymentPack');

  const texts: DialogText = isUniversal
    ? {
        title: t('universalPaymentPackTemplate.restoreForm.title'),
        content: t('universalPaymentPackTemplate.restoreForm.content'),
        close: t('universalPaymentPackTemplate.restoreForm.actions.close'),
        submit: t('universalPaymentPackTemplate.restoreForm.actions.submit'),
      }
    : {
        title: t('paymentPackTemplate.restoreForm.title'),
        content: t('paymentPackTemplate.restoreForm.content'),
        close: t('paymentPackTemplate.restoreForm.actions.close'),
        submit: t('paymentPackTemplate.restoreForm.actions.submit'),
      };

  return (
    <Dialog onClose={onClose} open={!!open}>
      <DialogTitle>{texts.title}</DialogTitle>
      <DialogContent>{texts.content}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{texts.close}</Button>
        <RedButton onClick={onSubmit}>{texts.submit}</RedButton>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(PaymentPackTemplateRestoreDialog);
