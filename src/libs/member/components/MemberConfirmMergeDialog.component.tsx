import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
};

export const MemberConfirmMergeDialog: React.FC<Props> = ({
  onClose,
  onSubmit,
  open,
}) => {
  const { t } = useTranslation('member');
  return (
    <Dialog open={open} scroll="paper">
      <DialogTitle>{t('forms.merge.title')}</DialogTitle>
      <DialogContent>
        <div>
          <p>{t('forms.merge.explainCredit')}</p>
          <p>{t('forms.merge.explainBookingsAndPassAndInvoiceAndNotes')}</p>
          <Typography color="error">{t('forms.merge.explainTags')}</Typography>
          <p>{t('forms.merge.emailWillBeSend')}</p>
        </div>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={onClose}>
          {t('forms.merge.cancel')}
        </Button>
        <Button color="primary" onClick={onSubmit}>
          {t('forms.merge.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(MemberConfirmMergeDialog);
