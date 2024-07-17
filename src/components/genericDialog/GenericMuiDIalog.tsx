import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Dialog,
  Typography,
} from '@material-ui/core';

type Props = {
  open: boolean;
  title: string;
  content?: string | string[];
  onCancel?: () => void;
  onConfirm?: () => void;
  cancelText?: string;
  confirmText?: string;
  children?: React.ReactNode;
  confirmButtonVariant?: 'text' | 'outlined' | 'contained';
};

const GenericMuiDialog: React.FC<Props> = ({
  open,
  title,
  content,
  onCancel,
  onConfirm,
  cancelText,
  confirmText,
  children,
  confirmButtonVariant,
}) => {
  const { t } = useTranslation('common');
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
      <Dialog maxWidth="sm" onClose={onCancel} open={open}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{finalContent}</DialogContentText>
          {children}
        </DialogContent>
        <DialogActions>
          {(!!onCancel || !!cancelText) && (
            <Button color="secondary" onClick={handleCancel}>
              {cancelText || t('cancel')}
            </Button>
          )}
          {(!!onConfirm || !!confirmText) && (
            <Button
              color="primary"
              onClick={handleConfirm}
              variant={confirmButtonVariant || 'contained'}
            >
              {confirmText || t('selector.validate')}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default React.memo(GenericMuiDialog);
