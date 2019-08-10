// @flow
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import RedButton from '../../../components/button/RedButton.component';

type Props = {
  open: boolean,
  onClose: () => void,
  onSubmit: () => void,
  t: TFunction,
};

export const RevertBookingDialog = (props: Props) => (
  <Dialog
    open={!!props.open}
    onClose={props.onClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title">
      {props.t('dialog.delete.title')}
    </DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        {props.t('dialog.delete.content')}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={props.onClose} color="secondary">
        {props.t('dialog.delete.cancel')}
      </Button>
      <RedButton onClick={props.onSubmit}>
        {props.t('dialog.delete.confirm')}
      </RedButton>
    </DialogActions>
  </Dialog>
);

export default withNamespaces(['waitingList'])(RevertBookingDialog);
