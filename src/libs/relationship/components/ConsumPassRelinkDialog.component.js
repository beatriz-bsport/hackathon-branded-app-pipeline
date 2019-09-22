// @flow
import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { compose, pure } from 'recompose';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import RedButton from '../../../components/button/RedButton.component';

import type { ConsumerPaymentPackLink } from '../types';

type Props = {
  onCancel: () => void,
  onSubmit: () => void,
  open: boolean,
  consumerPackLink: ConsumerPaymentPackLink,
  t: TFunction,
};

export const ConsumerPassRelinkDeleteDialog = (props: Props) => {
  return (
    <Dialog open={props.open}>
      <DialogTitle>
        {props.t('consumer_payment_pack_links.form.relink.title')}
      </DialogTitle>
      <DialogContent>
        {props.t('consumer_payment_pack_links.form.relink.explain')}
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onCancel}>
          {props.t('consumer_payment_pack_links.form.relink.cancel')}
        </Button>
        <RedButton onClick={() => props.onSubmit(props.consumerPackLink)}>
          {props.t('consumer_payment_pack_links.form.relink.submit')}
        </RedButton>
      </DialogActions>
    </Dialog>
  );
};

export default compose(
  withNamespaces(['relationship']),
  pure,
)(ConsumerPassRelinkDeleteDialog);
