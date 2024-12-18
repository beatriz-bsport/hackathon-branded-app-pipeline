import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';

import { ButtonBase, Typography } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import AccessTimeIcon from '@material-ui/icons/AccessTime';

import {
  groupSessionsByDayMoment,
  splitIntervalList,
} from '../../../../../libs/private-service/utils';
import {
  PrivateService,
  PrivateSlot,
} from '../../../../../libs/private-service/types';
import { ArrayElement } from '../../../../../utils/types';
import { Establishment } from '../../../../../libs/establishment/types';
import { Coach } from '../../../../../libs/associated-coach/types';

type SessionMoment = ArrayElement<ReturnType<typeof groupSessionsByDayMoment>>;

type Props = {
  timezoneName: string;
  privateService: PrivateService<Coach, Establishment, PrivateSlot>;
  privateSlot: PrivateSlot;
  slots: string[][];
  date: DateTime;
  selectedSessionMoment: SessionMoment;
  onSessionMomentSelect: (sessionMoment: SessionMoment) => void;
};

const SlotCalendarDay: React.FC<Props> = (props) => {
  const {
    timezoneName,
    privateService,
    privateSlot,
    slots,
    date,
    selectedSessionMoment,
    onSessionMomentSelect,
  } = props;

  const isSelected = useCallback(
    (sessionMoment) => {
      return (
        selectedSessionMoment &&
        sessionMoment.date === selectedSessionMoment.date &&
        sessionMoment.identifier === selectedSessionMoment.identifier
      );
    },
    [selectedSessionMoment],
  );

  const classes = useStyles();
  const { t } = useTranslation(['datetime', 'privateService']);

  const renderNoSessions = useCallback(() => {
    return (
      <div className={classes.centerView}>
        <Typography component="p" variant="h5">
          {' '}
          -
        </Typography>{' '}
      </div>
    );
  }, [classes.centerView]);

  const renderSessionsMoment = useCallback(() => {
    let sessions: string[] = [];

    if (slots?.length && privateService && privateSlot) {
      sessions = splitIntervalList(
        slots,
        privateSlot.duration_minutes,
        privateSlot.booking_interval_minutes,
      );
    }

    const sessionsByDayMoment = groupSessionsByDayMoment(
      sessions,
      timezoneName,
      date.toISODate(),
    );

    const sessionByDayElement: any[] = [];

    sessionsByDayMoment.forEach((sessionMoment: SessionMoment) => {
      if (!sessionMoment.list.length) {
        return;
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

      sessionByDayElement.push(
        <div
          key={sessionMoment.identifier}
          className={classes.slotMomentContainer}
        >
          <ButtonBase
            className={`${classes.slotMoment} ${
              selected ? classes.selected : ''
            }`}
            onClick={() => privateSlot && onSessionMomentSelect(sessionMoment)}
          >
            <AccessTimeIcon
              className={classes.absoluteTopLeft}
              color={selected ? 'inherit' : 'primary'}
              fontSize="small"
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
        </div>,
      );
    });

    if (sessionByDayElement.length) {
      return sessionByDayElement;
    }
    return renderNoSessions();
  }, [
    privateSlot,
    privateService,
    timezoneName,
    date,
    classes.absoluteTopLeft,
    classes.interval,
    classes.row,
    classes.selected,
    classes.slotMoment,
    classes.slotMomentContainer,
    isSelected,
    onSessionMomentSelect,
    renderNoSessions,
    slots,
    t,
  ]);

  const weekDay = t(`datetime:time.isoWeekdayNumber.${date.weekday}`);

  const month = t(
    `datetime:time.monthShort.${date
      .setLocale('en-US')
      .toFormat('MMMM')
      .toLowerCase()}`,
  );

  return (
    <div className={classes.container}>
      <div className={classes.dateContainer}>
        <Typography variant="subtitle1">{weekDay}</Typography>
        <Typography color="textSecondary" variant="subtitle2">
          {`${month} ${date.day}`}
        </Typography>
      </div>

      {!!slots && !!slots.length ? renderSessionsMoment() : renderNoSessions()}
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

export default React.memo(SlotCalendarDay);
