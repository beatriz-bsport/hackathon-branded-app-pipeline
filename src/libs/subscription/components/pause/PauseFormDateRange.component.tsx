import React from 'react';
import { useTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import moment, { Moment } from 'moment-timezone';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Typography } from '@material-ui/core';
import DateInput from '#components/input/DateInput.component';

type Props = {
  dateStart: string;
  dateEnd: string;
  isDateRangeValid: boolean;
  setDateStart: (date: string) => void;
  setDateEnd: (date: string) => void;
};

export const PauseFormDateRange = (props: Props) => {
  const { t } = useTranslation('subscription');
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <DateInput
        value={moment(props.dateStart)}
        onChange={(value: Moment) =>
          !!props.setDateStart && props.setDateStart(value.format())
        }
        label={t('pause.dialogs.form.duration.start')}
        className={classes.dateInput}
        minDate={moment()}
        disabled={!props.setDateStart}
      />
      <DateInput
        value={moment(props.dateEnd)}
        onChange={(value: Moment) => props.setDateEnd(value.format())}
        label={t('pause.dialogs.form.duration.end')}
        className={classes.dateInput}
        minDate={moment()}
        error={!props.isDateRangeValid}
      />
      {!props.isDateRangeValid && (
        <Typography color="error" variant="caption">
          {t('pause.dialogs.form.duration.warning')}
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
