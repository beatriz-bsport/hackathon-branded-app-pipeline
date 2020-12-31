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

import SlotCalendarDay from './SlotCalendarDay';
import {
  PrivateService,
  PrivateSlot,
} from '../../../../../libs/private-service/types';
import { ArrayElement } from '../../../../../utils/types';
import { groupSessionsByDayMoment } from '../../../../../libs/private-service/utils';

type SessionMoment = ArrayElement<ReturnType<typeof groupSessionsByDayMoment>>;

type Props = {
  privateSlot: PrivateSlot,
  privateService: PrivateService,
  availabilitySlotByDate: { [key: string]: string[] },
  availableSlotsLoading: boolean,
  timezoneName: string,
  selectedDate: string,
  numberOfDayToShow: number,
  selectedSessionMoment: SessionMoment,
  onSessionMomentSelect: (sessionItem: SessionMoment) => void,
  onDateChange: (date: string) => void,
};

const SlotCalendar: React.FC<Props> = (props) => {
  const selectPreviousDay = useCallback(() => {
    const date = moment(props.selectedDate)
      .add(-props.numberOfDayToShow, 'days')
      .format('YYYY-MM-DD');

    props.onDateChange(date);
  }, [props.selectedDate, props.numberOfDayToShow]);

  const selectNextDay = useCallback(() => {
    const date = moment(props.selectedDate)
      .add(props.numberOfDayToShow, 'days')
      .format('YYYY-MM-DD');

    props.onDateChange(date);
  }, [props.selectedDate, props.numberOfDayToShow]);

  const dates = [];

  for (let i = 0; i < props.numberOfDayToShow; i += 1) {
    dates.push(
      moment(props.selectedDate)
        .tz(props.timezoneName)
        .add(i, 'days')
    );
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
              disabled={!props.privateSlot}
              aria-label="left"
              onClick={selectPreviousDay}
            >
              <ChevronLeftIcon fontSize="large" />
            </IconButton>

            <Typography
              variant="h6"
              color={!props.privateSlot ? 'textSecondary' : 'primary'}
            >
              {t('service.detail.tab.calendar')}
            </Typography>

            <IconButton
              disabled={!props.privateSlot}
              aria-label="left"
              onClick={selectNextDay}
            >
              <ChevronRightIcon fontSize="large" />
            </IconButton>
          </div>

          <div className={classes.slotByDateContainer}>
            {props.availableSlotsLoading ? (
              <div className={classes.loadingContainer}>
                <CircularProgress />
              </div>
            ) : (
              dates.map((date) => {
                const dateStr = date.format('YYYY-MM-DD');
                const slotByDate = props.availabilitySlotByDate[dateStr];

                return (
                  <div className={classes.itemLayout} key={dateStr}>
                    <SlotCalendarDay
                      slots={slotByDate}
                      timezoneName={props.timezoneName}
                      privateService={props.privateService}
                      privateSlot={props.privateSlot}
                      date={date}
                      selectedSessionMoment={props.selectedSessionMoment}
                      onSessionMomentSelect={props.onSessionMomentSelect}
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
    overflow: 'hidden',
  },
  itemLayout: {
    display: 'flex',
    padding: theme.spacing(1),
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
