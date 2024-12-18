import React from 'react';
import { useTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import { DateTime } from 'luxon';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Typography } from '@material-ui/core';
import DateInput from '#src/components/input/DateInput.component';

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
        format="D"
        label={t('pauseV2.common.form.duration.start')}
        minDate={DateTime.now()}
        onChange={(value: DateTime) => {
          !!props.setFromDate && props.setFromDate(value.toISO());
          if (value > DateTime.fromISO(props.untilDate))
            props.setUntilDate(value.toISO());
        }}
        value={DateTime.fromISO(props.fromDate)}
      />
      <DateInput
        className={classes.dateInput}
        error={!props.isDateRangeValid}
        format="D"
        label={t('pauseV2.common.form.duration.end')}
        minDate={DateTime.now()}
        onChange={(value: DateTime) => {
          props.setUntilDate(value.toISO());
          if (value < DateTime.fromISO(props.fromDate) && !!props.setFromDate)
            props.setFromDate(value.toISO());
        }}
        value={DateTime.fromISO(props.untilDate)}
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
