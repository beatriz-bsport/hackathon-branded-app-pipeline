import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import { DatePicker, MuiPickersUtilsProvider } from 'material-ui-pickers';
import { Settings, DateTime } from 'luxon';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { LocalizedLuxonUtils } from '#src/i18n/utils/luxon-picker-utils';
import { OptionCallback } from '../../../state/types';
import { PlannedInvoice } from '../types';
import { PLANNED_INVOICE_TIME_CONFIGURATION } from '../constants';
import { LuxonDateTime } from '#src/types';

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

  const handleDateChange = useCallback((value: LuxonDateTime) => {
    const date_ = value.set(PLANNED_INVOICE_TIME_CONFIGURATION).toISODate();
    setDate(date_);
  }, []);

  return (
    <Dialog open>
      <DialogTitle>{t('plannedInvoice.dateUpdater.title')}</DialogTitle>
      <DialogContent>
        <MuiPickersUtilsProvider
          locale={Settings.defaultLocale}
          utils={LocalizedLuxonUtils}
        >
          <DatePicker
            disablePast
            keyboard
            format="D"
            maxDate={DateTime.fromISO(props.plannedInvoice.date)
              .plus({ months: 1 })
              .minus({ days: 1 })
              .toISODate()}
            minDate={DateTime.fromISO(props.plannedInvoice.date)
              .plus({ months: -1 })
              .minus({ days: 1 })
              .toISODate()}
            onChange={handleDateChange}
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
