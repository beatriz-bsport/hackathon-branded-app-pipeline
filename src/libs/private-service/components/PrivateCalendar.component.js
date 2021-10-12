// @flow
import React from 'react';

import { compose, withStateHandlers } from 'recompose';
// import chroma from 'chroma-js';
import { withTranslation } from 'react-i18next';
import frLocale from '@fullcalendar/core/locales/fr';
import itLocale from '@fullcalendar/core/locales/it';
import deLocale from '@fullcalendar/core/locales/de';
import nlLocale from '@fullcalendar/core/locales/nl';
import withStyles from '@material-ui/core/styles/withStyles';
import TodayIcon from '@material-ui/icons/Today';
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
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import type { TFunction } from 'react-i18next';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';

// import momentTimezonePlugin from '@fullcalendar/moment-timezone';

// import listPlugin from '@fullcalendar/list';

import interactionPlugin from '@fullcalendar/interaction'; // needed for dayClick
import resourceTimeGrid from '@fullcalendar/resource-timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';

import moment from 'moment-timezone';
import { BOOKING_STATUS_OK } from '@bsport/common/lib/master-data/booking_status_code';

import './main.scss';
import './custom.scss';
// import { getTextColorFromRGB } from '../../../color';
import Select from 'react-select';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import i18n, { Moment } from '../../../i18n';
import type { AvailabilitySlot, PrivateBooking } from '../types';
import RecurrentAvailabilityFormDialog from './RecurrentAvailabilityFormDialog.component';

const styles = (theme) => ({
  container: {},
  leftIcon: { marginRight: theme.spacing(1) },
});

const availabilitySlotAsEvent = (resourceDatatypeView) => (slot) => {
  let resourceId = null;
  if (resourceDatatypeView === 'establishment') {
    resourceId = slot.establishment;
  }
  if (resourceDatatypeView === 'coach') {
    resourceId = slot.coach;
  }

  return {
    start: slot.date_start,
    end: slot.date_end,
    display: 'background',
    resourceId,
    classNames: slot.is_restriction ? ['isRestriction'] : [],
    ...(slot.color ? { backgroundColor: slot.color } : {}),
  };
};

const customEventAsEvent = (resourceDatatypeView) => (customEvent) => {
  let resourceIds = null;
  if (resourceDatatypeView === 'coach') {
    resourceIds = customEvent.associated_coaches.map((ac) => ac.coach_id);
  }
  return {
    start: customEvent.date_start,
    end: customEvent.date_end,
    title: customEvent.name,
    editable: false,
    textColor: 'black',
    ...(customEvent.color ? { borderColor: customEvent.color } : {}),
    extendedProps: {
      customEventId: customEvent.id,
    },
    resourceIds,
  };
};

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
    allDay: offer.duration_minute > 60 * 10,
    end: moment(offer.date_start)
      .add(offer.duration_minute, 'minutes')
      .format(),
    title: offer.meta_activity ? offer.meta_activity.name : '',
    editable: false,
    extendedProps: {
      offer: offer.id,
    },
    resourceId,
    textColor: 'black',
    classNames: [!offer.available ? 'cancelledEvent' : '', 'fc-event-bsport'],
    ...(offer.meta_activity && offer.meta_activity.color
      ? { borderColor: offer.meta_activity.color }
      : {}),
  };
};

const privateBookingAsEvent = (resourceDatatypeView) => (pb) => {
  let resourceId = null;
  if (resourceDatatypeView === 'establishment') {
    resourceId = pb.establishment;
    if (pb.establishment && pb.establishment.id) {
      resourceId = pb.establishment.id;
    }
  }
  if (resourceDatatypeView === 'coach') {
    resourceId = pb.coach;
    if (pb.coach && pb.coach.id) {
      resourceId = pb.coach.id;
    }
  }
  return {
    start: pb.date_start,
    end: pb.date_end,
    title: `${pb.first_in_company ? '★ ' : ''}${pb.name} ${
      (pb.member ? pb.member.name : '') || ''
    }`,
    editable: false,
    extendedProps: {
      private_booking: pb.id,
      private_booking_canceled: pb.date_canceled,
      private_booking_refunded: pb.was_refunded,
    },
    textColor: 'black',
    classNames: [
      pb.booking_status_code !== BOOKING_STATUS_OK.id ? 'cancelledEvent' : '',
    ],
    resourceId,
    borderColor: pb.private_service ? pb.private_service.color : '',
  };
};

