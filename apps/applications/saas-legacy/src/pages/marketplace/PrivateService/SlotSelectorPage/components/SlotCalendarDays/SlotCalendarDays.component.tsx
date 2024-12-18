import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import SlotCalendarDayReworked from '#src/pages/marketplace/PrivateService/SlotSelectorPage/components/SlotCalendarDayReworked';
import {
  usePrivateSlotSelection,
  useSlotCalendarNavigation,
} from '#src/pages/marketplace/PrivateService/SlotSelectorPage/hooks';

import { SlotSelectorContext } from '#src/pages/marketplace/PrivateService/SlotSelectorPage/context/SlotSelector.context';

const SlotCalendarDays: React.FC = () => {
  const { selectedPrivateSlot } = useContext(SlotSelectorContext);

  const classes = useStyles({ disabled: !selectedPrivateSlot });

  const { filteredAvailableSlots } = usePrivateSlotSelection();

  const { isCalendarLoading, datesToDisplay } = useSlotCalendarNavigation();

  if (isCalendarLoading) {
    return (
      <div className={classes.loadingContainer}>
        <CircularProgress />
      </div>
    );
  }
  return (
    <>
      {datesToDisplay.map((date) => {
        const isoDate = date.toISODate();
        const ressourceSlots = filteredAvailableSlots[isoDate];
        return (
          <div key={isoDate} className={classes.itemLayout}>
            <SlotCalendarDayReworked
              isoDate={isoDate}
              ressourceSlots={ressourceSlots}
            />
          </div>
        );
      })}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
    width: '100%',
  },
  itemLayout: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      flexBasis: `${100 / 7}%`,
      maxWidth: `${100 / 7}%`,
      minWidth: `${100 / 7}%`,
    },
    [theme.breakpoints.down('sm')]: {
      flexBasis: '33%',
      maxWidth: '33%',
      minWidth: '33%',
    },
    [theme.breakpoints.down('xs')]: {
      flexBasis: '50%',
      maxWidth: '50%',
      minWidth: '50%',
    },
  },
}));

export default React.memo(SlotCalendarDays);
