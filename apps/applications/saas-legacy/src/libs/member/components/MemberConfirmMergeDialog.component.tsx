import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { Trans, useTranslation } from 'react-i18next';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core';

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

  const classes = useStyles();

  return (
    <Dialog open={open} scroll="paper">
      <DialogTitle>{t('forms.merge.confirmation.title')}</DialogTitle>
      <DialogContent>
        <Trans
          i18nKey="forms.merge.confirmation.mergeIsPermanentWarning"
          ns="member"
        />
        <div className={classes.spacerVertical} />
        <Alert severity="info" variant="outlined">
          {t('forms.merge.confirmation.willNotifyInfo')}
        </Alert>
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

const useStyles = makeStyles((theme) => ({
  spacerVertical: {
    height: theme.spacing(2),
  },
}));

export default React.memo(MemberConfirmMergeDialog);
