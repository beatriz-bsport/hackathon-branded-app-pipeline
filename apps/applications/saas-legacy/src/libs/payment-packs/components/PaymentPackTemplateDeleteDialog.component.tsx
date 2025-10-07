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

type PaymentPackTexts = {
  title: string;
  content: string;
  close: string;
  submit: string;
};

const PaymentPackTemplateDeleteDialog: React.FC<Props> = ({
  onClose,
  onSubmit,
  isUniversal,
  open,
}) => {
  const { t } = useTranslation('paymentPack');

  const texts: PaymentPackTexts = isUniversal
    ? {
        close: t('universalPaymentPackTemplate.deleteForm.actions.close'),
        content: t('universalPaymentPackTemplate.deleteForm.content'),
        submit: t('universalPaymentPackTemplate.deleteForm.actions.submit'),
        title: t('universalPaymentPackTemplate.deleteForm.title'),
      }
    : {
        close: t('paymentPackTemplate.deleteForm.actions.close'),
        content: t('paymentPackTemplate.deleteForm.content'),
        submit: t('paymentPackTemplate.deleteForm.actions.submit'),
        title: t('paymentPackTemplate.deleteForm.title'),
      };

  return (
    <Dialog onClose={onClose} open={!!open}>
      <DialogTitle>{texts.title}</DialogTitle>
      <DialogContent>{texts.content}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{texts.close}</Button>
        <RedButton delayBeforeActivation={VALIDATION_DELAY} onClick={onSubmit}>
          {texts.submit}
        </RedButton>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentPackTemplateDeleteDialog;
