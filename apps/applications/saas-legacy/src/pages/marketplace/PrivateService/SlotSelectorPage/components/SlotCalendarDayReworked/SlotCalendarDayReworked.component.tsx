import React, { useContext, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { DateTime } from 'luxon';
import Typography from '@material-ui/core/Typography';
import { getAvailableDayTimeIntervals } from '#src/libs/private-service/interval-utils';
import DayTimeIntervalList from '#src/pages/marketplace/PrivateService/SlotSelectorPage/components/DayTimeIntervalList';
import type { ResourceSlots } from '#src/libs/private-service/types';
import { SlotSelectorContext } from '#src/pages/marketplace/PrivateService/SlotSelectorPage/context/SlotSelector.context';

type Props = {
  isoDate: string;
  ressourceSlots: ResourceSlots[];
};

const SlotCalendarDayReworked: React.FC<Props> = ({
  isoDate,
  ressourceSlots,
}) => {
  const classes = useStyles();

  const dateTime = DateTime.fromISO(isoDate);

  const { selectedPrivateSlot } = useContext(SlotSelectorContext);

  const availableSlots = useMemo(
    () => ressourceSlots?.flatMap((ressourceSlot) => ressourceSlot.slots) ?? [],
    [ressourceSlots],
  );

  const availableDayTimeIntervals = getAvailableDayTimeIntervals(
    isoDate,
    availableSlots,
    selectedPrivateSlot?.duration_minutes ?? 0,
  );

  return (
    <div className={classes.container}>
      <div className={classes.dateContainer}>
        <Typography variant="subtitle1">{dateTime.weekdayLong}</Typography>
        <Typography color="textSecondary" variant="subtitle2">
          {`${dateTime.monthShort} ${dateTime.day}`}
        </Typography>
      </div>
      <DayTimeIntervalList
        availableDayTimeIntervals={availableDayTimeIntervals}
      />
    </div>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
  dateContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

export default React.memo(SlotCalendarDayReworked);
