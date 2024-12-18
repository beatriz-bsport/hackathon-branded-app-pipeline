import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Paper from '@material-ui/core/Paper';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import WarningIcon from '@material-ui/icons/Warning';
import SlotCalendarToolBar from '#src/pages/marketplace/PrivateService/SlotSelectorPage/components/SlotCalendarToolBar';
import SlotCalendarDays from '#src/pages/marketplace/PrivateService/SlotSelectorPage/components/SlotCalendarDays';
import { SlotSelectorContext } from '#src/pages/marketplace/PrivateService/SlotSelectorPage/context/SlotSelector.context';
import { useSlotCalendarNavigation } from '#src/pages/marketplace/PrivateService/SlotSelectorPage/hooks';

const EmptyCalendar: React.FC = () => {
  const { t } = useTranslation('privateService');

  const { selectedPrivateSlot } = useContext(SlotSelectorContext);

  const classes = useStyles({ disabled: !selectedPrivateSlot });

  const {
    nextDateAvailableLabel,
    isWithoutNextAvailableSlot,
    goToFirstAvailableSession,
  } = useSlotCalendarNavigation();

  if (isWithoutNextAvailableSlot) {
    return (
      <>
        <WarningIcon className={classes.warning} />
        <Typography>{t('slotSearcher.emptyState')}</Typography>
      </>
    );
  }

  return (
    <>
      <EventAvailableIcon className={classes.icon} color="primary" />
      <ButtonBase onClick={goToFirstAvailableSession}>
        <Typography color="primary">{nextDateAvailableLabel}</Typography>
      </ButtonBase>
    </>
  );
};

const SlotCalendarReworked: React.FC = () => {
  const { selectedPrivateSlot } = useContext(SlotSelectorContext);

  const {
    shouldDisplayAvailableSlotFromPreviousWeeks,
    availableSlotFromPreviousWeeksLabel,
    isEmptyCalendar,
    goToFirstAvailableSession,
  } = useSlotCalendarNavigation();

  const classes = useStyles({ disabled: !selectedPrivateSlot });

  return (
    <div className={classes.container}>
      {shouldDisplayAvailableSlotFromPreviousWeeks && (
        <div className={classes.helperText}>
          <ButtonBase onClick={goToFirstAvailableSession}>
            <Typography color="primary">
              {availableSlotFromPreviousWeeksLabel}
            </Typography>
          </ButtonBase>
        </div>
      )}
      <Paper className={classes.container2}>
        <SlotCalendarToolBar />
        <div className={classes.slotByDateContainer}>
          <SlotCalendarDays />
        </div>
        {isEmptyCalendar && (
          <div className={classes.emptyStateWrapper}>
            <div className={classes.emptyState}>
              <EmptyCalendar />
            </div>
          </div>
        )}
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
  },
  emptyStateWrapper: {
    position: 'absolute',
    marginTop: 60,
    height: 'calc(100% - 60px)',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0,0,0,0.5)',
    top: 0,
    left: 0,
    borderRadius: 4,
  },
  emptyState: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
    backgroundColor: 'white',
    borderRadius: 5,
  },
  warning: {
    fill: theme.palette.warning.main,
    marginRight: theme.spacing(2),
  },
  helperText: {
    marginBotttom: theme.spacing(2),
  },
  icon: {
    marginRight: theme.spacing(2),
  },
}));

export default React.memo(SlotCalendarReworked);
