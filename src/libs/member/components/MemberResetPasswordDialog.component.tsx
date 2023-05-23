import React from 'react';
import { useTranslation } from 'react-i18next';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';

type Props = {
  open: boolean;
  email: string;
  emailSent: boolean;
  onResetPassword: () => void;
  onClose: () => void;
  loading: boolean;
  error: boolean;
};

const MemberResetPasswordDialog: React.FC<Props> = ({
  open,
  email,
  emailSent,
  onResetPassword,
  onClose,
  error,
  loading,
}) => {
  const { t } = useTranslation(['member', 'common']);

  if (!email) {
    return null;
  }

  if (error) {
    return (
      <GenericResponsiveDialog
        maxWidth="sm"
        fullScreenBreakpoint="xs"
        open={open}
      >
        <DialogTitle>{t('resetPassword.dialogTitle')}</DialogTitle>
        <DialogContent>
          {t('resetPassword.error')}
          <DialogActions>
            <Button onClick={onClose}>{t('close')}</Button>
          </DialogActions>
        </DialogContent>
      </GenericResponsiveDialog>
    );
  }

  return (
    <GenericResponsiveDialog
      maxWidth="sm"
      fullScreenBreakpoint="xs"
      open={open}
    >
      <DialogTitle>{t('resetPassword.dialogTitle')}</DialogTitle>
      {!emailSent ? (
        <DialogContent>
          {t('resetPassword.dialogContent', { memberEmail: email })}
          <DialogActions>
            <Button disabled={loading} onClick={onClose}>
              {t('cancel')}
            </Button>
            <Button
              disabled={loading}
              onClick={onResetPassword}
              variant="outlined"
              color="primary"
            >
              {t('confirm')}
            </Button>
          </DialogActions>
        </DialogContent>
      ) : (
        <DialogContent>
          {t('resetPassword.confirmation', { memberEmail: email })}
          <DialogActions>
            <Button onClick={onClose}>{t('close')}</Button>
          </DialogActions>
        </DialogContent>
      )}
    </GenericResponsiveDialog>
  );
};

export default React.memo(MemberResetPasswordDialog);
