import React from 'react';
import moment from 'moment-timezone';

import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import MomentUtils from '@date-io/moment';
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

  const [date, setDate] = React.useState<moment.Moment | null>(null);

  const handleSubmit = (ev: React.SyntheticEvent<HTMLElement>) => {
    ev.preventDefault();
    onSubmit(date.format('YYYY-MM-DD'), eventSlot);
  };

  const handleDateChange = (newDate: moment.Moment) => {
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
                  date_start: moment(eventSlot.startStr).format('HH:mm'),
                  date_end: moment(eventSlot.endStr).format('HH:mm'),
                  day: moment(eventSlot.startStr).format('dddd'),
                })}
            </Typography>
          </div>
          <Typography variant="subtitle2">
            {t('calendar.form.explain')}
          </Typography>
          <MuiPickersUtilsProvider
            utils={MomentUtils}
            moment={moment}
            locale={moment.locale()}
          >
            <DatePicker
              required
              keyboard
              value={date}
              disablePast
              format="L"
              onChange={handleDateChange}
              mask={(value) => {
                if (value) {
                  return [
                    /\d/,
                    /\d/,
                    '/',
                    /\d/,
                    /\d/,
                    '/',
                    /\d/,
                    /\d/,
                    /\d/,
                    /\d/,
                  ];
                }
                return [];
              }}
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
              <Button type="submit" color="primary">
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
