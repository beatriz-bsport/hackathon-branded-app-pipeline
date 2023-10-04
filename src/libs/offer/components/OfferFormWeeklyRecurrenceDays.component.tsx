import React, { useCallback, useMemo } from 'react';

import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import moment from 'moment-timezone';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';

import type { Theme } from '@material-ui/core';

import type {
  OfferFormValues,
  OfferFormRecurrenceWeekDay,
} from '#libs/offer/types';

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
    const { t } = useTranslation('datetime');

    const isoWeekDay = useMemo(() => {
      const isoweekday = moment()
        .tz(timezone)
        .startOf('week')
        .add(day, 'days')
        .isoWeekday();

      return isoweekday.toString() as OfferFormRecurrenceWeekDay;
    }, [day, timezone]);

    const recurrenceWeekDayState = recurrenceWeekDay[isoWeekDay];

    const handleToggleWeekday = useCallback(
      (weekDay: OfferFormRecurrenceWeekDay) => {
        setFieldValue('recurrenceWeekDay', {
          ...recurrenceWeekDay,
          [weekDay]: !recurrenceWeekDay[weekDay],
        });
      },
      [recurrenceWeekDay, setFieldValue],
    );

    const handleOnClick = useCallback(
      () => handleToggleWeekday(isoWeekDay),
      [handleToggleWeekday, isoWeekDay],
    );

    return (
      <Button
        key={day}
        disableElevation
        disableRipple
        className={classNames(
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
        {t(`time.isoWeekdayNumber.${isoWeekDay}`).slice(0, 3)}
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
