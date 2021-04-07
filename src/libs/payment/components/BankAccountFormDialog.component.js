// @flow
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import BankAccountForm from './BankAccountForm.component';

type Props = { open: boolean };

export const BankAccountDialog = (props: Props) => {
  if (!props.open) return null;

  return (
    <Dialog open>
      <BankAccountForm {...props} />
    </Dialog>
  );
};

export default BankAccountDialog;
