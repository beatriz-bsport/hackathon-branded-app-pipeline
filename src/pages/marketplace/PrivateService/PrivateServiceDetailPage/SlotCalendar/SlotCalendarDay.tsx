import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Moment } from 'moment-timezone';

import { ButtonBase, Typography, makeStyles } from '@material-ui/core';
import AccessTimeIcon from '@material-ui/icons/AccessTime';

import {
  groupSessionsByDayMoment,
  splitIntervalList,
  // @ts-ignore
} from '../../../../../libs/private-service/utils';
import {
  PrivateService,
  PrivateSlot,
} from '../../../../../libs/private-service/types';
import { ArrayElement } from '../../../../../utils/types';

type SessionMoment = ArrayElement<ReturnType<typeof groupSessionsByDayMoment>>;

type Props = {
  timezoneName: string;
  privateService: PrivateService;
  privateSlot: PrivateSlot;
  slots: Array<string>;
  date: Moment;
  loading: boolean;
  selectedSessionMoment: SessionMoment;
  onSessionMomentSelect: (sessionMoment: SessionMoment) => void;
};

const SlotCalendarDay: React.FC<Props> = (props) => {
  const isSelected = useCallback(
    (sessionMoment) => {
      return (
        props.selectedSessionMoment &&
        sessionMoment.date === props.selectedSessionMoment.date &&
        sessionMoment.identifier === props.selectedSessionMoment.identifier
      );
    },
    [props.selectedSessionMoment],
  );

  const classes = useStyles();
  const { t } = useTranslation(['datetime', 'privateService']);

  const renderNoSessions = useCallback(() => {
    return (
      <div className={classes.centerView}>
        <Typography variant="h5" component="p">
          {' '}
          -
        </Typography>{' '}
      </div>
    );
  }, []);

  const renderSessionsMoment = useCallback(() => {
    let sessions = [];

    if (props.slots?.length && props.privateService && props.privateSlot) {
      sessions = splitIntervalList(
        props.slots,
        props.privateSlot.duration_minutes,
        props.privateSlot.booking_interval_minutes,
      );
    }

    const sessionsByDayMoment = groupSessionsByDayMoment(
      sessions,
      props.timezoneName,
      props.date.format('YYYY-MM-DD'),
    );

    return sessionsByDayMoment.map((sessionMoment: SessionMoment) => {
      if (!sessionMoment.list.length) {
        return null;
      }

      const label = t(
        `privateService:slotSearcher.groupIdentifier.${sessionMoment.identifier}.label`,
      );

      const interval = t(
        `privateService:slotSearcher.groupIdentifier.${sessionMoment.identifier}.interval`,
      );

      const slotCount = t('privateService:slotSearcher.nbSlot', {
        nbSlot: sessionMoment.list.length,
        count: sessionMoment.list.length,
      });

      const selected = isSelected(sessionMoment);

      return (
        <div
          key={sessionMoment.identifier}
          className={classes.slotMomentContainer}
        >
          <ButtonBase
            onClick={() =>
              props.privateSlot && props.onSessionMomentSelect(sessionMoment)
            }
            className={`${classes.slotMoment} ${
              selected ? classes.selected : ''
            }`}
          >
            <AccessTimeIcon
              color={selected ? 'white' : 'primary'}
              fontSize="small"
              className={classes.absoluteTopLeft}
            />
            <div className={classes.row}>
              <Typography align="left" variant="subtitle2">
                {label}
              </Typography>
            </div>

            <Typography
              className={classes.interval}
              color={selected ? 'inherit' : 'textSecondary'}
            >
              {interval}
            </Typography>

            <Typography
              color={selected ? 'inherit' : 'textSecondary'}
              variant="caption"
            >
              {slotCount}
            </Typography>
          </ButtonBase>
        </div>
      );
    });
  }, [props.privateSlot, props.privateService, props.timezoneName, props.date]);

  const weekDay = t(
    `datetime:time.isoWeekdayNumber.${props.date.isoWeekday()}`,
  );
  const month = t(
    `datetime:time.monthShort.${props.date
      .locale('en-US')
      .format('MMMM')
      .toLowerCase()}`,
  );

  return (
    <div className={classes.container}>
      <div className={classes.dateContainer}>
        <Typography variant="subtitle1">{weekDay}</Typography>
        <Typography variant="subtitle2" color="textSecondary">
          {`${month} ${props.date.date()}`}
        </Typography>
      </div>

      {!!props.slots && !!props.slots.length
        ? renderSessionsMoment()
        : renderNoSessions()}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  absoluteTopLeft: {
    position: 'absolute',
    right: 4,
    top: 4,
  },
  dateContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  slotMomentContainer: {
    display: 'flex',
    padding: theme.spacing(1),
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
  selected: {
    backgroundColor: theme.palette.primary.main,
    borderWidth: 0,
    color: 'white',
  },
  interval: {
    fontSize: '0.875rem',
    marginBottom: theme.spacing(0.5),
  },
  centerView: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));

export default SlotCalendarDay;
