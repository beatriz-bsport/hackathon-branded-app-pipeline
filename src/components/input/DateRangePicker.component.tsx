import React, { useCallback, useState } from 'react';
import {
  BasePicker,
  Calendar,
  MuiPickersUtilsProvider,
} from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment-timezone';
import { makeStyles } from '@material-ui/core';
import classNames from 'classnames';
import { Moment } from 'moment';
import chroma from 'chroma-js';

import { getTextColorFromRGB } from '../../utils/color';

interface Props {
  startDate: string;
  endDate: string;
  onRangeChange: (startDate: string, endDate: string) => void;
}

const DateRangePicker: React.FC<Props> = (props) => {
  const [date] = useState(moment());
  const [activeDate, setActiveDate] = useState<Moment | undefined>(
    moment(props.startDate),
  );

  const [dates, setDates] = useState<Array<string>>([props.startDate]);

  const onDateChange = (d: Moment) => {
    const dateStr = d.format('YYYY-MM-DD');

    let _dates = [...dates, dateStr];
    if (dates.length === 2) {
      _dates = [dateStr];
    }

    const momentDates = [moment(_dates[0])];
    _dates[1] && momentDates.push(moment(_dates[1]));

    const min = moment.min(momentDates).format('YYYY-MM-DD');
    const max = moment.max(momentDates).format('YYYY-MM-DD');

    setDates(_dates);
    props.onRangeChange(min, max);
  };

  const classes = useStyles();

  const renderDay = useCallback(
    (d, selectedDate: Moment, dayInCurrentMonth: boolean) => {
      if (!dayInCurrentMonth) {
        return <div className={classes.day} />;
      }

      const momentDates = dates.map((da) => moment(da));
      momentDates.length === 1 && activeDate && momentDates.push(activeDate);

      const min = moment.min(momentDates);
      const max = moment.max(momentDates);

      const dateStr = d.format('YYYY-MM-DD');

      const isStart = min && dateStr === min.format('YYYY-MM-DD');
      const isEnd = max && dateStr === max.format('YYYY-MM-DD');
      const isBetween = min && max && d.isBetween(min, max);

      const endOfWeek = moment().endOf('week').isoWeekday();

      const isSunday = d.day() === (1 + endOfWeek) % 7;
      const isSaturday = d.day() === (7 + endOfWeek) % 7;

      const dayClasses = classNames({
        [classes.day]: true,
        [classes.startDate]: isStart || (isSunday && isBetween),
        [classes.endDate]: isEnd || (isSaturday && isBetween),
        [classes.betweenDate]: isBetween,
        [classes.onActive]: !isStart && !isEnd && !isBetween,
      });

      return (
        <div onMouseEnter={() => setActiveDate(d)} className={dayClasses}>
          {d.format('DD')}
        </div>
      );
    },
    [classes, props.startDate, props.endDate, activeDate, dates],
  );

  return (
    <MuiPickersUtilsProvider
      utils={MomentUtils}
      moment={moment}
      locale={moment.locale()}
    >
      <BasePicker>
        {() => (
          <Calendar date={date} onChange={onDateChange} renderDay={renderDay} />
        )}
      </BasePicker>
    </MuiPickersUtilsProvider>
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
