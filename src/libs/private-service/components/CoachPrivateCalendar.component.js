// @flow
import React from 'react';

import { compose } from 'recompose';
import chroma from 'chroma-js';
import { withNamespaces } from 'react-i18next';
import frLocale from '@fullcalendar/core/locales/fr';
import withStyles from '@material-ui/core/styles/withStyles';
import Popover from '@material-ui/core/Popover';
import CancelIcon from '@material-ui/icons/Cancel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import CheckIcon from '@material-ui/icons/Check';
import RefreshIcon from '@material-ui/icons/Refresh';
import memoize from 'memoize-one';

// import type { TFunction } from 'react-i18next';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // needed for dayClick
import moment from 'moment';
import { BOOKING_STATUS_OK } from '@bsport/common/lib/master-data/booking_status_code';
import i18n from '../../../i18n';

import './main.scss';
import RecurrentAvailabilityFormDialog from './RecurrentAvailabilityFormDialog.component';
import PrivateBookingCard from './PrivateBookingCard.component';
import PrivateBookingDisableDialog from './PrivateBookingDisableDialog.component';
import type { AvailabilitySlot, PrivateBooking } from '../types';

const styles = (theme) => ({
  container: {},
  leftIcon: { marginRight: theme.spacing.unit },
});

const AvailabilitySlotForm = withNamespaces(['privateService'])(
  withStyles(styles)((props: { selectInfo: Object }) => {
    return (
      <List>
        <ListItem button onClick={props.onEnableAvailability}>
          <ListItemIcon color="primary">
            <CheckIcon className={props.classes.leftIcon} />
          </ListItemIcon>
          <ListItemText primary={props.t('calendar.enableAvailability')} />
        </ListItem>
        <ListItem button onClick={props.onEnableRecurrentAvailability}>
          <ListItemIcon color="primary">
            <RefreshIcon className={props.classes.leftIcon} />
          </ListItemIcon>
          <ListItemText
            primary={props.t('calendar.enableRecurrentAvailability')}
          />
        </ListItem>
        <ListItem button onClick={props.onDisableAvailability}>
          <ListItemIcon>
            <CancelIcon className={props.classes.leftIcon} />
          </ListItemIcon>
          <ListItemText primary={props.t('calendar.disableAvailability')} />
        </ListItem>
        <ListItem button onClick={props.onDisableRecurrentAvailability}>
          <ListItemIcon color="primary">
            <RefreshIcon className={props.classes.leftIcon} />
          </ListItemIcon>
          <ListItemText
            primary={props.t('calendar.disableRecurrentAvailability')}
          />
        </ListItem>
      </List>
    );
  }),
);

type State = {
  selectInfo: Object,
  selectedPrivateBooking: PrivateBooking,
  selectedPrivateBookingAnchorEl: ?HTMLElement,
  disableWithRecurrence: boolean,
  enableWithRecurrence: boolean,
  date_start: ?string,
  date_end: ?string,
};

export class CoachPrivateCalendar extends React.Component<Props, State> {
  state = {
    selectInfo: null,
    selectedPrivateBooking: null,
    selectedPrivateBookingAnchorEl: null,
    disableWithRecurrence: false,
    enableWithRecurrence: false,
    date_start: null,
    date_end: null,
  };

  select = (eventSlotSelected) => {
    if (this.props.coachId) {
      const { startStr, endStr } = eventSlotSelected;
      if (moment(startStr).isSame(endStr, 'day')) {
        this.setState({
          eventSlotSelected,
        });
      }
    }
  };

  getAvailableSlotAsEvents = memoize(
    (
      availabilitySlots: Array<AvailabilitySlot>,
      privateBookings: Array<PrivateBooking>,
    ) => {
      const themeColor = this.props.theme.palette.primary.main;
      const themeColorRGB = chroma(themeColor).rgb();
      const textColor =
        themeColorRGB[0] * 0.299 +
          themeColorRGB[1] * 0.587 +
          themeColorRGB[2] * 0.114 >
        186
          ? '#000000'
          : '#ffffff';

      return [
        ...availabilitySlots.map((slot) => ({
          start: slot.date_start,
          end: slot.date_end,
          rendering: 'background',
        })),
        ...privateBookings.map((pb) => ({
          start: pb.date_start,
          end: pb.date_end,
          title: pb.name,
          editable: false,
          extendedProps: {
            private_booking: pb,
          },
          ...(pb.booking_status_code !== BOOKING_STATUS_OK.id
            ? { backgroundColor: '#F44436', borderColor: '#F44436' }
            : {
                backgroundColor: themeColor,
                borderColor: themeColor,
                textColor,
              }),
        })),
      ];
    },
  );

