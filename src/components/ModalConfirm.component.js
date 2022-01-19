// @flow

import React from 'react';

import { withTranslation, TFunction } from 'react-i18next';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import RedButton from '#components/button/RedButton.component';

type Props = {
  open?: boolean,
  options: { Content: any, cancel: string, confirm: string, title: string },
  t: TFunction,
  handleConfirm: () => void,
  handleCancel: () => void,
  countDownConfirm?: boolean,
};

export function ModalConfirm(props: Props) {
  const { t, options, open, handleCancel, handleConfirm } = props;
  return (
    <Dialog open={open} onClose={handleCancel || (() => {})}>
      {options.title && <DialogTitle>{t(options.title)}</DialogTitle>}
      <DialogContent>
        <DialogContentText>
          {options.Content ? <options.Content t={t} /> : null}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={(ev) => {
            ev.stopPropagation();
            handleCancel(ev);
          }}
        >
          {t(options.cancel || 'common.cancel')}
        </Button>
        {props.countDownConfirm ? (
          <RedButton
            onClick={(ev) => {
              ev.stopPropagation();
              handleConfirm(ev);
            }}
            color="primary"
            delayBeforeActivation={5}
          >
            {t(options.confirm || 'common.confirm')}
          </RedButton>
        ) : (
          <Button
            onClick={(ev) => {
              ev.stopPropagation();
              handleConfirm(ev);
            }}
            color="primary"
          >
            {t(options.confirm || 'common.confirm')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

ModalConfirm.defaultProps = { open: false };

export default withTranslation(['translation', 'member'])(ModalConfirm);
