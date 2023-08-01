import React from 'react';
import { useTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import moment, { Moment } from 'moment-timezone';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Typography } from '@material-ui/core';
import DateInput from '#components/input/DateInput.component';

type Props = {
  fromDate: string;
  untilDate: string;
  isDateRangeValid: boolean;
  setFromDate: (date: string) => void;
  setUntilDate: (date: string) => void;
};

export const PauseFormDateRange = (props: Props) => {
  const { t } = useTranslation('subscription');
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <DateInput
        className={classes.dateInput}
        disabled={!props.setFromDate}
        label={t('pauseV2.common.form.duration.start')}
        minDate={moment()}
        onChange={(value: Moment) => {
          !!props.setFromDate && props.setFromDate(value.format());
          if (value.isAfter(props.untilDate))
            props.setUntilDate(value.format());
        }}
        value={moment(props.fromDate)}
      />
      <DateInput
        className={classes.dateInput}
        error={!props.isDateRangeValid}
        label={t('pauseV2.common.form.duration.end')}
        minDate={moment()}
        onChange={(value: Moment) => {
          props.setUntilDate(value.format());
          if (value.isBefore(props.fromDate) && !!props.setFromDate)
            props.setFromDate(value.format());
        }}
        value={moment(props.untilDate)}
      />
      {!props.isDateRangeValid && (
        <Typography color="error" variant="caption">
          {t('pauseV2.common.form.duration.warning')}
        </Typography>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  dateInput: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
}));

export default PauseFormDateRange;
