import React from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';

import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';

import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';
import { Alert, AlertTitle } from '@material-ui/lab';

export type PartnershipWarningDialogTextProps = {
  title: string;
  confirmAction: string;
  cancelAction: string;
  alertTitle: string;
  alertContent: string;
};

type Props = {
  textContentKeys: PartnershipWarningDialogTextProps;
  isOpen: boolean;
  onCancel: () => void;
  onClose: () => void;
  onConfirm?: () => void;
};

const PartnershipWarningDialog: React.FC<Props> = ({
  textContentKeys,
  isOpen,
  onCancel,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation('partnership');
  const classes = useStyles();

  return (
    <GenericResponsiveDialog maxWidth="sm" onClose={onClose} open={isOpen}>
      <DialogTitle>{t(textContentKeys.title)}</DialogTitle>
      <DialogContent>
        <Alert severity="error">
          <AlertTitle>{t(textContentKeys.alertTitle)}</AlertTitle>
          {t(textContentKeys.alertContent)}
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button className={classes.cancelButton} onClick={onCancel}>
          {t(textContentKeys.cancelAction)}
        </Button>
        <Button color="primary" onClick={onConfirm}>
          {t(textContentKeys.confirmAction)}
        </Button>
      </DialogActions>
    </GenericResponsiveDialog>
  );
};

const useStyles = makeStyles((theme) => ({
  cancelButton: {
    color: theme.palette.grey[600],
  },
}));

export default React.memo(PartnershipWarningDialog);
