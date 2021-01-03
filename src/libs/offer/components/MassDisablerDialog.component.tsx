// @flow
import React from 'react';
import { compose, withState } from 'recompose';
import moment from 'moment-timezone';

import { useTranslation } from 'react-i18next';
import {
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@material-ui/core';

import DateRangePicker from '../../../components/input/DateRangePicker.component';
import { OptionCallback } from '../../../state/types';

type Props = {
  startDate: string;
  endDate: string;
  setStartDate: (startDate: string) => void;
  setEndDate: (endDate: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  onClose: () => void;
  onSubmit: (
    date: { start: string; end: string },
    callback?: OptionCallback,
  ) => void;
  secondWarningOpen: boolean;
  setSecondWarningOpen: (warning: boolean) => void;
};

export const MassDisablerDialog = (props: Props) => {
  const { t } = useTranslation(['offer']);
  const { startDate, endDate } = props;
  return (
    <>
      <Dialog open>
        <DialogTitle>{t('massDisabler.title')}</DialogTitle>
        <DialogContent>
          <Typography>{t('massDisabler.explain')}</Typography>
          <Typography color="error">
            {t('massDisabler.explainWarning')}
          </Typography>

          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onRangeChange={(startDate_: string, endDate_: string) => {
              props.setStartDate(startDate_);
              props.setEndDate(endDate_);
            }}
          />
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
                  props.setSecondWarningOpen(true);
                }}
              >
                {t('massDisabler.actions.continue')}
              </Button>
            </React.Fragment>
          )}
        </DialogActions>
      </Dialog>
      <Dialog open={props.secondWarningOpen}>
        <DialogTitle>{t('massDisabler.title')}</DialogTitle>
        <DialogContent>
          <Typography>{t('massDisabler.secondWarningConfirm')}</Typography>
          <Typography color="error">
            {t('massDisabler.secondWarning')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <>
            <Button
              onClick={() => {
                props.setSecondWarningOpen(false);
                props.onClose();
              }}
            >
              {t('massDisabler.actions.cancel')}
            </Button>
            <Button
              onClick={() => {
                props.setLoading(true);
                props.onSubmit({
                  start: moment(props.startDate).format('YYYY-MM-DD'),
                  end: moment(props.endDate).format('YYYY-MM-DD'),
                });
                props.setLoading(false);
                props.setSecondWarningOpen(false);
                props.onClose();
              }}
            >
              {t('massDisabler.actions.submit')}
            </Button>
          </>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default compose(
  withState('loading', 'setLoading', false),
  withState('startDate', 'setStartDate', (props: { startDate: string }) =>
    props.startDate
      ? props.startDate
      : moment(props.startDate).format('YYYY-MM-DD'),
  ),
  withState('endDate', 'setEndDate', (props: { endDate: string }) =>
    props.endDate ? moment(props.endDate) : moment(),
  ),
  withState('secondWarningOpen', 'setSecondWarningOpen', false),
)(MassDisablerDialog);
