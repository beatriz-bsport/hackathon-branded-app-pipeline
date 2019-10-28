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
import Fade from '@material-ui/core/Fade';
import ListItem from '@material-ui/core/ListItem';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import CheckIcon from '@material-ui/icons/Check';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import RefreshIcon from '@material-ui/icons/Refresh';
import memoize from 'memoize-one';

import type { TFunction } from 'react-i18next';
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
import { getTextColorFromRGB } from '../../../color';
import type { AvailabilitySlot, PrivateBooking } from '../types';

const styles = (theme) => ({
  container: {},
  leftIcon: { marginRight: theme.spacing.unit },
});

const AvailabilitySlotForm = withNamespaces(['privateService'])(
  withStyles(styles)(
    (props: {
      classes: Object,
      t: TFunction,
      onBookRequest: (any) => void,
      onEnableAvailability: (any) => void,
      onEnableRecurrentAvailability: (any) => void,
      onDisableAvailability: (any) => void,
      onDisableRecurrentAvailability: (any) => void,
      selectInfo: Object,
    }) => {
      return (
        <List>
          <ListItem button onClick={props.onBookRequest}>
            <ListItemIcon color="primary">
              <PersonAddIcon className={props.classes.leftIcon} />
            </ListItemIcon>
            <ListItemText primary={props.t('calendar.addBooking')} />
          </ListItem>
          <ListItem
            button
            onClick={props.onEnableAvailability}
            disabled={!props.onEnableAvailability}
          >
            <ListItemIcon color="primary">
              <CheckIcon className={props.classes.leftIcon} />
            </ListItemIcon>
            <ListItemText
              primary={props.t('calendar.enableAvailability')}
              secondary={
                props.onEnableAvailability
                  ? null
                  : props.t('calendar.selectCoachToModifyAvailability')
              }
            />
          </ListItem>
          <ListItem
            button
            onClick={props.onEnableRecurrentAvailability}
            disabled={!props.onEnableRecurrentAvailability}
          >
            <ListItemIcon color="primary">
              <RefreshIcon className={props.classes.leftIcon} />
            </ListItemIcon>
            <ListItemText
              primary={props.t('calendar.enableRecurrentAvailability')}
              secondary={
                props.onEnableRecurrentAvailability
                  ? null
                  : props.t('calendar.selectCoachToModifyAvailability')
              }
            />
          </ListItem>
          <ListItem
            button
            onClick={props.onDisableAvailability}
            disabled={!props.onDisableAvailability}
          >
            <ListItemIcon>
              <CancelIcon className={props.classes.leftIcon} />
            </ListItemIcon>
            <ListItemText
              primary={props.t('calendar.disableAvailability')}
              secondary={
                props.onDisableAvailability
                  ? null
                  : props.t('calendar.selectCoachToModifyAvailability')
              }
            />
          </ListItem>
          <ListItem
            button
            onClick={props.onDisableRecurrentAvailability}
            disabled={!props.onDisableRecurrentAvailability}
          >
            <ListItemIcon color="primary">
              <RefreshIcon className={props.classes.leftIcon} />
            </ListItemIcon>
            <ListItemText
              primary={props.t('calendar.disableRecurrentAvailability')}
              secondary={
                props.onDisableRecurrentAvailability
                  ? null
                  : props.t('calendar.selectCoachToModifyAvailability')
              }
            />
          </ListItem>
        </List>
      );
    },
  ),
);

type EventSlot = {
  startStr: string,
  endStr: string,
};

type State = {
  selectInfo: Object,
  selectedPrivateBooking: PrivateBooking,
  selectedPrivateBookingAnchorEl: ?HTMLElement,
  disableWithRecurrence: boolean,
  enableWithRecurrence: boolean,
  eventSlotSelected: ?EventSlot,
};

export class CoachPrivateCalendar extends React.Component<Props, State> {
  state = {
    selectInfo: null,
    selectedPrivateBooking: null,
    selectedPrivateBookingAnchorEl: null,
    disableWithRecurrence: false,
    enableWithRecurrence: false,
  };

  select = (eventSlotSelected: EventSlot) => {
    const { startStr, endStr } = eventSlotSelected;
    if (moment(startStr).isSame(endStr, 'day')) {
      this.setState({
        eventSlotSelected,
      });
    }
  };

