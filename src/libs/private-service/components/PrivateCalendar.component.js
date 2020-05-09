// @flow
import React from 'react';

import { compose } from 'recompose';
// import chroma from 'chroma-js';
import { withNamespaces } from 'react-i18next';
import frLocale from '@fullcalendar/core/locales/fr';
import withStyles from '@material-ui/core/styles/withStyles';
import Popover from '@material-ui/core/Popover';
import CancelIcon from '@material-ui/icons/Cancel';
import List from '@material-ui/core/List';
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
// import listPlugin from '@fullcalendar/list';

import interactionPlugin from '@fullcalendar/interaction'; // needed for dayClick
import resourceTimeGrid from '@fullcalendar/resource-timegrid';

import moment from 'moment';
import { BOOKING_STATUS_OK } from '@bsport/common/lib/master-data/booking_status_code';
import i18n from '../../../i18n';

import './main.scss';
import './custom.scss';
import RecurrentAvailabilityFormDialog from './RecurrentAvailabilityFormDialog.component';
// import { getTextColorFromRGB } from '../../../color';
import type { AvailabilitySlot, PrivateBooking } from '../types';

const styles = (theme) => ({
  container: {},
  leftIcon: { marginRight: theme.spacing(1) },
});

const availabilitySlotAsEvent = (slot) => ({
  start: slot.date_start,
  end: slot.date_end,
  rendering: 'background',
  classNames: slot.is_restriction ? ['isRestriction'] : [],
  ...(slot.color ? { backgroundColor: slot.color } : {}),
});

const offerAsEvent = (resourceDatatypeView) => (offer) => {
  let resourceId = null;
  if (resourceDatatypeView === 'establishment') {
    resourceId = offer.establishment;
  }
  if (resourceDatatypeView === 'coach') {
    resourceId = offer.coach;
  }

  return {
    start: offer.date_start,
    end: moment(offer.date_start).add(offer.duration_minute, 'minutes'),
    title: offer.meta_activity ? offer.meta_activity.name : '',
    editable: false,
    extendedProps: {
      offer: offer.id,
    },
    resourceId,
    textColor: 'black',
    classNames: [!offer.available ? 'cancelledEvent' : ''],
    ...(offer.meta_activity && offer.meta_activity.color
      ? { borderColor: offer.meta_activity.color }
      : {}),
  };
};

const privateBookingAsEvent = (resourceDatatypeView) => (pb) => {
  let resourceId = null;
  if (resourceDatatypeView === 'establishment') {
    resourceId = pb.establishment;
  }
  if (resourceDatatypeView === 'coach') {
    resourceId = pb.coach;
  }
  return {
    start: pb.date_start,
    end: pb.date_end,
    title: pb.name,
    editable: false,
    extendedProps: {
      private_booking: pb.id,
    },
    textColor: 'black',
    classNames: [
      pb.booking_status_code !== BOOKING_STATUS_OK.id ? 'cancelledEvent' : '',
    ],
    resourceId,
    borderColor:
      pb.private_slot && pb.private_slot.private_service
        ? pb.private_slot.private_service.color
        : '',
  };
};

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
          {props.onBookRequest ? (
            <ListItem button onClick={props.onBookRequest}>
              <ListItemIcon color="primary">
                <PersonAddIcon className={props.classes.leftIcon} />
              </ListItemIcon>
              <ListItemText primary={props.t('calendar.addBooking')} />
            </ListItem>
          ) : null}
          {props.onEnableAvailability ? (
            <React.Fragment>
              <ListItem button onClick={props.onEnableAvailability}>
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
            </React.Fragment>
          ) : null}
          {props.onDisableAvailability ? (
            <React.Fragment>
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
            </React.Fragment>
          ) : null}
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

  disableWithRecurrence: boolean,
  enableWithRecurrence: boolean,
  eventSlotSelected: ?EventSlot,
};

export class PrivateCalendar extends React.Component<Props, State> {
  calendarRef = React.createRef();

  state = {
    selectInfo: null,

    disableWithRecurrence: false,
    enableWithRecurrence: false,
  };

