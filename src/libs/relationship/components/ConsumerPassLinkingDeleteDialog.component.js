// @flow
import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { compose, pure } from 'recompose';
import { withTranslation, TFunction } from 'react-i18next';
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

export const ConsumerPassLinkingDeleteDialog = (props: Props) => {
  return (
    <Dialog open={props.open}>
      <DialogTitle>
        {props.t('consumer_payment_pack_links.form.unlink.title')}
      </DialogTitle>
      <DialogContent>
        {props.t('consumer_payment_pack_links.form.unlink.explain')}
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onCancel}>
          {props.t('consumer_payment_pack_links.form.unlink.cancel')}
        </Button>
        <RedButton onClick={() => props.onSubmit(props.consumerPackLink)}>
          {props.t('consumer_payment_pack_links.form.unlink.submit')}
        </RedButton>
      </DialogActions>
    </Dialog>
  );
};

export default compose(
  withTranslation(['relationship']),
  pure,
)(ConsumerPassLinkingDeleteDialog);
