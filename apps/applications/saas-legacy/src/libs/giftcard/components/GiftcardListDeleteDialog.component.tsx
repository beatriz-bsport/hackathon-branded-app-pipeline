import React from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import RedButton from '#src/components/button/RedButton.component';

type Props = {
  open: boolean;
  handleCancel: () => void;
  handleConfirm: () => void;
};

const GiftcardListDeleteDialog: React.FC<Props> = ({
  open,
  handleCancel,
  handleConfirm,
}) => {
  const { t } = useTranslation('giftcard');
  return (
    <Dialog open={open}>
      <DialogTitle>{t('giftcard.delete.dialog.title')}</DialogTitle>
      <DialogContent>{t('giftcard.delete.dialog.content')}</DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>
          {t('giftcard.delete.dialog.actions.close')}
        </Button>
        <RedButton onClick={handleConfirm}>
          {t('giftcard.delete.dialog.actions.delete')}
        </RedButton>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(GiftcardListDeleteDialog);
