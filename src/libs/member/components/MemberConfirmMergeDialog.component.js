// @flow
import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { withNamespaces } from 'react-i18next';
import { compose } from 'recompose';

import type { TFunction } from 'react-i18next';

type Props = {
  open: boolean,
  onClose: () => void,
  onSubmit: () => void,
  t: TFunction,
};

export function MemberSearchModal(props: Props) {
  return (
    <Dialog open={props.open} scroll="paper">
      <DialogTitle>{props.t('forms.merge.title')}</DialogTitle>
      <DialogContent>
        <div>
          <p>{props.t('forms.merge.explainCredit')}</p>
          <p>
            {props.t('forms.merge.explainBookingsAndPassAndInvoiceAndNotes')}
          </p>
          <Typography color="error">
            {props.t('forms.merge.explainTags')}
          </Typography>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="secondary">
          {props.t('forms.merge.cancel')}
        </Button>
        <Button onClick={props.onSubmit} color="primary">
          {props.t('forms.merge.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default compose(withNamespaces(['member']))(MemberSearchModal);
