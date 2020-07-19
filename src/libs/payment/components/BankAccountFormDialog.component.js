// @flow
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import BankAccountForm from './BankAccountForm.component';

type Props = {};

export const BankAccountDialog = (props: Props) => {
  if (!props.open) return null;

  return (
    <Dialog open>
      <DialogContent>
        <BankAccountForm {...props} />
      </DialogContent>
    </Dialog>
  );
};

export default BankAccountDialog;
