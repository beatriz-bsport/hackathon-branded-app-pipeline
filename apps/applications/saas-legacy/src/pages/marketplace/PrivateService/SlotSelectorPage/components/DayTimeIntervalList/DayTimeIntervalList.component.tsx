import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Interval } from 'luxon';
import { Typography } from '@material-ui/core';
import DayTimeIntervalButton from '#src/pages/marketplace/PrivateService/SlotSelectorPage/components/DayTimeIntervalButton';
import { DayTimeIntervals } from '#src/libs/private-service/constants';

type Props = {
  availableDayTimeIntervals: Record<DayTimeIntervals, Interval>;
};

const DayTimeIntervalList: React.FC<Props> = React.memo(
  ({ availableDayTimeIntervals }) => {
    const classes = useStyles();

    const memoizedAvailableDayTimeIntervals = useMemo(
      () => Object.entries(availableDayTimeIntervals),
      [availableDayTimeIntervals],
    );

    const hasNoAvailableDayTimeSegments =
      !memoizedAvailableDayTimeIntervals?.length;

    if (hasNoAvailableDayTimeSegments) {
      return (
        <div className={classes.centerView}>
          <Typography component="p" variant="h5">
            -
          </Typography>
        </div>
      );
    }
    return (
      <>
        {memoizedAvailableDayTimeIntervals.map(
          ([availableDayTimeSegment, dayTimeInterval]) => (
            <div
              key={dayTimeInterval.toString()}
              className={classes.dayTimeIntervalContainer}
            >
              <DayTimeIntervalButton
                availableDayTimeSegment={
                  availableDayTimeSegment as DayTimeIntervals
                }
                dayTimeInterval={dayTimeInterval}
              />
            </div>
          ),
        )}
      </>
    );
  },
);

const useStyles = makeStyles((theme) => ({
  centerView: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  dayTimeIntervalContainer: {
    display: 'flex',
    padding: theme.spacing(1),
  },
}));

export default React.memo(DayTimeIntervalList);
