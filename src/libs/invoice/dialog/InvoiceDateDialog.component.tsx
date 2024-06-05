import React, { useState } from 'react';

import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import DateInput from '#components/input/DateInput.component';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';
import { OptionCallback } from '../../../state/types';

type Props = {
  open: boolean;
  onSubmit: (date: string, options: OptionCallback) => void;
  onClose: () => void;
};

const getDateAtNowHour = (date?: DateTime) => {
  const now = DateTime.now();
  return (
    date ? date.set({ hour: now.hour, minute: now.minute }) : now
  ).toISO();
};

const InvoiceDateDialog = (props: Props) => {
  const { open, onSubmit, onClose } = props;
  const { t } = useTranslation();
  const [date, setDate] = useState<DateTime>();
  const [processing, setProcessing] = useState(false);

  return (
    <GenericResponsiveDialog onClose={onClose} open={open}>
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
            className=""
            disabled={processing}
            onChange={setDate}
            value={date}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" disabled={processing} onClick={onClose}>
          {t('common.cancel')}
        </Button>
        {processing ? (
          <CircularProgress size={35} />
        ) : (
          <Button
            autoFocus
            color="primary"
            onClick={() => {
              setProcessing(true);
              onSubmit(getDateAtNowHour(date), {
                onSuccess: () => setProcessing(false),
                onError: () => setProcessing(false),
              });
            }}
          >
            {t('common.confirm')}
          </Button>
        )}
      </DialogActions>
    </GenericResponsiveDialog>
  );
};

export default InvoiceDateDialog;
