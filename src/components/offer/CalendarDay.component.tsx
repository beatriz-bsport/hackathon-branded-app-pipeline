// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import moment, { Moment } from 'moment-timezone';
import { pure } from 'recompose';
import chroma from 'chroma-js';

import { makeStyles, Theme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';

import { DATE_FORMAT } from '../../utils/datetime';
import { WEEKMODE } from './Calendar.component';

type Props = {
  dateSelected: Moment;
  ranges?: [string, string][];
  day: Moment;
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
  ranges = [],
  dateSelected,
  day,
  showDayName,
  displayMode,
  previewOnly,
  wrapperStyle,
  activeWrapperStyle,
  onDateChange,
}) => {
  const isDayInRangeOf = ranges.filter(
    ([start, end]) =>
      moment(day).isSameOrBefore(end) && moment(day).isSameOrAfter(start),
  );
  const isDayInRange = isDayInRangeOf?.length > 0 ?? false;
  const classes = useStyles(isDayInRangeOf?.length ?? 0)();

  const isDisabled = !day.isSame(dateSelected, 'months');
  const isSelected = day.isSame(dateSelected, 'days');

  const isFirstDayOfRange =
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isDayInRange && ranges.some(([start, end]) => moment(start).isSame(day));

  const isLastDayOfRange =
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isDayInRange && ranges.some(([start, end]) => moment(end).isSame(day));

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
              ? moment.weekdaysShort(true)?.[day.weekday()]?.[0]
              : null}
            <Typography color="inherit" variant="subtitle1">
              {day.date()}
            </Typography>
          </div>
        )}
      </div>
    );
  }

  return (
    <ButtonBase
      key={`calendar-day-${day.format(DATE_FORMAT)}`}
      id={`calendar-day-${day.format(DATE_FORMAT)}`}
      className={classNames(classes.dayButton, {
        [classes.dayButtonSelected]: isSelected,
        [classes.dayButtonDisabled]: isDisabled,
        [classes.dayButonInRange]: isDayInRange,
        [classes.dayButonStartRange]: isFirstDayOfRange,
        [classes.dayButonEndRange]: isLastDayOfRange,
      })}
      color="primary"
      onClick={() => {
        onDateChange(day.format(DATE_FORMAT));
      }}
    >
      <div />
      <div className={classes.wrapper}>
        {displayMode === WEEKMODE && showDayName
          ? moment.weekdaysShort(true)?.[day.weekday()]?.[0]
          : null}
        <Typography color="inherit" variant="subtitle1">
          {day.date()}
        </Typography>
        <div className={classes.dots}>
          <div className={classes.row}>
            {(events?.[day.startOf('day')] ?? []).slice(0, 3).map((_, idx) => (
              <div key={`${day.format(DATE_FORMAT)}-${idx}`}> • </div>
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
