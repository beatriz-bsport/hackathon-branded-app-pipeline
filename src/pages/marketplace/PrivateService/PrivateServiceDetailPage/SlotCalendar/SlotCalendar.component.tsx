import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';

import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  IconButton,
  Paper,
  Fade,
  CircularProgress,
} from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import WarningIcon from '@material-ui/icons/Warning';
import ButtonBase from '@material-ui/core/ButtonBase';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';

import SlotCalendarDay from './SlotCalendarDay.component';
import {
  PrivateService,
  PrivateSlot,
} from '../../../../../libs/private-service/types';
import { ArrayElement } from '../../../../../utils/types';
import {
  groupSessionsByDayMoment,
  splitIntervalList,
} from '../../../../../libs/private-service/utils';
import { Establishment } from '../../../../../libs/establishment/types';
import { Coach } from '../../../../../libs/associated-coach/types';

type SessionMoment = ArrayElement<ReturnType<typeof groupSessionsByDayMoment>>;

type Props = {
  privateSlot: PrivateSlot;
  privateService: PrivateService<Coach, Establishment, PrivateSlot>;
  availabilitySlotByDate: { [key: string]: string[][] };
  availableSlotsLoading: boolean;
  timezoneName: string;
  selectedDate: string;
  numberOfDayToShow: number;
  selectedSessionMoment: SessionMoment;
  nextAvailableSlotLoading: boolean;
  nextDateAvailableSlot: string;
  onSessionMomentSelect: (sessionItem: SessionMoment) => void;
  onDateChange: (date: string) => void;
};

const SlotCalendar: React.FC<Props> = ({
  privateSlot,
  privateService,
  availabilitySlotByDate,
  availableSlotsLoading,
  timezoneName,
  selectedDate,
  numberOfDayToShow,
  selectedSessionMoment,
  nextDateAvailableSlot,
  nextAvailableSlotLoading,
  onSessionMomentSelect,
  onDateChange,
}) => {
  const selectPreviousDay = useCallback(() => {
    const date = moment(selectedDate)
      .add(-numberOfDayToShow, 'days')
      .format('YYYY-MM-DD');

    onDateChange(date);
  }, [selectedDate, numberOfDayToShow, onDateChange]);

  const selectNextDay = useCallback(() => {
    const date = moment(selectedDate)
      .add(numberOfDayToShow, 'days')
      .format('YYYY-MM-DD');

    onDateChange(date);
  }, [selectedDate, numberOfDayToShow, onDateChange]);

  const goToFirstAvailableSession = () => {
    onDateChange(
      numberOfDayToShow === 7
        ? moment(nextDateAvailableSlot)
            .tz(timezoneName)
            .startOf('week')
            .format('YYYY-MM-DD')
        : nextDateAvailableSlot,
    );
  };

  const dates = [];

  for (let i = 0; i < numberOfDayToShow; i += 1) {
    dates.push(moment(selectedDate).tz(timezoneName).add(i, 'days'));
  }

  const classes = useStyles({ privateSlot });
  const { t } = useTranslation('privateService');

  const availableSlots = dates.some((d) => {
    if (!privateSlot) return false;

    return (
      splitIntervalList(
        availabilitySlotByDate?.[d.format('YYYY-MM-DD')] ?? [],
        privateSlot.duration_minutes,
        privateSlot.booking_interval_minutes,
      )?.length ?? false
    );
  });

  return (
    <Fade in timeout={500}>
      <div className={classes.container}>
        <Typography variant="h5">{t('slotSearcher.search')}</Typography>
        {privateSlot &&
          nextDateAvailableSlot !== null &&
          moment(nextDateAvailableSlot)
            .tz(timezoneName)
            .isBefore(moment(selectedDate).tz(timezoneName)) && (
            <div className={classes.helperText}>
              <ButtonBase onClick={goToFirstAvailableSession}>
                <Typography color="primary">
                  {t('slotSearcher.previousOffer', {
                    date: moment(nextDateAvailableSlot)
                      .tz(timezoneName)
                      .format('L'),
                    hour: moment(nextDateAvailableSlot)
                      .tz(timezoneName)
                      .format('LT'),
                  })}
                </Typography>
              </ButtonBase>
            </div>
          )}
        <Paper className={classes.container2}>
          <div className={classes.calendarToolbar}>
            <IconButton
              disabled={!privateSlot}
              aria-label="left"
              onClick={selectPreviousDay}
            >
              <ChevronLeftIcon fontSize="large" />
            </IconButton>

            <Typography
              variant="h6"
              color={!privateSlot ? 'textSecondary' : 'primary'}
            >
              {t('service.detail.tab.calendar')}
            </Typography>

            <IconButton
              disabled={!privateSlot}
              aria-label="left"
              onClick={selectNextDay}
            >
              <ChevronRightIcon fontSize="large" />
            </IconButton>
          </div>

          <div className={classes.slotByDateContainer}>
            {availableSlotsLoading ? (
              <div className={classes.loadingContainer}>
                <CircularProgress />
              </div>
            ) : (
              dates.map((date) => {
                const dateStr = date.format('YYYY-MM-DD');
                const slotByDate = availabilitySlotByDate[dateStr];

                return (
                  <div className={classes.itemLayout} key={dateStr}>
                    <SlotCalendarDay
                      slots={slotByDate}
                      timezoneName={timezoneName}
                      privateService={privateService}
                      privateSlot={privateSlot}
                      date={date}
                      selectedSessionMoment={selectedSessionMoment}
                      onSessionMomentSelect={onSessionMomentSelect}
                    />
                  </div>
                );
              })
            )}
            {privateSlot && !availableSlotsLoading && !availableSlots && (
              <div className={classes.emptyStateWrapper}>
                <div className={classes.emptyState}>
                  {nextAvailableSlotLoading ? (
                    <div className={classes.loadingContainer}>
                      <CircularProgress />
                    </div>
                  ) : (
                    <>
                      {nextDateAvailableSlot !== null && (
                        <>
                          <EventAvailableIcon
                            color="primary"
                            className={classes.icon}
                          />
                          <ButtonBase onClick={goToFirstAvailableSession}>
                            <Typography className={classes.link}>
                              {t('slotSearcher.nextOffer', {
                                date: moment(nextDateAvailableSlot)
                                  .tz(timezoneName)
                                  .format('L'),
                                hour: moment(nextDateAvailableSlot)
                                  .tz(timezoneName)
                                  .format('LT'),
                              })}
                            </Typography>
                          </ButtonBase>
                        </>
                      )}
                      {nextDateAvailableSlot === null && (
                        <>
                          <WarningIcon className={classes.warning} />
                          <Typography>
                            {t('slotSearcher.emptyState')}
                          </Typography>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </Paper>
      </div>
    </Fade>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1),
  },
  container2: ({ privateSlot }: Pick<Props, 'privateSlot'>) => ({
    position: 'relative',
    display: 'flex',
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    marginTop: theme.spacing(1),
    background: !privateSlot ? '#E8E8E8' : undefined,
  }),
  calendarToolbar: {
    display: 'flex',
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slotByDateContainer: {
    display: 'flex',
    flex: 1,
    width: '100%',
    flexDirection: 'row',
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
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
    width: '100%',
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
  link: {
    color: theme.palette.primary.main,
  },
  icon: {
    marginRight: theme.spacing(2),
  },
}));

export default SlotCalendar;
