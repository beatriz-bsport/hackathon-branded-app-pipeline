// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import TextInput from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

import moment from 'moment-timezone';
import { SubscriptionPause } from '@bsport/common/lib/master-data/subscription-pause';

import { PlannedInvoiceItem } from './SubscriptionSchedule.component';
import NumberInput from '../../../components/input/NumericInput.component';

import { Subscription } from '../types';

type Props = {
  open: boolean,
  onCancel: () => void,
  onSubmit: (any) => void,
  subscription: Subscription,
};

export const SubscriptionPauseFormDialog = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['subscription']);

  const [name, setName] = React.useState('');
  const [days, setDays] = React.useState(7);
  const [packsType, setPacksType] = React.useState(1);
  const [selectedInvoice, setSelectedInvoice] = React.useState(null);
  const [processing, setProcessing] = React.useState(false);

  const onSubmit = (ev) => {
    ev.preventDefault();
    setProcessing(true);
    props.onSubmit(
      {
        days,
        name,
        first_paused_planned_invoice: selectedInvoice.id,
        action_pack_kind: packsType,
      },
      {
        onSuccess: () => {
          props.onCancel();
          setProcessing(false);
        },
        onError: () => setProcessing(false),
      },
    );
  };

  return (
    <Dialog open={props.open}>
      <form onSubmit={onSubmit}>
        <DialogTitle>{t('subscription.freeze.form.title')}</DialogTitle>
        <DialogContent>
          <Typography className={classes.label}>
            {t('subscription.freeze.form.explainInvoice')}
          </Typography>
          {props.subscription.planned_invoices
            .filter((pi) => !moment(pi.date).isBefore(moment()))
            .map((pi) => (
              <PlannedInvoiceItem
                key={pi.uuid}
                invoice={pi}
                t={t}
                onClick={() => setSelectedInvoice(pi)}
                selected={selectedInvoice === pi}
              />
            ))}
          <Typography className={classes.label}>
            {t('subscription.freeze.form.explain')}
          </Typography>
          <TextInput
            value={name}
            onChange={(ev) => setName(ev.target.value || '')}
            label={t('subscription.freeze.form.name.label')}
            placeholder={t('subscription.freeze.form.name.placeholder')}
            required
            fullWidth
          />
          <NumberInput
            label={t('subscription.freeze.form.days.label')}
            value={days}
            onChange={(ev) => setDays(parseInt(ev.target.value, 10))}
            required
            fullWidth
          />

          <Typography variant="h5" className={classes.marginTop}>
            {t('contractPause.form.paymentPackActions.title')}
          </Typography>

          <FormControl component="fieldset">
            <RadioGroup
              aria-label="subscription_pause"
              name="subscription_pause"
              value={packsType}
              onChange={(ev) => setPacksType(parseInt(ev.target.value))}
            >
              <FormControlLabel
                value={SubscriptionPause.PAUSE_PACK_NONE}
                control={<Radio />}
                label={t('contractPause.form.paymentPackActions.doNotChange')}
              />
              <FormControlLabel
                value={SubscriptionPause.PAUSE_PACK_EXTEND}
                control={<Radio />}
                label={t(
                  'contractPause.form.paymentPackActions.extendTillNextInvoice',
                )}
              />
              <FormControlLabel
                value={SubscriptionPause.PAUSE_PACK_DISABLE}
                control={<Radio />}
                label={t(
                  'contractPause.form.paymentPackActions.disableTillNextInvoice',
                )}
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onCancel} disabled={processing}>
            {t('subscription.freeze.form.cancel')}
          </Button>
          {processing ? (
            <CircularProgress />
          ) : (
            <Button
              type={onSubmit}
              disabled={!selectedInvoice || !days || !name}
              color="primary"
            >
              {t('subscription.freeze.form.submit')}
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing(1),
    backgroundColor: '#EFEFEF',
    borderRadius: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  label: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  marginTop: {
    marginTop: theme.spacing(1),
  },
}));

export default SubscriptionPauseFormDialog;
