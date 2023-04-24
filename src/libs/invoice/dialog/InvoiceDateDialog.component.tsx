// @ts-nocheck
import React, { useState } from 'react';

import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import moment, { Moment } from 'moment-timezone';
import { useTranslation } from 'react-i18next';
import DateInput from '#components/input/DateInput.component';
import { OptionCallback } from '../../../state/types';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';

type Props = {
  open: boolean;
  onSubmit: (date: string, options: OptionCallback) => void;
  onClose: () => void;
};

const getDateAtNowHour = (date?: Moment) => {
  return (date || moment())
    .set({
      hour: moment().hour(),
      minute: moment().minute(),
    })
    .format();
};

const InvoiceDateDialog = (props: Props) => {
  const { open, onSubmit, onClose } = props;
  const { t } = useTranslation();
  const [date, setDate] = useState<string>();
  const [processing, setProcessing] = useState(false);

  return (
    <GenericResponsiveDialog open={open} onClose={onClose}>
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
            value={moment(date)}
            onChange={setDate}
            disabled={processing}
            className=""
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button disabled={processing} onClick={onClose} color="secondary">
          {t('common.cancel')}
        </Button>
        {processing ? (
          <CircularProgress size={35} />
        ) : (
          <Button
            onClick={() => {
              setProcessing(true);
              onSubmit(getDateAtNowHour(moment(date)), {
                onSuccess: () => setProcessing(false),
                onError: () => setProcessing(false),
              });
            }}
            color="primary"
            autoFocus
          >
            {t('common.confirm')}
          </Button>
        )}
      </DialogActions>
    </GenericResponsiveDialog>
  );
};

export default InvoiceDateDialog;
