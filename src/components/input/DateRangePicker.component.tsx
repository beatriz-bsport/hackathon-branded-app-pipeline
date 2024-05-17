import React, { useCallback, useState } from 'react';
import { BasePicker, Calendar } from 'material-ui-pickers';
import { DateTime, Interval } from 'luxon';
import { makeStyles } from '@material-ui/core';
import classNames from 'classnames';
import chroma from 'chroma-js';

import { getTextColorFromRGB } from '../../utils/color';

interface Props {
  startDate: string;
  onRangeChange: (startDate: string, endDate: string) => void;
}

const DateRangePicker: React.FC<Props> = (props) => {
  const [date] = useState(DateTime.now());
  const [activeDate, setActiveDate] = useState<DateTime | undefined>(
    DateTime.fromISO(props.startDate),
  );

  const [dates, setDates] = useState<Array<string>>([props.startDate]);

  const onDateChange = (d: DateTime) => {
    const dateStr = d.toISODate();

    let _dates = [...dates, dateStr];
    if (dates.length === 2) {
      _dates = [dateStr];
    }

    const datetimes = [DateTime.fromISO(_dates[0])];
    _dates[1] && datetimes.push(DateTime.fromISO(_dates[1]));

    const min = DateTime.min(...datetimes).toISODate();
    const max = DateTime.max(...datetimes).toISODate();

    setDates(_dates);
    props.onRangeChange(min, max);
  };

  const classes = useStyles();

  const renderDay = useCallback(
    (d: DateTime, selectedDate: DateTime, dayInCurrentMonth: boolean) => {
      if (!dayInCurrentMonth) {
        return <div className={classes.day} />;
      }

      const datetimes = dates.map((da) => DateTime.fromISO(da));
      datetimes.length === 1 && activeDate && datetimes.push(activeDate);

      const min = DateTime.min(...datetimes);
      const max = DateTime.max(...datetimes);

      const dateStr = d.toISODate();

      const isStart = min && dateStr === min.toISODate();
      const isEnd = max && dateStr === max.toISODate();
      const isBetween =
        min && max && Interval.fromDateTimes(min, max).contains(d);

      const isSunday = d.weekday === 7;
      const isSaturday = d.weekday === 6;

      const dayClasses = classNames({
        [classes.day]: true,
        [classes.startDate]: isStart || (isSunday && isBetween),
        [classes.endDate]: isEnd || (isSaturday && isBetween),
        [classes.betweenDate]: isBetween,
        [classes.onActive]: !isStart && !isEnd && !isBetween,
      });

      return (
        <div className={dayClasses} onMouseEnter={() => setActiveDate(d)}>
          {d.toFormat('MM')}
        </div>
      );
    },
    [classes, activeDate, dates],
  );

  return (
    // @ts-expect-error
    <BasePicker>
      {() => (
        // @ts-expect-error
        <Calendar date={date} onChange={onDateChange} renderDay={renderDay} />
      )}
    </BasePicker>
  );
};

const useStyles = makeStyles((theme) => ({
  day: {
    width: 40,
    height: 36,
    margin: '1px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  betweenDate: {
    backgroundColor: theme.palette.primary.main,
    color: getTextColorFromRGB(chroma(theme.palette.primary.main).rgb()),
  },
  startDate: {
    backgroundColor: theme.palette.primary.main,
    color: getTextColorFromRGB(chroma(theme.palette.primary.main).rgb()),
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
  },
  endDate: {
    backgroundColor: theme.palette.primary.main,
    color: getTextColorFromRGB(chroma(theme.palette.primary.main).rgb()),
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
  },
  onActive: {
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: getTextColorFromRGB(chroma(theme.palette.primary.main).rgb()),
      borderRadius: 50,
    },
  },
}));

export default DateRangePicker;
