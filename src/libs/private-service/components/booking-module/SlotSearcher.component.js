// @flow
import React from 'react';
import Fab from '@material-ui/core/Fab';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import SearchIcon from '@material-ui/icons/Search';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Immutable from 'seamless-immutable';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import MomentUtils from '@date-io/moment';
import Divider from '@material-ui/core/Divider';
import moment from 'moment';
import flatten from 'lodash/flatten';
import uniq from 'lodash/uniq';
import {
  MuiPickersUtilsProvider,
  Calendar,
  BasePicker,
} from 'material-ui-pickers';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import PrivateSlotSelector from '../PrivateSlotSelector.component';
import CoachSelector from '../../../associated-coach/components/CoachSelector.component';
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
    service_selected: number,
    slot_selected: number,
    coaches_selected: number,
    date_selected: string,
  ) => void,

  onPrivateServiceChange: (?PrivateService) => void,
  onPrivateSlotChange: (?PrivateSlot) => void,
  onCoachChange: (Array<Coach>) => void,
  onDateChange: (Object) => void,
};

type State = {
  service_selected: ?PrivateService,
  slot_selected: ?PrivateSlot,
  coaches_selected: ?AssociatedCoach,
  date_selected: ?string,
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
  service_selected: ?PrivateService,
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
      return (
        <div className={props.classes.coachContainer}>
          <Typography
            variant="subtitle2"
            className={props.classes.coachSectionTitle}
          >
            {props.service_selected
              ? props.service_selected.coaches.find(
                  (c) => c.id === byCoach.coach,
                ).user.name
              : ''}
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

export class PrivateServiceBooker extends React.Component<Props, State> {
  state = {
    slot_selected: null,
    service_selected: null,
    coaches_selected: null,
    date_selected: moment().format('YYYY-MM-DD'),
    has_been_searched: false,
  };

  selectSlotOption = (slotOption: { value: number, label: string }) => {
    if (!slotOption) {
      this.handleCoachChange(null);
      this.handleServiceChange(null);
      this.handleSlotChange(null);
      return;
    }
    const { value } = slotOption;
    const service_selected = this.props.private_services.find((ps) =>
      ps.slots.map((s) => s.id).includes(value),
    );
    const slot_selected = service_selected.slots.find((s) => s.id === value);
    this.handleCoachChange(null);
    this.handleServiceChange(service_selected.id);
    this.handleSlotChange(slot_selected);
  };

  onDateClick = (date: string, coach: number) => {
    this.props.onClickBook(
      this.state.service_selected.id,
      this.state.slot_selected.id,
      coach,
      date,
    );
  };

  renderBookableSlots = () => {
    if (this.props.searchLoading) {
      return (
        <div className={this.props.classes.loadingIndicator}>
          <CircularProgress />
        </div>
      );
    }

    const bookable_slots_by_day_by_coach = reorderBookableSlots(
      this.props.bookable_slots,
    );

    return (
      <React.Fragment>
        {bookable_slots_by_day_by_coach.map((byDay) => (
          <div key={byDay.day} className={this.props.classes.dayContainer}>
            <DayCoachSlots
              slotsByCoach={byDay}
              date={byDay.day}
              service_selected={this.state.service_selected}
              classes={this.props.classes}
              onDateClick={this.onDateClick}
            />
          </div>
        ))}
      </React.Fragment>
    );
  };

  handleCoachChange = (coaches_selected: Array<Option>) => {
    if (coaches_selected && coaches_selected.length > 0) {
      this.setState({ coaches_selected: coaches_selected.map((o) => o.value) });
      this.props.onCoachChange(
        this.state.service_selected.coaches.filter((c) =>
          coaches_selected.map((o) => o.value).includes(c.id),
        ),
      );
    } else {
      this.setState({ coaches_selected: [] });
      this.props.onCoachChange([]);
    }
  };

  handleDateChange = (date_selected: Object) => {
    this.setState({
      date_selected: date_selected.format('YYYY-MM-DD'),
    });
    this.props.onDateChange(date_selected);
    this.doSearch(date_selected);
  };

  handleServiceChange = (service_selected_id: ?number) => {
    const service_selected = this.props.private_services.find(
      (ps) => ps.id === service_selected_id,
    );
    this.setState({ service_selected });
    this.props.onPrivateServiceChange(service_selected);
  };

  handleSlotChange = (slot_selected: ?PrivateSlot) => {
    this.setState({ slot_selected });
    this.props.onPrivateSlotChange(slot_selected);
  };

  doSearch = (date_selected) => {
    this.setState({ has_been_searched: true });
    this.props.searchAvailableSlots(
      this.state.service_selected.id,
      this.state.slot_selected.id,
      this.state.coaches_selected,
      date_selected || this.state.date_selected,
    );
  };

  render() {
    const { t, classes } = this.props;
    return (
      <div className={this.props.classes.container}>
        <Typography variant="h6" className={classes.sectionTitle}>
          {t('slotSearcher.title')}
        </Typography>
        <PrivateSlotSelector
          onChange={this.selectSlotOption}
          onServiceChange={this.handleServiceChange}
          placeholder={t('slotSearcher.selectPrivateSlot')}
          privateServices={this.props.private_services}
        />
        <CoachSelector
          placeholder={t('slotSearcher.selectCoach')}
          selectedCoaches={
            this.state.coaches_selected ? this.state.coaches_selected : []
          }
          isDisabled={
            !(
              this.state.service_selected &&
              this.state.service_selected.coaches.length
            )
          }
          selectOption={(option) => this.handleCoachChange(option)}
          coaches={
            this.state.service_selected
              ? this.state.service_selected.coaches.filter((c) => !!c)
              : Immutable([])
          }
        />
        <MuiPickersUtilsProvider
          utils={MomentUtils}
          moment={moment}
          locale={moment.locale()}
        >
          <BasePicker
            value={this.state.date_selected}
            onChange={this.handleDateChange}
          >
            {() => (
              <div className="picker">
                <Paper style={{ overflow: 'hidden' }}>
                  <Calendar
                    disablePast
                    disableFuture={
                      !(this.state.service_selected && this.state.slot_selected)
                    }
                    date={moment(this.state.date_selected, 'YYYY-MM-DD')}
                    onChange={this.handleDateChange}
                  />
                </Paper>
              </div>
            )}
          </BasePicker>
        </MuiPickersUtilsProvider>
        <div className={classes.buttonContainer}>
          <Button
            variant="outlined"
            disabled={
              !this.state.service_selected ||
              !this.state.slot_selected ||
              !this.state.date_selected
            }
            onClick={() => this.doSearch()}
          >
            <SearchIcon className={classes.leftIcon} />
            {t('slotSearcher.search')}
          </Button>
        </div>
        {this.state.has_been_searched ? (
          <React.Fragment>{this.renderBookableSlots()}</React.Fragment>
        ) : null}
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    paddingBottom: theme.spacing.unit * 32,
    maxWidth: 360,
    display: 'flex',
    flexDirection: 'column',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: theme.spacing.unit * 2,
  },
  sectionTitle: {
    paddingTop: theme.spacing.unit * 3,
    paddingBottom: theme.spacing.unit * 2,
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
  leftIcon: {
    marginRight: theme.spacing.unit,
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
)(PrivateServiceBooker);
