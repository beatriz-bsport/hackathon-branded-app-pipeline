import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import { SlotSelectorContext } from '#src/pages/marketplace/PrivateService/SlotSelectorPage/context/SlotSelector.context';
import { useSlotCalendarNavigation } from '#src/pages/marketplace/PrivateService/SlotSelectorPage/hooks';
import { Interval } from 'luxon';
import { DayTimeIntervals } from '#src/libs/private-service/constants';

type Props = {
  availableDayTimeSegment: DayTimeIntervals;
  dayTimeInterval: Interval;
};

const DayTimeIntervalButton: React.FC<Props> = React.memo(
  ({ availableDayTimeSegment, dayTimeInterval }) => {
    const { t } = useTranslation('privateService');

    const { selectedPrivateSlot, selectedDayTimeInterval } =
      useContext(SlotSelectorContext);

    const { onSelectDayTimeInterval } = useSlotCalendarNavigation();

    const classes = useStyles();

    const isDayTimeIntervalSelected = useMemo(() => {
      return dayTimeInterval && selectedDayTimeInterval
        ? dayTimeInterval.equals(selectedDayTimeInterval)
        : false;
    }, [dayTimeInterval, selectedDayTimeInterval]);

    return (
      <ButtonBase
        className={clsx(classes.slotMoment, {
          [classes.slotMomentSelected]: isDayTimeIntervalSelected,
        })}
        disabled={!selectedPrivateSlot}
        onClick={onSelectDayTimeInterval(dayTimeInterval)}
      >
        <div className={classes.row}>
          <Typography align="left" variant="subtitle2">
            {t(
              `privateService:slotSearcher.groupIdentifier.${availableDayTimeSegment}.label`,
            )}
          </Typography>
        </div>

        <Typography className={classes.interval}>
          {t(
            `privateService:slotSearcher.groupIdentifier.${availableDayTimeSegment}.interval`,
          )}
        </Typography>
      </ButtonBase>
    );
  },
);

const useStyles = makeStyles((theme) => ({
  row: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slotMoment: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderRadius: 5,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.primary.main,
    padding: theme.spacing(1),
    minHeight: 60,
    width: '100%',
    position: 'relative',
  },
  slotMomentSelected: {
    backgroundColor: theme.palette.primary.main,
    borderWidth: 0,
    color: 'white',
  },
  accessTimeIcon: {
    position: 'absolute',
    right: 4,
    top: 4,
  },
  interval: {
    fontSize: '0.875rem',
    marginBottom: theme.spacing(0.5),
  },
}));

export default React.memo(DayTimeIntervalButton);
