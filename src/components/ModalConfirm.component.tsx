import React from 'react';
import { useTranslation } from 'react-i18next';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import RedButton from '#components/button/RedButton.component';

export const ModalConfirm: React.FC<{
  open?: boolean;
  options: {
    Content: any;
    cancel?: string;
    confirm?: string;
    title: string;
    isDeletion?: boolean;
  };
  handleConfirm: (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleCancel: (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  countDownConfirm?: boolean;
}> = ({
  options,
  open = false,
  countDownConfirm = false,
  handleCancel,
  handleConfirm,
}) => {
  const { t } = useTranslation(['translation', 'member']);
  const ValidationButton = options?.isDeletion ? RedButton : Button;

  const ModalConfirmDialogContent = () => {
    if (options.Content) {
      if (typeof options.Content === 'string') {
        return <>{options.Content}</>;
      }

      return <options.Content t={t} />;
    }

    return null;
  };

  return (
    <Dialog onClose={handleCancel || (() => {})} open={open}>
      {options.title && <DialogTitle>{t(options.title)}</DialogTitle>}
      <DialogContent>
        <DialogContentText>
          <ModalConfirmDialogContent />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={(ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            ev.stopPropagation();
            handleCancel(ev);
          }}
        >
          {t(options.cancel || 'common.cancel')}
        </Button>
        {countDownConfirm ? (
          <RedButton
            color="primary"
            delayBeforeActivation={5}
            onClick={(ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
              ev.stopPropagation();
              handleConfirm(ev);
            }}
          >
            {t(options.confirm || 'common.confirm')}
          </RedButton>
        ) : (
          <ValidationButton
            color="primary"
            onClick={(ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
              ev.stopPropagation();
              handleConfirm(ev);
            }}
          >
            {t(options.confirm || 'common.confirm')}
          </ValidationButton>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ModalConfirm;