const AvailabilitySlotForm = withTranslation(['privateService'])(
  withStyles(styles)(
    (props: {
      classes: Object,
      t: TFunction,
      onBookRequest: (any) => void,
      onEnableAvailability: (any) => void,
      onEnableRecurrentAvailability: (any) => void,
      onDisableAvailability: (any) => void,
      onDisableRecurrentAvailability: (any) => void,
      onCreateCustomEvent?: (any) => void,
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
          {!!props.onCreateCustomEvent && (
            <React.Fragment>
              <ListItem
                button
                onClick={props.onCreateCustomEvent}
                disabled={!props.onCreateCustomEvent}
              >
                <ListItemIcon>
                  <TodayIcon className={props.classes.leftIcon} />
                </ListItemIcon>
                <ListItemText primary={props.t('calendar.createCustomEvent')} />
              </ListItem>
            </React.Fragment>
          )}
        </List>
      );
    },
  ),
);

function format(value: number): string {
  const val = parseInt(value);
  return moment(`2021-10-01T${val < 10 ? `0${val}` : val}:00+02:00`).format(
    'LT',
  );
}

class TimePopup extends React.Component<Props> {
  state = {
    begin: this.props.userPreference.scheduleTimerange.begin,
    end: this.props.userPreference.scheduleTimerange.end,
  };

  onChangeBegin(begin: string) {
    this.setState({ begin });
  }

  onChangeEnd(end: string) {
    this.setState({ end });
  }

