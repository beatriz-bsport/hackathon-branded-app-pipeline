// @flow
import moment from 'moment-timezone';
import React from 'react';
import uniq from 'lodash/uniq';
import Button from '@material-ui/core/Button';
import { RESOURCE_ATTRIBUTION_CONSUMER } from '@bsport/common/lib/master-data/resource-attribution-methods';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Paper from '@material-ui/core/Paper';
import ScheduleIcon from '@material-ui/icons/Schedule';
import PeopleIcon from '@material-ui/icons/People';

import CircularProgress from '@material-ui/core/CircularProgress';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { splitIntervalList } from '../../utils.ts';

const stylesSlot = (theme) => ({
  columnContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    paddingBottom: theme.spacing(1),
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  emptyColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    paddingBottom: theme.spacing(2),
  },
  slot: {
    margin: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  slotGroupContainer: {
    marginBottom: theme.spacing(2),
  },
});
const Slot = withStyles(stylesSlot)(
  (props: {
    onDateClick: () => void,
    classes: Object,
    date: string,
    last_booking_minutes?: number,
  }) => {
    const isTooLate = moment(props.date)
      .add('minutes', -props.last_booking_minutes)
      .isBefore(moment());
    return (
      <Button
        onClick={props.onDateClick}
        color="primary"
        disabled={moment(props.date).isBefore(moment()) || isTooLate}
        variant="contained"
        className={props.classes.slot}
      >
        {moment(props.date).format('HH:mm')}
      </Button>
    );
  },
);
const SlotList = withTranslation('privateService')(
  withStyles(stylesSlot)(
    (props: {
      slots: Array<PrivateSlot>,
      t: TFunction,
      onDateClick: (string) => void,
      classes: Object,
      last_booking_minutes?: number,
    }) => {
      if (!props.slots.length) {
        return (
          <div className={props.classes.columnContainer}>
            <div className={props.classes.emptyColumn}>
              <InfoOutlinedIcon
                fontSize="large"
                style={{ height: 100, width: 100 }}
                color="textSecondary"
              />
              <Typography color="error">
                {props.t('bookerModule.emptySlot')}
              </Typography>
            </div>
          </div>
        );
      }
      return (
        <div className={props.classes.columnContainer}>
          <div className={props.classes.column}>
            {props.slots.map(
              (s, idx) =>
                idx % 4 === 0 && (
                  <Slot
                    onDateClick={() => props.onDateClick(s)}
                    date={s}
                    key={idx}
                    last_booking_minutes={props.last_booking_minutes}
                  />
                ),
            )}
          </div>
          <div className={props.classes.column}>
            {props.slots.map(
              (s, idx) =>
                idx % 4 === 1 && (
                  <Slot
                    date={s}
                    onDateClick={() => props.onDateClick(s)}
                    key={idx}
                    last_booking_minutes={props.last_booking_minutes}
                  />
                ),
            )}
          </div>
          <div className={props.classes.column}>
            {props.slots.map(
              (s, idx) =>
                idx % 4 === 2 && (
                  <Slot
                    date={s}
                    onDateClick={() => props.onDateClick(s)}
                    key={idx}
                    last_booking_minutes={props.last_booking_minutes}
                  />
                ),
            )}
          </div>
          <div className={props.classes.column}>
            {props.slots.map(
              (s, idx) =>
                idx % 4 === 3 && (
                  <Slot
                    date={s}
                    onDateClick={() => props.onDateClick(s)}
                    key={idx}
                    last_booking_minutes={props.last_booking_minutes}
                  />
                ),
            )}
          </div>
        </div>
      );
    },
  ),
);

export const SlotGroup = withStyles(stylesSlot)((props) => {
  const slots = splitIntervalList(
    props.slots,
    props.private_slot.duration_minutes,
    props.private_slot.booking_interval_minutes,
  );
  let resourceName = '';
  let Icon = InfoOutlinedIcon;
  if (props.resource_identifier.includes('associated_coach')) {
    const resource = props.private_service.coaches.find((c) =>
      c.associatedcoach_set.includes(
        parseInt(props.resource_identifier.split(':')[1], 10),
      ),
    );
    if (resource) resourceName = resource.name;
    Icon = PeopleIcon;
  }
  const [resourceDatatype, resourceId] = props.resource_identifier.split(':');
  return (
    <div className={props.classes.slotGroupContainer}>
      <Typography variant="h5">
        <Icon className={props.classes.leftIcon} />
        {resourceName}
      </Typography>
      <Divider className={props.classes.divider} />
      <SlotList
        onDateClick={(date) =>
          props.onDateClick(date, { [resourceDatatype]: resourceId })
        }
        slots={slots}
        last_booking_minutes={props.last_booking_minutes}
      />
    </div>
  );
});

type Props = {
  private_slot: PrivateSlot,
  private_service: PrivateService,
  classes: Object,
  loading: boolean,
  date: ?string,
  bookable_slots: Array<Slot>,
  onDateClick: (string) => void,
  last_booking_minutes: number,
};

export const SlotSearcherResult = (props: Props) => {
  if (!props.private_slot || !props.private_service || !props.date) {
    return null;
  }
  if (props.loading) {
    return (
      <div className={props.classes.container}>
        <div className={props.classes.loadingContainer}>
          <CircularProgress />
        </div>
      </div>
    );
  }

  let resourceIdentifierSuffixToFilterBy = 'associated_coach';
  if (
    props.private_service.coaches.length === 0 ||
    props.private_service.coach_attribution !== RESOURCE_ATTRIBUTION_CONSUMER
  ) {
    resourceIdentifierSuffixToFilterBy = null;
  }

  return (
    <div className={props.classes.container}>
      <div className={props.classes.row}>
        <ScheduleIcon className={props.classes.leftIcon} />
        <Typography variant="h6">{moment(props.date).format('LL')}</Typography>
      </div>
      <Paper className={props.classes.resultPaper}>
        {!resourceIdentifierSuffixToFilterBy ? (
          <div className={props.classes.slotGroupContainer}>
            <SlotList
              onDateClick={props.onDateClick}
              last_booking_minutes={props.last_booking_minutes}
              slots={uniq(
                props.bookable_slots.reduce(
                  (acc, { slots }) => [
                    ...acc,
                    ...splitIntervalList(
                      slots,
                      props.private_slot.duration_minutes,
                      props.private_slot.booking_interval_minutes,
                    ),
                  ],
                  [],
                ),
              )}
            />
          </div>
        ) : (
          props.bookable_slots
            .filter((g) => g.resource_identifier.includes('coach'))
            .map((slotGroup) => (
              <SlotGroup
                onDateClick={props.onDateClick}
                private_service={props.private_service}
                private_slot={props.private_slot}
                resource_identifier={slotGroup.resource_identifier}
                slots={slotGroup.slots}
                key={slotGroup.resource_identifier}
                last_booking_minutes={props.last_booking_minutes}
              />
            ))
        )}
      </Paper>
    </div>
  );
};

const styles = (theme) => ({
  container: {
    marginTop: theme.spacing(2),
  },
  resultPaper: {
    padding: theme.spacing(2),
    paddingBottom: 0,
  },
  loadingContainer: {
    paddingTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  slotGroupContainer: {
    marginBottom: theme.spacing(2),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
});

export default compose(
  withTranslation(['privateService']),
  withStyles(styles),
)(SlotSearcherResult);
