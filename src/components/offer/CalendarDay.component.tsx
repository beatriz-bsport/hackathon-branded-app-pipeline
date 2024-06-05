import React from 'react';
import classNames from 'classnames';
import { DateTime, Info } from 'luxon';
import { pure } from 'recompose';
import chroma from 'chroma-js';

import { makeStyles, Theme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';

import type { LuxonDateTime } from '#src/types';
import { WEEKMODE } from './Calendar.component';

type Props = {
  dateSelected: LuxonDateTime;
  ranges?: [string, string][];
  day: LuxonDateTime;
  events?: { [key: string]: Array<any> };
  showDayName: boolean;
  displayMode: number;
  previewOnly?: boolean;
  wrapperStyle?: string;
  activeWrapperStyle?: string;
  onDateChange: (value: string) => void;
};

export const CalendarDay: React.FC<Props> = ({
  events = {},
  ranges = [], // list of tuples of ISO strings
  dateSelected,
  day,
  showDayName,
  displayMode,
  previewOnly,
  wrapperStyle,
  activeWrapperStyle,
  onDateChange,
}) => {
  const isDayInRangeOf = ranges.filter(([start, end]) => {
    const startDatetime = DateTime.fromISO(start);
    const endDatetime = DateTime.fromISO(end);
    return day <= endDatetime && day >= startDatetime;
  });

  const isDayInRange = isDayInRangeOf?.length > 0 ?? false;
  const classes = useStyles(isDayInRangeOf?.length ?? 0)();

  const isDisabled = !day.hasSame(dateSelected, 'month');
  const isSelected = day.hasSame(dateSelected, 'day');

  const isFirstDayOfRange =
    isDayInRange &&
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ranges.some(([start, end]) => DateTime.fromISO(start).hasSame(day, 'day'));

  const isLastDayOfRange =
    isDayInRange &&
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ranges.some(([start, end]) => DateTime.fromISO(end).hasSame(day, 'day'));

  if (previewOnly && wrapperStyle) {
    return (
      <div className={classes.dayButtonPreview}>
        {!isDisabled && (
          <div
            className={classNames(wrapperStyle, {
              [activeWrapperStyle]: events?.[day.startOf('day').toString()],
            })}
          >
            {displayMode === WEEKMODE && showDayName
              ? Info.weekdays('narrow')[day.weekday - 1]
              : null}
            <Typography color="inherit" variant="subtitle1">
              {day.day}
            </Typography>
          </div>
        )}
      </div>
    );
  }

  return (
    <ButtonBase
      key={`calendar-day-${day.toISODate()}`}
      className={classNames(classes.dayButton, {
        [classes.dayButtonSelected]: isSelected,
        [classes.dayButtonDisabled]: isDisabled,
        [classes.dayButonInRange]: isDayInRange,
        [classes.dayButonStartRange]: isFirstDayOfRange,
        [classes.dayButonEndRange]: isLastDayOfRange,
      })}
      color="primary"
      id={`calendar-day-${day.toISODate()}`}
      onClick={() => {
        onDateChange(day.toISODate());
      }}
    >
      <div />
      <div className={classes.wrapper}>
        {displayMode === WEEKMODE && showDayName
          ? Info.weekdays('narrow')[day.weekday - 1].toUpperCase()
          : null}
        <Typography color="inherit" variant="subtitle1">
          {day.day}
        </Typography>
        <div className={classes.dots}>
          <div className={classes.row}>
            {(events?.[day.startOf('day').toISO()] ?? [])
              .slice(0, 3)
              .map((_, idx) => (
                <div key={`${day.toISODate()}-${idx}`}> • </div>
              ))}
          </div>
        </div>
      </div>
    </ButtonBase>
  );
};

const useStyles = (inRangeOf: number) =>
  makeStyles((theme: Theme) => {
    const backgroundColor = chroma(theme.palette.primary.main)
      .alpha(inRangeOf * 0.4)
      .hex();
    const color =
      chroma.contrast(backgroundColor, '#000') > 10 ? '#000' : '#fff';

    return {
      dayButtonPreview: {
        display: 'flex',
        flexGrow: 1,
        flexBasis: 0,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: theme.spacing(1),
      },
      dayButton: {
        padding: theme.spacing(1),
        display: 'flex',
        flexGrow: 1,
        flexBasis: 0,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: theme.spacing(1),
      },
      dayButtonSelected: {
        color: 'primary',
        border: `1px solid ${theme.palette.primary.main}`,
        marginTop: -1,
        marginLeft: -1,
        marginRight: -1,
        marginBottom: -1,
      },
      dayButtonDisabled: {
        color: 'gray',
      },
      dots: {
        height: 5,
        marginBottom: theme.spacing(1),
      },
      row: {
        display: 'flex',
        flexDirection: 'row',
      },
      wrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      },
      dayButonInRange:
        inRangeOf > 1
          ? {
              backgroundColor: chroma(theme.palette.primary.main)
                .alpha((inRangeOf - 1) * 0.4)
                .hex(),
              position: 'relative',
              color,
              borderRadius: 0,
              '&::before': {
                content: '""',
                position: 'absolute',
                left: '0',
                top: '0',
                width: '100%',
                height: '100%',
                backgroundColor: chroma(theme.palette.primary.main)
                  .alpha(0.4)
                  .hex(),
              },
            }
          : {
              borderRadius: 0,
              border: 'none',
              backgroundColor,
              color,
            },
      dayButonStartRange:
        inRangeOf > 1
          ? {
              backgroundColor: chroma(theme.palette.primary.main)
                .alpha((inRangeOf - 1) * 0.4)
                .hex(),
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                left: '0',
                top: '0',
                width: '100%',
                height: '100%',
                borderTopLeftRadius: theme.spacing(4),
                borderBottomLeftRadius: theme.spacing(4),
                backgroundColor: chroma(theme.palette.primary.main)
                  .alpha(0.4)
                  .hex(),
              },
            }
          : {
              borderTopLeftRadius: theme.spacing(4),
              borderBottomLeftRadius: theme.spacing(4),
            },
      dayButonEndRange:
        inRangeOf > 1
          ? {
              backgroundColor: chroma(theme.palette.primary.main)
                .alpha((inRangeOf - 1) * 0.4)
                .hex(),
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                left: '0',
                top: '0',
                width: '100%',
                height: '100%',
                borderTopRightRadius: theme.spacing(4),
                borderBottomRightRadius: theme.spacing(4),
                backgroundColor: chroma(theme.palette.primary.main)
                  .alpha(0.4)
                  .hex(),
              },
            }
          : {
              borderTopRightRadius: theme.spacing(4),
              borderBottomRightRadius: theme.spacing(4),
            },
    };
  });

export default pure(CalendarDay);
