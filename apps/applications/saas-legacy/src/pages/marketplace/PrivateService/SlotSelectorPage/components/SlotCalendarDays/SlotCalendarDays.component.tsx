import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import SlotCalendarDayReworked from '#src/pages/marketplace/PrivateService/SlotSelectorPage/components/SlotCalendarDayReworked';
import {
  usePrivateSlotSelection,
  useSlotCalendarNavigation,
} from '#src/pages/marketplace/PrivateService/SlotSelectorPage/hooks';

const SlotCalendarDays: React.FC = () => {
  const classes = useStyles();

  const { filteredAvailableSlots } = usePrivateSlotSelection();

  const { datesToDisplay } = useSlotCalendarNavigation();

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
  itemLayout: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      flexBasis: `${100 / 7}%`,
      maxWidth: `${100 / 7}%`,
      minWidth: `${100 / 7}%`,
    },
    [theme.breakpoints.down('sm')]: {
      flexBasis: '25%',
      maxWidth: '25%',
      minWidth: '25%',
    },
    [theme.breakpoints.down('xs')]: {
      flexBasis: '33%',
      maxWidth: '33%',
      minWidth: '33%',
    },
  },
}));

export default React.memo(SlotCalendarDays);
