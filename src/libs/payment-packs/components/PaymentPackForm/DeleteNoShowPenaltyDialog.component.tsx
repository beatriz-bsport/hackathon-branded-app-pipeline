import React from 'react';

import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';

import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';

export type Props = {
  open: boolean;
  onClose: () => void;
};

export const DeleteNoShowPenaltyDialog: React.FC<Props> = (props) => {
  const { t } = useTranslation(['paymentPack', 'common']);
  const classes = useStyles();

  return (
    <GenericResponsiveDialog maxWidth="sm" open={props.open}>
      <DialogTitle>
        {t('form.paymentPack.penalty.deleteNoShowDialog.title')}
      </DialogTitle>
      <DialogContent>
        {t('form.paymentPack.penalty.deleteNoShowDialog.text')}
      </DialogContent>
      <div className={classes.buttonContainer}>
        <DialogActions>
          <Button onClick={props.onClose} variant="contained" color="primary">
            {t('common:ok')}
          </Button>
        </DialogActions>
      </div>
    </GenericResponsiveDialog>
  );
};

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    marginBottom: theme.spacing(1),
  },
}));

export default DeleteNoShowPenaltyDialog;
