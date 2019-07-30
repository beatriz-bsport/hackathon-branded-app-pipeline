// @flow
import React from 'react';

import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
  Button,
} from '@material-ui/core';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose, withState } from 'recompose';
import moment from 'moment';
import DateInput from '../../../components/input/DateInput.component';

type Props = {
  open: boolean,
  onSubmit: (date: Object) => void,
  onClose: () => void,
  date: Object,
  setDate: (Object) => void,
  t: TFunction,
};

const getDateAtNowHour = (date: ?Object) => {
  return (date || moment()).set({
    hour: moment().hour(),
    minute: moment().minute(),
  });
};

export function FinalizeInvoiceDialog(props: Props) {
  const { open, onSubmit, onClose, t } = props;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {t('invoice.choseDateTitle')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {t('invoice.explainDateChoser')}
        </DialogContentText>
        <div style={{ marginTop: 12 }}>
          <DateInput
            required
            value={moment(props.date)}
            onChange={props.setDate}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          {t('common.cancel')}
        </Button>
        <Button
          onClick={() => onSubmit(getDateAtNowHour(props.date))}
          color="primary"
          autoFocus
        >
          {t('common.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default compose(
  withNamespaces(),
  withState('date', 'setDate'),
)(FinalizeInvoiceDialog);
