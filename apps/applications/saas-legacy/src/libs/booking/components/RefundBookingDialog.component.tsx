import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';

type Props = {
  isOpen: boolean;
  isLoading?: boolean;
  /** If true, we apply a different wording for the dialog */
  isConsumerPaymentPackUnlimited?: boolean;
  onSubmit: () => void;
  onClose: () => void;
};

const RefundBookingDialog: React.FC<Props> = ({
  isOpen,
  isLoading,
  isConsumerPaymentPackUnlimited,
  onSubmit,
  onClose,
}) => {
  const { t } = useTranslation(['booking', 'common']);

  const dialogTitle = isConsumerPaymentPackUnlimited
    ? t('booking:refundDialog.titleUnlimitedPaymentPack')
    : t('booking:refundDialog.title');

  const dialogContent = isConsumerPaymentPackUnlimited
    ? t('booking:refundDialog.contentUnlimitedPaymentPack')
    : t('booking:refundDialog.content');

  const dialogSubmitActionLabel = isConsumerPaymentPackUnlimited
    ? t('common:reset')
    : t('booking:refund');

  return (
    <GenericResponsiveDialog maxWidth="sm" onClose={onClose} open={isOpen}>
      <DialogTitle>{dialogTitle}</DialogTitle>

      <DialogContent>{dialogContent}</DialogContent>

      <DialogActions>
        <Button onClick={onClose}>{t('booking:close')}</Button>
        <Button
          color="primary"
          disabled={isLoading}
          onClick={onSubmit}
          variant="contained"
        >
          {dialogSubmitActionLabel}
        </Button>
      </DialogActions>
    </GenericResponsiveDialog>
  );
};

export default React.memo(RefundBookingDialog);