  dateClick = (eventSlotSelected: EventSlot) => {
    this.setState({
      eventSlotSelected: {
        ...eventSlotSelected,
        startStr: eventSlotSelected.dateStr,
        endStr: moment(eventSlotSelected.dateStr).add(30, 'minutes'),
      },
    });
  };

  getAvailableSlotAsEvents = memoize(
    (
      availabilitySlots: Array<AvailabilitySlot>,
      privateBookings: Array<PrivateBooking>,
    ) => {
      const themeColor = this.props.theme.palette.primary.main;
      const themeColorRGB = chroma(themeColor).rgb();
      const textColor = getTextColorFromRGB(themeColorRGB);

      return [
        ...availabilitySlots.map((slot) => ({
          start: slot.date_start,
          end: slot.date_end,
          rendering: 'background',
          ...(slot.color ? { backgroundColor: slot.color } : {}),
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
          this.setState({
            enableWithRecurrence: false,
            disableWithRecurrence: false,
            eventSlotSelected: null,
          });
        },
      },
    );
  };

  handleEventClick = (info) => {
    if (info.event.rendering !== 'background') {
      this.setState({
        selectedPrivateBooking: info.event.extendedProps.private_booking,
        selectedPrivateBookingAnchorEl: info.el,
      });
    }
  };

  handleIntervalChange = ({ view }) => {
    this.props.onDateChange({
      date_start: moment(view.currentStart).format('YYYY-MM-DD'),
      date_end: moment(view.currentEnd).format('YYYY-MM-DD'),
    });
  };

  addEventHoverListener = (info) => {
    info.el.addEventListener('mouseenter', () => {
      if (info.event.rendering !== 'background') {
        this.setState({
          selectedPrivateBooking: info.event.extendedProps.private_booking,
          selectedPrivateBookingAnchorEl: info.el,
        });
      }
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
          editable
          selectable
          select={this.select}
          dateClick={this.dateClick}
          events={events}
          locale={i18n.lng}
          locales={[frLocale]}
          minTime="06:00:00"
          maxTime="23:00:00"
          allDaySlot={false}
          eventClick={this.handleEventClick}
          datesRender={this.handleIntervalChange}
          eventRender={this.addEventHoverListener}
        />
        <Popover
          open={!!this.state.selectedPrivateBookingAnchorEl}
          anchorEl={this.state.selectedPrivateBookingAnchorEl}
          TransitionComponent={Fade}
          onClose={() =>
            this.setState({
              // selectedPrivateBooking: null,
              selectedPrivateBookingAnchorEl: null,
            })
          }
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'right',
          }}
        >
          {this.state.selectedPrivateBooking ? (
            <div className={classes.eventPopupContent}>
              <PrivateBookingCard
                goToMember={this.props.goToMember}
                private_booking={this.state.selectedPrivateBooking}
                onDelete={() =>
                  this.setState((prevState) => ({
                    bookingToDisable: prevState.selectedPrivateBooking,
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
            onDisableAvailability={
              this.props.coachId ? this.onDisableAvailability : null
            }
            onBookRequest={() => {
              this.props.onBookRequest(this.state.eventSlotSelected.startStr);
              this.setState({ eventSlotSelected: null });
            }}
            onEnableAvailability={
              this.props.coachId ? this.onEnableAvailability : null
            }
            onEnableRecurrentAvailability={
              this.props.coachId
                ? () => this.setState({ enableWithRecurrence: true })
                : null
            }
            onDisableRecurrentAvailability={
              this.props.coachId
                ? () => this.setState({ disableWithRecurrence: true })
                : null
            }
          />
        </Popover>
        <RecurrentAvailabilityFormDialog
          fullScreen={this.props.fullScreen}
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
          fullScreen={this.props.fullScreen}
          open={!!this.state.bookingToDisable}
          private_booking={this.state.bookingToDisable}
          onSubmit={(force_refund) =>
            (this.state.bookingToDisable.booking_status_code ===
              BOOKING_STATUS_OK.id
              ? this.props.disablePrivateBooking
              : this.props.deletePrivateBooking)(
              this.state.bookingToDisable.id,
              { force_refund },
              {
                onSuccess: () => {
                  this.setState({
                    selectedPrivateBookingAnchorEl: null,
                    // selectedPrivateBooking: null,
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
  withNamespaces(['privateService']),
  withMobileDialog(),
  withStyles(styles, { withTheme: true }),
)(CoachPrivateCalendar);
