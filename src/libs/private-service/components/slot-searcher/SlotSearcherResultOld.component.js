// @flow
import React from 'react';
import Fab from '@material-ui/core/Fab';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import moment from 'moment';
import flatten from 'lodash/flatten';
import uniq from 'lodash/uniq';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import type { PrivateService, PrivateSlot } from '../../types';

type Props = {
  searchLoading: boolean,
  private_services: Array<PrivateService>,
  bookable_slots: Array<string>,
  onClickBook: (
    serviceId: number,
    slotId: number,
    coachId: number,
    date: string,
  ) => void,
  classes: Object,
  t: TFunction,
  searchAvailableSlots: (
    slot_selected: number,
    coaches_selected: number,
    date_selected: string,
  ) => void,

  onPrivateServiceChange: (?PrivateService) => void,
  onPrivateSlotChange: (?PrivateSlot) => void,
  onCoachChange: (Array<Coach>) => void,
  onDateChange: (Object) => void,
};

const reorderBookableSlots: (
  Array<{ coach: number, date_start: Array<string> }>,
) => Array<{
  day: string,
  byCoach: Array<{ coach: number, date_start: Array<string> }>,
}> = (bookableSlotsByCoach) => {
  const dayList = uniq(
    flatten(bookableSlotsByCoach.map((data) => data.date_start)).reduce(
      (acc, value) => {
        acc.push(moment(value).format('YYYY-MM-DD'));
        return acc;
      },
      [],
    ),
  );
  const coachList = bookableSlotsByCoach.map((data) => data.coach);
  return dayList.map((day) => ({
    day,
    byCoach: coachList.map((coach) => ({
      coach,
      date_start: bookableSlotsByCoach
        .find((data) => data.coach === coach)
        .date_start.filter((date) => moment(date).isSame(moment(day), 'day')),
    })),
  }));
};

const DayCoachSlots = (props: {
  date: Object,
  slotsByCoach: Array<{ coach: number, date_start: Array<string> }>,
  classes: Object,
  onDateClick: (string, number) => void,
}) => (
  <div>
    <Typography variant="h6">{moment(props.date).format('LL')}</Typography>
    {props.slotsByCoach.byCoach.map((byCoach) => {
      if (!byCoach || !byCoach.date_start || byCoach.date_start.length === 0) {
        return null;
      }
      const coach = stuff;
      const coachName = (coach && coach.user && coach.user.name) || '';
      return (
        <div className={props.classes.coachContainer}>
          <Typography
            variant="subtitle2"
            className={props.classes.coachSectionTitle}
          >
            {coachName}
          </Typography>
          <Divider className={props.classes.coachDivider} />
          <div className={props.classes.bookableSlotsContainer}>
            {[0, 1, 2, 3]
              .map((columnIdx) => {
                const columnSize = parseInt(byCoach.date_start.length / 4, 10);
                return byCoach.date_start.slice(
                  columnIdx * columnSize,
                  columnIdx === 3
                    ? byCoach.date_start.length
                    : (columnIdx + 1) * columnSize,
                );
              })
              .map((bookable_slot_column, columnIdx) => (
                <div
                  key={columnIdx}
                  className={props.classes.bookableSlotColumn}
                >
                  {bookable_slot_column.map((bookable_slot) => (
                    <Fab
                      size="small"
                      variant="extended"
                      color="primary"
                      key={bookable_slot}
                      className={props.classes.bookableSlotFabButton}
                      onClick={() =>
                        props.onDateClick(bookable_slot, byCoach.coach)
                      }
                    >
                      {moment(bookable_slot).format('HH:mm')}
                    </Fab>
                  ))}
                </div>
              ))}
          </div>
        </div>
      );
    })}
  </div>
);

export const SlotSearcherResult = (props) => {
  if (props.loading) {
    return (
      <div className={props.classes.loadingIndicator}>
        <CircularProgress />
      </div>
    );
  }

  const bookable_slots_by_day_by_coach = reorderBookableSlots(
    props.bookable_slots,
  );

  if (bookable_slots_by_day_by_coach.length === 0) {
    return (
      <Typography align="center" color="textSecondary">
        {props.t('slotSearcher.emptyDateList')}
      </Typography>
    );
  }

  return (
    <div>
      {bookable_slots_by_day_by_coach.map((byDay) => (
        <div key={byDay.day} className={props.classes.dayContainer}>
          <DayCoachSlots
            slotsByCoach={byDay}
            date={byDay.day}
            classes={props.classes}
            onDateClick={props.onDateClick}
          />
        </div>
      ))}
    </div>
  );
};

const styles = (theme) => ({
  container: {
    paddingBottom: theme.spacing.unit * 32,
    maxWidth: 360,
    display: 'flex',
    flexDirection: 'column',
  },
  bookableSlotsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  bookableSlotColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  bookableSlotFabButton: {
    marginBottom: theme.spacing.unit,
  },
  loadingIndicator: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coachDivider: {
    marginBottom: theme.spacing.unit,
    marginTop: theme.spacing.unit,
  },
  coachSectionTitle: {
    marginTop: theme.spacing.unit,
  },
});

export default compose(
  withNamespaces(['privateService']),
  withStyles(styles),
)(SlotSearcherResult);
