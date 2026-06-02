import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import SlotCalendarToolBar from '#src/pages/marketplace/PrivateService/SlotSelectorPage/components/SlotCalendarToolBar';
import SlotCalendarDays from '#src/pages/marketplace/PrivateService/SlotSelectorPage/components/SlotCalendarDays';
import { SlotSelectorContext } from '#src/pages/marketplace/PrivateService/SlotSelectorPage/context/SlotSelector.context';
import { useSlotCalendarNavigation } from '#src/pages/marketplace/PrivateService/SlotSelectorPage/hooks';

const SlotCalendarReworked: React.FC = () => {
  const { selectedPrivateSlot } = useContext(SlotSelectorContext);

  const {
    shouldDisplayAvailableSlotFromPreviousWeeks,
    availableSlotFromPreviousWeeksLabel,
    isCalendarLoading,
    goToFirstAvailableSession,
  } = useSlotCalendarNavigation();

  const classes = useStyles({ disabled: !selectedPrivateSlot });

  return (
    <div className={classes.container}>
      <div
        className={classes.helperText}
        style={{
          visibility: shouldDisplayAvailableSlotFromPreviousWeeks
            ? 'visible'
            : 'hidden',
        }}
      >
        <ButtonBase onClick={goToFirstAvailableSession}>
          <Typography color="primary">
            {availableSlotFromPreviousWeeksLabel}
          </Typography>
        </ButtonBase>
      </div>
      <Paper className={classes.container2}>
        <SlotCalendarToolBar />
        <div className={classes.slotByDateContainer}>
          <SlotCalendarDays />
          {isCalendarLoading && (
            <div className={classes.loadingOverlay}>
              <CircularProgress />
            </div>
          )}
        </div>
      </Paper>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(1),
  },
  container2: ({ disabled }: { disabled: boolean }) => ({
    position: 'relative',
    display: 'flex',
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    marginTop: theme.spacing(1),
    background: disabled ? '#E8E8E8' : undefined,
  }),
  slotByDateContainer: {
    display: 'flex',
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    position: 'relative',
    minHeight: 250,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderRadius: 4,
    zIndex: 1,
  },
  helperText: {
    marginBottom: theme.spacing(2),
  },
}));

export default React.memo(SlotCalendarReworked);
