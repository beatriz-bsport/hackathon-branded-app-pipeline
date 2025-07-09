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

const paymentPackTemplateTexts = {
  title: 'paymentPackTemplate.restoreForm.title',
  content: 'paymentPackTemplate.restoreForm.content',
  close: 'paymentPackTemplate.restoreForm.actions.close',
  submit: 'paymentPackTemplate.restoreForm.actions.submit',
};
const universalPaymentPackTemplateTexts = {
  title: 'universalPaymentPackTemplate.restoreForm.title',
  content: 'universalPaymentPackTemplate.restoreForm.content',
  close: 'universalPaymentPackTemplate.restoreForm.actions.close',
  submit: 'universalPaymentPackTemplate.restoreForm.actions.submit',
};

const getTexts = (isUniversal?: boolean): DialogText => {
  if (isUniversal) {
    return universalPaymentPackTemplateTexts;
  }
  return paymentPackTemplateTexts;
};

const PaymentPackTemplateRestoreDialog: React.FC<Props> = ({
  onClose,
  onSubmit,
  isUniversal,
  open,
}) => {
  const { t } = useTranslation('paymentPack');

  const texts = getTexts(isUniversal);

  return (
    <Dialog onClose={onClose} open={!!open}>
      <DialogTitle>{t(texts.title)}</DialogTitle>
      <DialogContent>{t(texts.content)}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t(texts.close)}</Button>
        <RedButton onClick={onSubmit}>{t(texts.submit)}</RedButton>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(PaymentPackTemplateRestoreDialog);
