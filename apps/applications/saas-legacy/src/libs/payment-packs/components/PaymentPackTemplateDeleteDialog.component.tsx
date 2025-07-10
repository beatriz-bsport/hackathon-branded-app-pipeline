import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import RedButton from '#src/components/button/RedButton.component';
import { VALIDATION_DELAY } from '#src/libs/constants';

type Props = {
  open?: boolean;
  onClose: () => void;
  onSubmit: () => void;
  isUniversal?: boolean;
};

const paymentPackTemplateTexts = {
  title: 'paymentPackTemplate.deleteForm.title',
  content: 'paymentPackTemplate.deleteForm.content',
  close: 'paymentPackTemplate.deleteForm.actions.close',
  submit: 'paymentPackTemplate.deleteForm.actions.submit',
};
const universalPaymentPackTemplateTexts = {
  title: 'universalPaymentPackTemplate.deleteForm.title',
  content: 'universalPaymentPackTemplate.deleteForm.content',
  close: 'universalPaymentPackTemplate.deleteForm.actions.close',
  submit: 'universalPaymentPackTemplate.deleteForm.actions.submit',
};

const getTexts = (isUniversal?: boolean) => {
  if (isUniversal) {
    return universalPaymentPackTemplateTexts;
  }
  return paymentPackTemplateTexts;
};

const PaymentPackTemplateDeleteDialog: React.FC<Props> = ({
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
        <RedButton delayBeforeActivation={VALIDATION_DELAY} onClick={onSubmit}>
          {t(texts.submit)}
        </RedButton>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentPackTemplateDeleteDialog;
