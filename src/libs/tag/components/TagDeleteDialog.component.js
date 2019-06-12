// @flow
import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { withNamespaces } from 'react-i18next';
import { compose } from 'recompose';
import type { TFunction } from 'react-i18next';
import RedButton from '../../../components/button/RedButton.component';

type Props = {
  open: boolean,
  onClose: () => void,
  onSubmit: () => void,
  t: TFunction,
};

export function TagDeleteDialog(props: Props) {
  return (
    <Dialog open={props.open} scroll="paper">
      <DialogTitle>{props.t('form.tag.delete.title')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {props.t('form.tag.delete.explain')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="secondary">
          {props.t('form.tag.delete.cancel')}
        </Button>
        <RedButton onClick={props.onSubmit} color="primary">
          {props.t('form.tag.delete.submit')}
        </RedButton>
      </DialogActions>
    </Dialog>
  );
}

export default compose(withNamespaces(['tag']))(TagDeleteDialog);
