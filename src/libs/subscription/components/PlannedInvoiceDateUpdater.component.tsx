// @ts-nocheck
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import DatePicker from 'material-ui-pickers/DatePicker';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import moment from 'moment-timezone';
import MomentUtils from '@date-io/moment';
import { OptionCallback } from '../../../state/types';
import { PlannedInvoice } from '../types';

type Props = {
  plannedInvoice: PlannedInvoice;
  onSubmit: (
    data: { date: string; planned_invoice: number },
    options?: OptionCallback<any>,
  ) => void;
  onClose: () => void;
};

export const PlannedInvoiceDateUpdater = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['subscription']);
  const [date, setDate] = React.useState(props.plannedInvoice.date);
  const [processing, setProcessing] = React.useState(false);
  return (
    <Dialog open>
      <DialogTitle>{t('plannedInvoice.dateUpdater.title')}</DialogTitle>
      <DialogContent>
        <MuiPickersUtilsProvider
          locale={moment.locale()}
          moment={moment}
          utils={MomentUtils}
        >
          <DatePicker
            disablePast
            keyboard
            format="YYYY-MM-DD"
            maxDate={moment(props.plannedInvoice.date)
              .add(1, 'months')
              .add(-1, 'days')
              .format('YYYY-MM-DD')}
            minDate={moment(props.plannedInvoice.date)
              .add(-1, 'months')
              .add(1, 'days')
              .format('YYYY-MM-DD')}
            onChange={(value) => {
              const date_ = moment(value).format('YYYY-MM-DD');
              setDate(date_);
            }}
            returnMoment={false}
            value={date}
          />
        </MuiPickersUtilsProvider>
        <Typography className={classes.explain}>
          {t('plannedInvoice.dateUpdater.explain')}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button disabled={processing} onClick={props.onClose}>
          {t('plannedInvoice.dateUpdater.actions.cancel')}
        </Button>
        {processing ? (
          <CircularProgress />
        ) : (
          <Button
            onClick={() => {
              setProcessing(true);
              props.onSubmit(
                { planned_invoice: props.plannedInvoice.id, date },
                {
                  onSuccess: () => {
                    setProcessing(false);
                    props.onClose();
                  },
                  onError: () => {
                    setProcessing(false);
                  },
                },
              );
            }}
          >
            {t('plannedInvoice.dateUpdater.actions.submit')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {},
  explain: {
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(1),
  },
}));

export default PlannedInvoiceDateUpdater;
