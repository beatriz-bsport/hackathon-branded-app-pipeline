import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';

import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Dialog,
} from '@material-ui/core';

type OwnProps = {
  open: boolean;
  title: string;
  content: string;
  onCancel: () => void;
  onConfirm: () => void;
  cancelText?: string;
  confirmText?: string;
};
type Props = OwnProps & WithTranslation;
export const GenericMuiDialog = (props: Props) => {
  const {
    t,
    open,
    title,
    content,
    onCancel,
    onConfirm,
    cancelText,
    confirmText,
  } = props;

  return (
    <>
      <Dialog maxWidth="sm" open={open}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onCancel()} color="secondary">
            {cancelText || t('cancel')}
          </Button>
          <Button
            onClick={() => onConfirm()}
            variant="contained"
            color="primary"
          >
            {confirmText || t('selector.validate')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default compose<any, OwnProps>(withTranslation('common'))(
  GenericMuiDialog,
);
