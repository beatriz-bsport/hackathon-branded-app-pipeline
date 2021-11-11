import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
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
import moment from 'moment-timezone';

import SlotCalendarDay from './SlotCalendarDay.component';
import {
  PrivateService,
  PrivateSlot,
} from '../../../../../libs/private-service/types';
import { ArrayElement } from '../../../../../utils/types';
import { groupSessionsByDayMoment } from '../../../../../libs/private-service/utils';
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
  onSessionMomentSelect: (sessionItem: SessionMoment) => void;
  onDateChange: (date: string) => void;
};

const SlotCalendar: React.FC<Props> = (props) => {
  const {
    privateSlot,
    privateService,
    availabilitySlotByDate,
    availableSlotsLoading,
    timezoneName,
    selectedDate,
    numberOfDayToShow,
    selectedSessionMoment,
    onSessionMomentSelect,
    onDateChange,
  } = props;

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

  const dates = [];

  for (let i = 0; i < numberOfDayToShow; i += 1) {
    dates.push(moment(selectedDate).tz(timezoneName).add(i, 'days'));
  }

  const classes = useStyles(props);
  const { t } = useTranslation('privateService');

  return (
    <Fade in timeout={500}>
      <div className={classes.container}>
        <Typography variant="h5">{t('slotSearcher.search')}</Typography>
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
  container2: (props: Props) => ({
    display: 'flex',
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    marginTop: theme.spacing(1),
    background: !props.privateSlot ? '#E8E8E8' : undefined,
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
}));

export default SlotCalendar;