  select = (eventSlotSelected: EventSlot) => {
    if (this.props.disableAvailabilitySlotDisplay) return;
    const { startStr, endStr } = eventSlotSelected;
    if (moment(startStr).isSame(endStr, 'day')) {
      this.setState({
        eventSlotSelected,
      });
    }
  };

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.resourceDatatypeView && this.props.resourceDatatypeView) {
      this.calendarRef.current.getApi().changeView('resourceTimeGridThreeDays');
      return;
    }
    if (!!prevProps.resourceDatatypeView && !this.props.resourceDatatypeView) {
      this.calendarRef.current.getApi().changeView('timeGridWeek');
      return;
    }
    if (prevProps.resourceDatatypeView !== this.props.resourceDatatypeView) {
      this.calendarRef.current.getApi().render();
    }
  }

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
      offerList: Array<Offer>,
      resourceDatatypeView: ?string,
    ) => {
      return [
        ...availabilitySlots.map(availabilitySlotAsEvent),
        ...(offerList || []).map(offerAsEvent(resourceDatatypeView)),
        ...privateBookings.map(privateBookingAsEvent(resourceDatatypeView)),
      ];
    },
  );

  onDisableAvailability = () => {
    const { startStr, endStr } = this.state.eventSlotSelected;
    this.props.disableResourceAvailabilitySlot(
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
    this.props.enableResourceAvailabilitySlot(
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
      ? this.props.enableResourceAvailabilitySlot
      : this.props.disableResourceAvailabilitySlot)(
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
      if (this.props.onEventClick) {
        this.props.onEventClick(info.el, info.event.extendedProps);
      }
    }
  };

  handleIntervalChange = ({ view }) => {
    this.props.onDateChange({
      date_start: moment(view.currentStart).format('YYYY-MM-DD'),
      date_end: moment(view.currentEnd).format('YYYY-MM-DD'),
    });
  };

  render() {
    const { classes } = this.props;
    const events = this.getAvailableSlotAsEvents(
      this.props.availabilitySlots,
      this.props.privateBookings,
      this.props.offerList,
      this.props.resourceDatatypeView,
    );

    return (
      <div className={classes.container}>
        <FullCalendar
          ref={this.calendarRef}
          defaultView={
            this.props.resourceDatatypeView
              ? 'resourceTimeGridThreeDays'
              : 'timeGridWeek'
          }
          plugins={[interactionPlugin, timeGridPlugin, resourceTimeGrid]}
          views={{
            resourceTimeGridThreeDays: {
              type: 'resourceTimeGrid',
              duration: { days: 3 },
              buttonText: '3 jours',
            },
          }}
          header={{
            left: 'prev,next today',
            center: 'title',
            right: this.props.resourceDatatypeView
              ? 'resourceTimeGridDay,resourceTimeGridThreeDays,resourceTimeGridWeek'
              : 'timeGridDay,timeGridWeek',
          }}
          schedulerLicenseKey="0683005223-fcs-1587553109"
          filterResourcesWithEvents
          resources={this.props.resources}
          editable
          selectable
          dateA
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
        />
        {this.props.disableAvailabilitySlotDisplay ? null : (
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
                this.props.disableResourceAvailabilitySlot
                  ? this.onDisableAvailability
                  : null
              }
              onBookRequest={
                this.props.onBookRequest
                  ? () => {
                      this.props.onBookRequest(
                        this.state.eventSlotSelected.startStr,
                      );
                      this.setState({ eventSlotSelected: null });
                    }
                  : null
              }
              onEnableAvailability={
                this.props.enableResourceAvailabilitySlot
                  ? this.onEnableAvailability
                  : null
              }
              onEnableRecurrentAvailability={
                this.props.enableResourceAvailabilitySlot
                  ? () => this.setState({ enableWithRecurrence: true })
                  : null
              }
              onDisableRecurrentAvailability={
                this.props.disableResourceAvailabilitySlot
                  ? () => this.setState({ disableWithRecurrence: true })
                  : null
              }
            />
          </Popover>
        )}
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
      </div>
    );
  }
}

export default compose(
  withNamespaces(['privateService']),
  withMobileDialog(),
  withStyles(styles, { withTheme: true }),
)(PrivateCalendar);
