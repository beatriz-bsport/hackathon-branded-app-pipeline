// @flow
import React from 'react';
import { compose, withState } from 'recompose';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';

import {
  SUCCEEDED,
  FAILED,
} from '@bsport/common/lib/master-data/planned-invoice-status';

import { DateTime } from 'luxon';
import { PlannedInvoiceItem } from './SubscriptionSchedule.component';

type Props = {
  open: boolean,
  onCancel: () => void,
  subscription: any,
  selectedInvoice: any,
  setSelectedInvoice: (any) => void,
  loading: boolean,
  onSubmit: (id: number) => void,
  stopNote: string,
  setStopNote: (note: string) => void,
};

const SubscriptionScheduledStopDialog = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['subscription']);
  const {
    open,
    subscription,
    selectedInvoice,
    setSelectedInvoice,
    loading,
    onSubmit,
    stopNote,
    setStopNote,
    onCancel,
  } = props;

  const handleNoteChange = React.useCallback(
    (event) => {
      setStopNote(event.target.value);
    },
    [setStopNote],
  );

  const handleSubmit = React.useCallback(() => {
    onSubmit(selectedInvoice.id, stopNote);
    onCancel();
  }, [onCancel, onSubmit, selectedInvoice?.id, stopNote]);

  if (loading) {
    return (
      <Dialog open={open}>
        <DialogContent>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Dialog open={open}>
      <DialogTitle>
        <Typography variant="h6">
          {t('subscription.scheduledStop.title')}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label={t('subscription.scheduledStop.notePlaceholder')}
          onChange={handleNoteChange}
          placeholder={t('subscription.scheduledStop.notePlaceholder')}
          value={stopNote}
        />
        <Typography className={classes.explainText}>
          {t('subscription.scheduledStop.explain')}
        </Typography>
        {subscription.planned_invoices
          .filter((pi) => DateTime.fromISO(pi.date) >= DateTime.now())
          .filter((pi) => pi.status !== SUCCEEDED.id && pi.status !== FAILED.id)
          .map((pi) => (
            <PlannedInvoiceItem
              key={pi.uuid}
              invoice={pi}
              onClick={() => setSelectedInvoice(pi)}
              selected={selectedInvoice === pi}
              t={t}
            />
          ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onCancel}>
          {t('subscription.freeze.form.cancel')}
        </Button>
        <Button
          color="primary"
          disabled={!selectedInvoice}
          onClick={handleSubmit}
        >
          {t('subscription.freeze.form.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  explainText: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
}));

export default compose(
  withState('selectedInvoice', 'setSelectedInvoice', null),
  withState('stopNote', 'setStopNote', ''),
)(SubscriptionScheduledStopDialog);
