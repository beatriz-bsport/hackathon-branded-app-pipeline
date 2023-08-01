import React, { useCallback, useMemo } from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';

import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Dialog,
  Typography,
} from '@material-ui/core';

type OwnProps = {
  open: boolean;
  title: string;
  content: string | string[];
  onCancel?: () => void;
  onConfirm?: () => void;
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

  const finalContent = useMemo(() => {
    if (!content) {
      return '';
    }
    if (Array.isArray(content)) {
      return content.map((element, idx) => (
        <Typography key={idx}>{`• ${element}`}</Typography>
      ));
    }
    return content;
  }, [content]);

  const handleCancel = useCallback(() => onCancel(), [onCancel]);

  const handleConfirm = useCallback(() => onConfirm(), [onConfirm]);

  return (
    <>
      <Dialog maxWidth="sm" open={open}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{finalContent}</DialogContentText>
        </DialogContent>
        <DialogActions>
          {(!!onCancel || !!cancelText) && (
            <Button color="secondary" onClick={handleCancel}>
              {cancelText || t('cancel')}
            </Button>
          )}
          {(!!onConfirm || !!confirmText) && (
            <Button color="primary" onClick={handleConfirm} variant="contained">
              {confirmText || t('selector.validate')}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default compose<any, OwnProps>(withTranslation('common'))(
  GenericMuiDialog,
);
