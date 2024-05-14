import React from 'react';
import { DateTime, Settings } from 'luxon';

import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import LuxonUtils from '@date-io/luxon';
import DatePicker from 'material-ui-pickers/DatePicker';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';
import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

type Props = {
  onSubmit: (
    date: string,
    eventSlot: { startStr: string; endStr: string },
  ) => void;
  onClose: () => void;
  mode: string;
  loading: boolean;
  open: boolean;
  eventSlot: {
    startStr: string;
    endStr: string;
  };
  fullScreen?: boolean;
};

export const RecurrentAvailabilityFormDialog: React.FC<Props> = ({
  onSubmit,
  onClose,
  mode,
  loading,
  open,
  eventSlot,
  fullScreen,
}) => {
  const classes = useStyles();

  const { t } = useTranslation('privateService');

  const [date, setDate] = React.useState<DateTime | null>(null);

  const handleSubmit = (ev: React.SyntheticEvent<HTMLElement>) => {
    ev.preventDefault();
    onSubmit(date.toISODate(), eventSlot);
  };

  const handleDateChange = (newDate: DateTime) => {
    setDate(newDate);
  };

  return (
    <Dialog fullScreen={!!fullScreen} open={!!open}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{t(`calendar.form.title.${mode}`)}</DialogTitle>
        <DialogContent>
          <div className={classes.content}>
            <Typography variant="subtitle2">
              {t('calendar.form.interval.explain1')}
            </Typography>
            <Typography>
              {eventSlot &&
                t('calendar.form.interval.explain2', {
                  date_start: DateTime.fromISO(eventSlot.startStr).toFormat(
                    'HH:mm',
                  ),
                  date_end: DateTime.fromISO(eventSlot.endStr).toFormat(
                    'HH:mm',
                  ),
                  day: DateTime.fromISO(eventSlot.startStr).toFormat('cccc'),
                })}
            </Typography>
          </div>
          <Typography variant="subtitle2">
            {t('calendar.form.explain')}
          </Typography>
          <MuiPickersUtilsProvider
            locale={Settings.defaultLocale}
            utils={LuxonUtils}
          >
            <DatePicker
              disablePast
              keyboard
              required
              format="D"
              onChange={handleDateChange}
              value={date}
            />
          </MuiPickersUtilsProvider>
        </DialogContent>
        <DialogActions>
          {loading ? (
            <CircularProgress />
          ) : (
            <React.Fragment>
              <Button onClick={onClose}>
                {t('calendar.form.actions.cancel')}
              </Button>
              <Button color="primary" type="submit">
                {t('calendar.form.actions.submit')}
              </Button>
            </React.Fragment>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  content: {
    marginBottom: theme.spacing(2),
  },
}));

export default RecurrentAvailabilityFormDialog;