  render() {
    return (
      <div style={{ marginBottom: 20 }}>
        <Grid container justify="flex-start">
          <Grid md={2}>
            {this.props.t('popup.begin')}
            <Select
              placeholder={format(this.state.begin.split(':')[0])}
              options={[...Array(25).keys()].map((e) => ({
                value: e,
                label: format(e),
              }))}
              onChange={(e) => {
                const param =
                  e.value < 10 ? `0${e.value}:00:00` : `${e.value}:00:00`;
                this.onChangeBegin(param);
              }}
            />
          </Grid>
          <Grid xs={10} md={2} style={{ marginLeft: 15 }}>
            {this.props.t('popup.end')}
            <Select
              placeholder={format(this.state.end.split(':')[0])}
              options={[...Array(25).keys()].map((e) => ({
                value: e,
                label: format(e),
              }))}
              onChange={(e) => {
                const param =
                  e.value < 10 ? `0${e.value}:00:00` : `${e.value}:00:00`;
                this.onChangeEnd(param);
              }}
            />
          </Grid>
        </Grid>
        <Button
          style={{
            height: 35,
            marginTop: 5,
            marginBottom: 5,
            backgroundColor: '#20304B',
          }}
          onClick={() => {
            this.props.closePopup();
            this.props.setScheduleTimerange({
              begin: this.state.begin,
              end: this.state.end,
            });
          }}
        >
          <Typography variant="body2" style={{ color: 'white' }}>
            {this.props.t('popup.validate')}
          </Typography>
        </Button>
      </div>
    );
  }
}

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
    date_start: null,
    date_end: null,
    timePopup: false,
  };

  select = (eventSlotSelected: EventSlot) => {
    if (this.props.disableAvailabilitySlotDisplay) return;
    const { startStr, endStr } = eventSlotSelected;

    const start = moment.tz(startStr, this.props.timezone);
    const end = moment.tz(endStr, this.props.timezone);

    if (start.isSame(end, 'day')) {
      this.setState({
        eventSlotSelected: {
          ...eventSlotSelected,
          startStr: start.format(),
          endStr: end.format(),
        },
      });
    }
  };

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (!prevProps.resourceDatatypeView && this.props.resourceDatatypeView) {
      this.calendarRef.current.getApi().changeView('resourceTimeGridThreeDays');
      return;
    }
    if (!!prevProps.resourceDatatypeView && !this.props.resourceDatatypeView) {
      this.calendarRef.current.getApi().changeView('timeGridWeek');
      return;
    }
    if (
      this.state.date_start !== prevState.date_start ||
      this.state.date_end !== prevState.date_end
    ) {
      this.props.onDateChange({
        date_start: this.state.date_start,
        date_end: this.state.date_end,
      });
    }
  }

  dateClick = (eventSlotSelected: EventSlot) => {
    const start = moment.tz(eventSlotSelected.dateStr, this.props.timezone);

    this.setState({
      eventSlotSelected: {
        ...eventSlotSelected,
        startStr: start.format(),
        endStr: start.add(30, 'minutes').format(),
      },
    });
  };

  getAvailableSlotAsEvents = memoize(
    (
      availabilitySlots: Array<AvailabilitySlot>,
      privateBookings: Array<PrivateBooking>,
      offerList: Array<Offer>,
      resourceDatatypeView: ?string,
      customEventList?: Array<CustomEvent>,
    ) => {
      const events = [
        ...availabilitySlots.map(availabilitySlotAsEvent(resourceDatatypeView)),
        ...(offerList || []).map(offerAsEvent(resourceDatatypeView)),
        ...privateBookings.map(privateBookingAsEvent(resourceDatatypeView)),
        ...(customEventList || []).map(
          customEventAsEvent(resourceDatatypeView),
        ),
      ];

      const allDaySlot = events.reduce((acc, v) => acc || v.allDay, false);

      return {
        events,
        allDaySlot,
      };
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

  onCreateCustomEvent = () => {
    const { startStr, endStr } = this.state.eventSlotSelected;
    this.props.createCustomEvent(
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
    while (moment(startStr).add(i, 'week').isSameOrBefore(endDate, 'day')) {
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
    if (info.event.display !== 'background') {
      if (this.props.onEventClick) {
        this.props.onEventClick(info.el, info.event.extendedProps);
      }
    }
  };

  handleIntervalChange = ({ view }) => {
    const date_start = moment(view.currentStart).format('YYYY-MM-DD');
    const date_end = moment(view.currentEnd).format('YYYY-MM-DD');

    if (
      this.state.date_start !== date_start &&
      this.state.date_end !== date_end
    ) {
      this.setState({
        date_start: moment(view.currentStart).format('YYYY-MM-DD'),
        date_end: moment(view.currentEnd).format('YYYY-MM-DD'),
      });
    }
  };

  hideCancelledPrivateBookings = (privateBookings, hideCancelledEvents) => {
    if (hideCancelledEvents !== undefined) {
      if (hideCancelledEvents === true) {
        return privateBookings.filter(
          (pb) => pb.booking_status_code === BOOKING_STATUS_OK.id,
        );
      }
    }
    return privateBookings;
  };

  hideCancelledOffers = (offerList, hideCancelledEvents) => {
    if (hideCancelledEvents !== undefined) {
      if (hideCancelledEvents === true) {
        return offerList.filter((offer) => offer.available === true);
      }
    }
    return offerList;
  };

  handleEventRender = ({ event, el }) => {
    if (
      event._def.extendedProps.private_booking &&
      event._def.extendedProps.private_booking_canceled
    ) {
      const cancellationInfo = event._def.extendedProps.private_booking_refunded
        ? 'refunded'
        : 'notrefunded';
      const refundedChip = `<div class="InfoContainer ${cancellationInfo}"><i class="Info">&#8618;</i></div>`;
      el.getElementsByClassName('fc-event-time')[0].insertAdjacentHTML(
        'afterbegin',
        refundedChip,
      );
    }
  };

  render() {
    const { classes, t } = this.props;
    const { events, allDaySlot } = this.getAvailableSlotAsEvents(
      this.props.availabilitySlots,
      this.hideCancelledPrivateBookings(
        this.props.privateBookings,
        this.props.hideCancelledEvents,
      ),
      this.hideCancelledOffers(
        this.props.offerList,
        this.props.hideCancelledEvents,
      ),
      this.props.resourceDatatypeView,
      this.props.customEventList,
    );
    let initialView = 'timeGridWeek';
    if (window.innerWidth < 400) {
      initialView = 'timeGridDay';

      if (this.props.resourceDatatypeView) {
        initialView = 'resourceTimeGridDay';
      }
    } else if (this.props.resourceDatatypeView) {
      initialView = 'resourceTimeGridThreeDays';
    }
    return (
      <div className={classes.container}>
        {this.state.timePopup ? (
          <TimePopup
            userPreference={this.props.userPreference}
            closePopup={() => this.setState({ timePopup: false })}
            setScheduleTimerange={this.props.setScheduleTimerange}
            t={t}
          />
        ) : null}
        <FullCalendar
          ref={this.calendarRef}
          plugins={[
            interactionPlugin,
            timeGridPlugin,
            resourceTimeGrid,
            dayGridPlugin,
            // momentTimezonePlugin,
          ]}
          initialView={initialView}
          timeZone={this.props.timezone}
          customButtons={{
            zoomIn: {
              text: '+',
              click: this.props.zoomIn,
            },
            zoomOut: {
              text: '-',
              click: this.props.zoomOut,
            },
            changeTime: {
              text: t('popup.button'),
              click: () => {
                this.setState({ timePopup: true });
              },
            },
          }}
          views={{
            resourceTimeGridThreeDays: {
              type: 'resourceTimeGrid',
              duration: { days: 3 },
              buttonText: t('calendar.header.threeDaysView'),
            },
            resourceTimeGridDay: {
              titleFormat: {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              },
            },
          }}
          headerToolbar={{
            left: 'prev,next today changeTime',
            center: isWidthUp('sm', this.props.width) ? 'title' : '',
            right: this.props.resourceDatatypeView
              ? 'zoomOut,zoomIn resourceTimeGridDay,resourceTimeGridThreeDays,resourceTimeGridWeek'
              : 'zoomOut,zoomIn timeGridDay,timeGridWeek,dayGridMonth',
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
          eventDidMount={this.handleEventRender}
          locale={i18n.language === 'en' ? 'en-GB' : i18n.language}
          firstDay={Moment.localeData()._week.dow}
          slotDuration={
            // eslint-disable-next-line
            `00:${15 * 2 ** this.props.zoomLevel}:00`
          }
          locales={[frLocale, itLocale, deLocale, nlLocale]}
          slotMinTime={
            this.props.userPreference?.scheduleTimerange?.begin || '06:00:00'
          }
          slotMaxTime={
            this.props.userPreference?.scheduleTimerange?.end || '23:00:00'
          }
          allDaySlot={allDaySlot}
          eventClick={this.handleEventClick}
          datesSet={this.handleIntervalChange}
        />
        {this.props.disableAvailabilitySlotDisplay ? null : (
          <Popover
            open={!!this.state.eventSlotSelected}
            onClose={() => this.setState({ eventSlotSelected: null })}
            anchorOrigin={{
              vertical: 'center',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'center',
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
              onCreateCustomEvent={
                this.props.createCustomEvent
                  ? () => {
                      this.onCreateCustomEvent(
                        this.state.eventSlotSelected.startStr,
                      );
                      this.setState({ eventSlotSelected: null });
                    }
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
  withStateHandlers(
    { zoomLevel: 1 },
    {
      zoomIn: ({ zoomLevel }) => () => ({
        zoomLevel: Math.max(zoomLevel - 1, 0),
      }),
      zoomOut: ({ zoomLevel }) => () => ({
        zoomLevel: Math.min(zoomLevel + 1, 2),
      }),
    },
  ),
  withTranslation(['privateService']),
  withMobileDialog(),
  withStyles(styles, { withTheme: true }),
  withWidth(),
)(PrivateCalendar);
