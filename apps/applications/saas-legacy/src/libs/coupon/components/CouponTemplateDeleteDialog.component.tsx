import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import RedButton from '../../../components/button/RedButton.component';

type Props = { open?: boolean; onClose: () => void; onSubmit: () => void };

const CouponTemplateDeleteDialog = (props: Props) => {
  const { t } = useTranslation('coupon');
  return (
    <Dialog open={props.open}>
      <DialogTitle>{t('modal.delete.title')}</DialogTitle>
      <DialogContent>{t('modal.delete.content')}</DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>
          {t('modal.delete.actions.cancel')}
        </Button>
        <RedButton delayBeforeActivation={5} onClick={props.onSubmit}>
          {t('modal.delete.actions.submit')}
        </RedButton>
      </DialogActions>
    </Dialog>
  );
};

export default CouponTemplateDeleteDialog;
