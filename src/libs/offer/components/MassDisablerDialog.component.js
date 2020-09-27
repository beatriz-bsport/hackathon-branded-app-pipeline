// @flow
import React from 'react';
import { compose, withState } from 'recompose';
import moment from 'moment-timezone';

import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import MomentUtils from '@date-io/moment';
import Typography from '@material-ui/core/Typography';

import {
  MuiPickersUtilsProvider,
  Calendar,
  BasePicker,
} from 'material-ui-pickers';

import { makeStyles } from '@material-ui/core/styles';

type Props = {
  startDate: string,
  endDate: string,
  setStartDate: (string) => void,
  setEndDate: (string) => void,

  loading: boolean,
  setLoading: (boolean) => void,

  onClose: () => void,
  onSubmit: ({ start: string, end: string }, OptionCallback) => void,
};

export const MassDisablerDialog = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['offer']);
  const { startDate, endDate } = props;
  return (
    <Dialog open>
      <DialogTitle>{t('massDisabler.title')}</DialogTitle>
      <DialogContent>
        <Typography>{t('massDisabler.explain')}</Typography>
        <Typography color="error">
          {t('massDisabler.explainWarning')}
        </Typography>

        <MuiPickersUtilsProvider
          utils={MomentUtils}
          moment={moment}
          locale={moment.locale()}
        >
          <div className={classes.calendarsContainer}>
            <BasePicker disabled={props.loading}>
              {() => (
                <div className={classes.picker}>
                  <Calendar
                    disabled={props.loading}
                    autoOk
                    date={moment(startDate, 'YYYY-MM-DD')}
                    maxDate={moment(endDate, 'YYYY-MM-DD').add(-1, 'days')}
                    onChange={(ev) =>
                      props.setStartDate(ev.format('YYYY-MM-DD'))
                    }
                  />
                </div>
              )}
            </BasePicker>
            <BasePicker disabled={props.loading}>
              {() => (
                <div className={classes.picker}>
                  <Calendar
                    disabled={props.loading}
                    minDate={moment(startDate, 'YYYY-MM-DD').add(1, 'days')}
                    date={moment(endDate, 'YYYY-MM-DD')}
                    onChange={(ev) => props.setEndDate(ev.format('YYYY-MM-DD'))}
                  />
                </div>
              )}
            </BasePicker>
          </div>
        </MuiPickersUtilsProvider>
      </DialogContent>
      <DialogActions>
        {props.loading ? (
          <React.Fragment>
            <Typography variant="caption">
              {t('massDisabler.explainLoading')}
            </Typography>
            <CircularProgress />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Button onClick={props.onClose}>
              {t('massDisabler.actions.cancel')}
            </Button>
            <Button
              onClick={() => {
                props.setLoading(true);
                props.onSubmit(
                  { start: props.startDate, end: props.endDate },
                  {
                    onSuccess: () => {
                      props.setLoading(false);
                      props.onClose();
                    },
                    onError: () => {
                      props.setLoading(false);
                    },
                  },
                );
              }}
            >
              {t('massDisabler.actions.submit')}
            </Button>
          </React.Fragment>
        )}
      </DialogActions>
    </Dialog>
  );
};

const useStyles = makeStyles(() => ({
  container: {},
}));

export default compose(
  withState('loading', 'setLoading', false),
  withState(
    'startDate',
    'setStartDate',
    ({ startDate }) => startDate || moment().format('YYYY-MM-DD'),
  ),
  withState(
    'endDate',
    'setEndDate',
    ({ endDate }) =>
      endDate ||
      moment()
        .add(1, 'days')
        .format('YYYY-MM-DD'),
  ),
)(MassDisablerDialog);
