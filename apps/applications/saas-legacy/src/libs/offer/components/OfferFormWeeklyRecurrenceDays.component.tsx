import React, { useCallback, useMemo } from 'react';

import { useFormikContext } from 'formik';
import Button from '@material-ui/core/Button';
import { DateTime } from 'luxon';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';

import type { Theme } from '@material-ui/core';

import type {
  OfferFormValues,
  OfferFormRecurrenceWeekDay,
} from '#src/libs/offer/types';

type Props = {
  id?: string;
  timezone?: string;
};

type WeekDayButtonProps = {
  day: WeekDay;
  timezone: string;
};

type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const WEEK_DAYS: WeekDay[] = [0, 1, 2, 3, 4, 5, 6];

const WeekDayButton: React.FC<WeekDayButtonProps> = React.memo(
  ({ day, timezone }) => {
    const classes = useStyles();
    const { values, setFieldValue } = useFormikContext<OfferFormValues>();
    const { recurrenceWeekDay } = values;

    const getWeekdayAsString = (datetime: DateTime) =>
      datetime.weekday.toString() as OfferFormRecurrenceWeekDay;

    const datetime = useMemo(() => {
      return DateTime.now()
        .setZone(timezone)
        .startOf('week', { useLocaleWeeks: true })
        .plus({ day });
    }, [day, timezone]);

    const recurrenceWeekDayState =
      recurrenceWeekDay[getWeekdayAsString(datetime)];

    const handleToggleWeekday = useCallback(
      (value: DateTime) => {
        setFieldValue('recurrenceWeekDay', {
          ...recurrenceWeekDay,
          [getWeekdayAsString(value)]:
            !recurrenceWeekDay[getWeekdayAsString(value)],
        });
      },
      [recurrenceWeekDay, setFieldValue],
    );

    const handleOnClick = useCallback(
      () => handleToggleWeekday(datetime),
      [handleToggleWeekday, datetime],
    );

    return (
      <Button
        key={day}
        disableElevation
        disableRipple
        className={clsx(
          classes.buttonBase,
          {
            [classes.activeWeekDayButton]: recurrenceWeekDayState,
          },
          {
            [classes.weekDayButton]: !recurrenceWeekDayState,
          },
        )}
        onClick={handleOnClick}
        variant="contained"
      >
        {datetime.weekdayShort.replace('.', '')}
      </Button>
    );
  },
);

const OfferFormWeeklyRecurrenceDays: React.FC<Props> = ({ id, timezone }) => {
  const classes = useStyles();

  const weekDaysButtons = useMemo(() => {
    return WEEK_DAYS.map((day: WeekDay) => (
      <WeekDayButton key={day} day={day} timezone={timezone} />
    ));
  }, [timezone]);

  return (
    <div className={classes.weekDaysContainer} id={id}>
      {weekDaysButtons}
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  weekDaysContainer: {
    display: 'flex',
    flexFlow: 'wrap',
    gap: theme.spacing(1),
  },
  activeWeekDayButton: {
    background: `${theme.palette.primary.main}1a`,
    border: `1px solid ${theme.palette.primary.main}`,
  },
  weekDayButton: {
    background: theme.palette.grey[200],
  },
  buttonBase: {
    minWidth: 'inherit',
    textTransform: 'capitalize',
    borderRadius: theme.spacing(3),
    fontWeight: 400,
  },
}));

export default React.memo(OfferFormWeeklyRecurrenceDays);
