// @flow
import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

import { withTranslation, TFunction } from 'react-i18next';
import RedButton from '../../../components/button/RedButton.component';

type Props = {
  t: TFunction,
  open: boolean,
  onClose: () => void,
  onSubmit: () => void,
};

export const WorkshopConfirmDeleteDialog = (props: Props) => {
  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>{props.t('modal.delete.title')}</DialogTitle>
      <DialogContent>{props.t('modal.delete.content')}</DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={props.onClose}>
          {props.t('modal.delete.cancel')}
        </Button>
        <RedButton color="secondary" onClick={props.onSubmit}>
          {props.t('modal.delete.confirm')}
        </RedButton>
      </DialogActions>
    </Dialog>
  );
};

export default withTranslation(['workshop'])(WorkshopConfirmDeleteDialog);