  fetchWeekData = () => {
    const { date_start, date_end } = this.state;
    if (this.props.coachId) {
      this.props.fetchAvailabilitySlots({
        coach: this.props.coachId,
        date_start__gte: date_start,
        date_start__lte: date_end,
      });
      this.props.fetchPrivateBookings({
        coach: this.props.coachId,
        date_start__gte: date_start,
        date_start__lte: date_end,
      });
    } else {
      this.props.fetchPrivateBookings({
        date_start__gte: date_start,
        date_start__lte: date_end,
      });
    }
  };

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (
      prevState.date_start !== this.state.date_start ||
      prevState.date_end !== this.state.date_end ||
      this.props.coachId !== prevProps.coachId
    ) {
      this.fetchWeekData();
    }
  }

  onDisableAvailability = () => {
    const { startStr, endStr } = this.state.eventSlotSelected;
    this.props.disableCoachAvailabilitySlot(
      this.props.coachId,
      {
        date_start: startStr,
        date_end: endStr,
      },
      {
        onSuccess: () => {
          this.props.fetchAvailabilitySlots({ coach: this.props.coachId });
          this.setState({ eventSlotSelected: null });
        },
      },
    );
  };

  onEnableAvailability = () => {
    const { startStr, endStr } = this.state.eventSlotSelected;
    this.props.enableCoachAvailabilitySlot(
      this.props.coachId,
      {
        date_start: startStr,
        date_end: endStr,
      },
      {
        onSuccess: () => {
          this.props.fetchAvailabilitySlots({ coach: this.props.coachId });
          this.setState({ eventSlotSelected: null });
        },
      },
    );
  };

  createRecurrence = (recurrence_until: string) => {
    const { enableWithRecurrence, eventSlotSelected } = this.state;
    const { startStr, endStr } = eventSlotSelected;
    const endDate = moment(recurrence_until);
    const all_date_start = [];
    let i = 0;
    while (
      moment(startStr)
        .add(i, 'week')
        .isSameOrBefore(endDate, 'day')
    ) {
      all_date_start.push(moment(startStr).add(i, 'week'));
      i += 1;
    }

    (enableWithRecurrence
      ? this.props.enableCoachAvailabilitySlot
      : this.props.disableCoachAvailabilitySlot)(
      this.props.coachId,
      {
        date_start: startStr,
        date_end: endStr,
        all_date_start,
      },
      {
        onSuccess: () => {
          this.props.fetchAvailabilitySlots({ coach: this.props.coachId });
          this.setState({
            enableWithRecurrence: false,
            disableWithRecurrence: false,
            eventSlotSelected: null,
          });
        },
      },
    );
  };

  calendarRef = React.createRef();

  handleEventClick = (info) => {
    if (info.event.rendering !== 'background') {
      this.setState({
        selectedPrivateBooking: info.event.extendedProps.private_booking,
        selectedPrivateBookingAnchorEl: info.el,
      });
    }
  };

  handleIntervalChange = ({ view }) => {
    this.setState({
      date_start: moment(view.currentStart).format('YYYY-MM-DD'),
      date_end: moment(view.currentEnd).format('YYYY-MM-DD'),
    });
  };

  render() {
    const { classes } = this.props;
    const events = this.getAvailableSlotAsEvents(
      this.props.availabilitySlots,
      this.props.privateBookings,
    );
    return (
      <div className={classes.container}>
        <FullCalendar
          defaultView="timeGridWeek"
          plugins={[interactionPlugin, timeGridPlugin]}
          editable={!!this.props.coachId}
          selectable={!!this.props.coachId}
          ref={this.calendarRef}
          select={this.select}
          events={events}
          locale={i18n.lng}
          locales={[frLocale]}
          minTime="06:00:00"
          maxTime="23:00:00"
          allDaySlot={false}
          eventClick={this.handleEventClick}
          datesRender={this.handleIntervalChange}
        />
        <Popover
          open={!!this.state.selectedPrivateBookingAnchorEl}
          anchorEl={this.state.selectedPrivateBookingAnchorEl}
          onClose={() =>
            this.setState({
              selectedPrivateBooking: null,
              selectedPrivateBookingAnchorEl: null,
            })
          }
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          {this.state.selectedPrivateBooking ? (
            <div className={classes.eventPopupContent}>
              <PrivateBookingCard
                goToMember={this.props.goToMember}
                private_booking={this.state.selectedPrivateBooking}
                onDelete={() =>
                  this.setState((prevState) => ({
                    bookingToDisable: prevState.selectedPrivateBooking.id,
                  }))
                }
              />
            </div>
          ) : null}
        </Popover>
        <Popover
          open={!!this.state.eventSlotSelected}
          anchorEl={
            this.state.eventSlotSelected
              ? this.state.eventSlotSelected.jsEvent.target
              : null
          }
          onClose={() => this.setState({ eventSlotSelected: null })}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <AvailabilitySlotForm
            selectInfo={this.state.selectInfo}
            onDisableAvailability={this.onDisableAvailability}
            onEnableAvailability={this.onEnableAvailability}
            onEnableRecurrentAvailability={() =>
              this.setState({ enableWithRecurrence: true })
            }
            onDisableRecurrentAvailability={() =>
              this.setState({ disableWithRecurrence: true })
            }
          />
        </Popover>
        <RecurrentAvailabilityFormDialog
          open={
            this.state.disableWithRecurrence || this.state.enableWithRecurrence
          }
          mode={this.state.disableWithRecurrence ? 'disable' : 'enable'}
          eventSlot={this.state.eventSlotSelected}
          onSubmit={this.createRecurrence}
          loading={this.props.availabilitySlotUpdating}
          onClose={() =>
            this.setState({
              enableWithRecurrence: false,
              disableWithRecurrence: false,
            })
          }
        />
        <PrivateBookingDisableDialog
          open={!!this.state.bookingToDisable}
          onSubmit={(force_refund) =>
            this.props.disablePrivateBooking(
              this.state.bookingToDisable,
              { force_refund },
              {
                onSuccess: () => {
                  this.setState({
                    selectedPrivateBookingAnchorEl: null,
                    selectedPrivateBooking: null,
                    bookingToDisable: null,
                  });
                },
                onError: () => {
                  this.setState({ bookingToDisable: null });
                },
              },
            )
          }
          onClose={() => this.setState({ bookingToDisable: null })}
        />
      </div>
    );
  }
}

export default compose(
  withStyles(styles, { withTheme: true }),
  withNamespaces(['privateService']),
)(CoachPrivateCalendar);
