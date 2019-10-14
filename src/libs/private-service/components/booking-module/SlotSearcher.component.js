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
import moment from 'moment';
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
    coach_selected: number,
    date_selected: string,
  ) => void,

  onPrivateServiceChange: (?PrivateService) => void,
  onPrivateSlotChange: (?PrivateSlot) => void,
  onCoachChange: (?Coach) => void,
  onDateChange: (Object) => void,
};

type State = {
  service_selected: ?PrivateService,
  slot_selected: ?PrivateSlot,
  coach_selected: ?AssociatedCoach,
  date_selected: ?string,
};

export class PrivateServiceBooker extends React.Component<Props, State> {
  state = {
    slot_selected: null,
    service_selected: null,
    coach_selected: null,
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

  onDateClick = (date: string) => {
    this.props.onClickBook(
      this.state.service_selected.id,
      this.state.slot_selected.id,
      this.state.coach_selected,
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
    return (
      <React.Fragment>
        {this.props.bookable_slots.length === 0 ? (
          <Typography color="textSecondary">
            {this.props.t('slotSearcher.bookableSlots.isEmpty')}
          </Typography>
        ) : null}
        {[0, 1, 2, 3]
          .map((columnIdx) => {
            const columnSize = parseInt(
              this.props.bookable_slots.length / 4,
              10,
            );
            return this.props.bookable_slots.slice(
              columnIdx * columnSize,
              columnIdx === 3
                ? this.props.bookable_slots.length
                : (columnIdx + 1) * columnSize,
            );
          })
          .map((bookable_slot_column, columnIdx) => (
            <div
              key={columnIdx}
              className={this.props.classes.bookableSlotColumn}
            >
              {bookable_slot_column.map((bookable_slot) => (
                <Fab
                  size="small"
                  variant="extended"
                  color="primary"
                  key={bookable_slot}
                  className={this.props.classes.bookableSlotFabButton}
                  onClick={() => this.onDateClick(bookable_slot)}
                >
                  {moment(bookable_slot).format('HH:mm')}
                </Fab>
              ))}
            </div>
          ))}
      </React.Fragment>
    );
  };

  handleCoachChange = (coach_selected: number, coach: Coach) => {
    this.setState({ coach_selected });
    this.props.onCoachChange(coach);
  };

  handleDateChange = (date_selected: Object) => {
    this.setState({
      date_selected: date_selected.format('YYYY-MM-DD'),
    });
    this.props.onDateChange(date_selected);
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
          noMulti
          selectedCoaches={
            this.state.coach_selected ? [this.state.coach_selected] : []
          }
          isDisabled={
            !(
              this.state.service_selected &&
              this.state.service_selected.coaches.length
            )
          }
          selectOption={(option) =>
            this.handleCoachChange(
              option.value,
              this.state.service_selected.coaches.find(
                (c) => c.id === option.value,
              ),
            )
          }
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
                      !(
                        this.state.coach_selected &&
                        this.state.service_selected &&
                        this.state.slot_selected
                      )
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
              !this.state.coach_selected ||
              !this.state.date_selected
            }
            onClick={() => {
              this.setState({ has_been_searched: true });
              this.props.searchAvailableSlots(
                this.state.service_selected.id,
                this.state.slot_selected.id,
                this.state.coach_selected,
                this.state.date_selected,
              );
            }}
          >
            <SearchIcon className={classes.leftIcon} />
            {t('slotSearcher.search')}
          </Button>
        </div>
        {this.state.has_been_searched ? (
          <React.Fragment>
            <Typography variant="h6" className={classes.sectionTitle}>
              {t('slotSearcher.bookableSlots.title')}
            </Typography>
            <div className={classes.bookableSlotsContainer}>
              {this.renderBookableSlots()}
            </div>
          </React.Fragment>
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
});

export default compose(
  withNamespaces(['privateService']),
  withStyles(styles),
)(PrivateServiceBooker);
