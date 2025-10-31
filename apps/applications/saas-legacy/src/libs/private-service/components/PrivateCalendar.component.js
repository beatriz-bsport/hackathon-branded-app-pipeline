// @flow
import React from 'react';

import { compose } from 'recompose';
import chroma from 'chroma-js';
import { withTranslation, TFunction } from 'react-i18next';
import frLocale from '@fullcalendar/core/locales/fr';
import itLocale from '@fullcalendar/core/locales/it';
import deLocale from '@fullcalendar/core/locales/de';
import nlLocale from '@fullcalendar/core/locales/nl';
import withStyles from '@material-ui/core/styles/withStyles';
import Immutable from 'seamless-immutable';
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
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import InfoIcon from '@material-ui/icons/Info';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import { Settings, DateTime, Info } from 'luxon';

import interactionPlugin from '@fullcalendar/interaction'; // needed for dayClick
import resourceTimeGrid from '@fullcalendar/resource-timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';

import { BOOKING_STATUS_OK } from '@bsport/common/lib/master-data/booking_status_code.js';
import { LocalizedLuxonUtils } from '#src/i18n/utils/luxon-picker-utils';
import ReplacementRequestPendingChip from '#src/libs/replacement-request/components/replacement-request-table/ReplacementRequestPendingChip.component';
import SlotDetailDialog from '#src/libs/private-service/components/availability/SlotDetailDialog.component';
import ObjectLevelPermissionWrapper from '#src/libs/role/permission-utils/ObjectLevelPermissionWrapper.component';
import {
  groupSlotsAndMerge,
  intersectSelectionWithMergedIntervals,
  formatSlotDetailData,
} from '../utils';

import './main.scss';
import './custom.scss';
import i18n, { LANGUAGES } from '../../../i18n';
import type { AvailabilitySlot, PrivateBooking } from '../types';
import RecurrentAvailabilityFormDialog from './RecurrentAvailabilityFormDialog.component';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SyncCalendarDialog from './sync-calendar/SyncCalendarDialog.tsx';

const EVENT_DEFAULT_COLOR = '#8fdf82';
const ZOOM_LEVEL_FALLBACK = 0.5;
const SUPPORTED_LOCALES = Immutable([frLocale, itLocale, deLocale, nlLocale]);
const SUPPORTED_PLUGINS = Immutable([
  interactionPlugin,
  timeGridPlugin,
  resourceTimeGrid,
  dayGridPlugin,
]);

const renderEventContent = (eventInfo) => {
  if (eventInfo.event._def.groupId === 'specific-availability') {
    const { color } = eventInfo.event._def.extendedProps;
    return <div className="withBorder" style={{ borderLeftColor: color }} />;
  }
  const {
    private_booking,
    private_booking_canceled,
    private_booking_refunded,
    isUnpaid,
    hasPendingReplacementRequest,
  } = eventInfo.event._def.extendedProps;
  return (
    <div className="fc-event-main-frame">
      <div className="fc-event-time alignItems">
        {private_booking && private_booking_canceled && (
          <div
            className={`InfoContainer ${
              private_booking_refunded ? 'refunded' : 'notrefunded'
            }`}
          >
            <i className="Info">&#8618;</i>
          </div>
        )}
        {eventInfo.timeText}
        {isUnpaid && (
          <div className="UnpaidContainer">
            <i className="UnPaid">&#9679;</i>
          </div>
        )}
        {hasPendingReplacementRequest && (
          <div className="PendingReplacementRequest">
            <ReplacementRequestPendingChip height={15} width={17} />
          </div>
        )}
      </div>
      <div className="fc-event-title-container">
        <div className="fc-event-title fc-sticky">{eventInfo.event.title}</div>
      </div>
    </div>
  );
};

const styles = (theme) => ({
  container: {},
  dateHeader: {
    textAlign: 'center',
    fontSize: 22,
  },
  leftIcon: { marginRight: theme.spacing(1) },
  syncButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing(2),
  },
  syncButton: {
    marginRight: theme.spacing(1),
  },
});

const availabilitySlotAsEvent = (resourceDatatypeView) => (slot) => {
  let resourceId = null;
  if (resourceDatatypeView === 'establishment') {
    resourceId = slot.establishment;
  }
  if (resourceDatatypeView === 'coach') {
    resourceId = slot.coach;
  }

  const isSpecificAvailabity =
    !!slot.restriction_on_associated_establishments?.length > 0;

  return {
    start: slot.date_start,
    end: slot.date_end,
    display: 'background',
    resourceId,
    groupId: isSpecificAvailabity ? 'specific-availability' : '',
    className: [
      slot.is_restriction ? 'isRestriction' : '',
      slot.restriction_on_associated_establishments?.length > 0
        ? 'specificAvailability'
        : '',
    ],
    ...(slot.color ? { backgroundColor: slot.color } : {}),
    ...(isSpecificAvailabity
      ? {
          backgroundColor: chroma(slot.color || '#8fdf82')
            .alpha(0.3)
            .hex(),
        }
      : {}),
    // pass the slot's color inside extendedProps, to add border color when event renders
    extendedProps: { color: slot.color || EVENT_DEFAULT_COLOR },
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

const offerAsEvent =
  (resourceDatatypeView, getHasPendingReplacementRequest) => (offer) => {
    let resourceId = null;
    if (resourceDatatypeView === 'establishment') {
      resourceId = offer.establishment;
    }
    if (resourceDatatypeView === 'coach') {
      if (offer.coach_override) {
        resourceId = offer.coach_override;
      } else {
        resourceId = offer.coach;
      }
    }

    return {
      start: offer.date_start,
      allDay: offer.duration_minute > 60 * 10,
      end: DateTime.fromISO(offer.date_start)
        .plus({ minutes: offer.duration_minute })
        .toISO(),
      title: offer?.name_override || offer?.meta_activity?.name || '',
      editable: false,
      extendedProps: {
        offer: offer.id,
        hasPendingReplacementRequest: getHasPendingReplacementRequest
          ? getHasPendingReplacementRequest(offer.id)
          : false,
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
      isUnpaid: !!pb?.is_unpaid,
    },
    textColor: 'black',
    classNames: [
      pb.booking_status_code !== BOOKING_STATUS_OK.id ? 'cancelledEvent' : '',
    ],
    resourceId,
    borderColor: pb.private_service ? pb.private_service.color : '',
  };
};

const AvailabilitySlotForm = withTranslation('privateService')(
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
      eventSlotSelected: {
        startStr: string,
        endStr: string,
      },
    }) => {
      return (
        <List>
          {props.onBookRequest && (
            <ObjectLevelPermissionWrapper
              forcedBehavior="hidden"
              requiredPermission="reservation.privateBooking.allowed_actions.create"
            >
              <ListItem button onClick={props.onBookRequest}>
                <ListItemIcon color="primary">
                  <PersonAddIcon className={props.classes.leftIcon} />
                </ListItemIcon>
                <ListItemText primary={props.t('calendar.addBooking')} />
              </ListItem>
            </ObjectLevelPermissionWrapper>
          )}
          {props.onEnableAvailability && props.eventSlotSelected ? (
            <ObjectLevelPermissionWrapper
              forcedBehavior="hidden"
              requiredPermission="planning.schedule.allowed_actions.createAvailability"
            >
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
                  disabled={!props.onEnableRecurrentAvailability}
                  onClick={props.onEnableRecurrentAvailability}
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
            </ObjectLevelPermissionWrapper>
          ) : null}
          {props.onDisableAvailability && props.eventSlotSelected ? (
            <ObjectLevelPermissionWrapper
              forcedBehavior="hidden"
              requiredPermission="planning.schedule.allowed_actions.deleteAvailability"
            >
              <React.Fragment>
                <ListItem
                  button
                  disabled={!props.onDisableAvailability}
                  onClick={props.onDisableAvailability}
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
                  disabled={!props.onDisableRecurrentAvailability}
                  onClick={props.onDisableRecurrentAvailability}
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
            </ObjectLevelPermissionWrapper>
          ) : null}
          {!!props.onCreateCustomEvent && props.eventSlotSelected && (
            <React.Fragment>
              <ListItem
                button
                disabled={!props.onCreateCustomEvent}
                onClick={props.onCreateCustomEvent}
              >
                <ListItemIcon>
                  <TodayIcon className={props.classes.leftIcon} />
                </ListItemIcon>
                <ListItemText primary={props.t('calendar.createCustomEvent')} />
              </ListItem>
            </React.Fragment>
          )}
          {!!props.onRequestAvailabilityDetails && props.eventSlotSelected && (
            <ObjectLevelPermissionWrapper
              forcedBehavior="hidden"
              requiredPermission="planning.schedule.allowed_actions.readAvailabilityDetail"
            >
              <React.Fragment>
                <ListItem
                  button
                  disabled={!props.onRequestAvailabilityDetails}
                  onClick={props.onRequestAvailabilityDetails}
                >
                  <ListItemIcon>
                    <InfoIcon className={props.classes.leftIcon} />
                  </ListItemIcon>
                  <ListItemText
                    primary={props.t('calendar.showAvailabilityDetails')}
                  />
                </ListItem>
              </React.Fragment>
            </ObjectLevelPermissionWrapper>
          )}
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
  eventSlotSelected?: EventSlot,
};

export class PrivateCalendar extends React.PureComponent<Props, State> {
  calendarRef = React.createRef();

  state = {
    selectInfo: null,

    disableWithRecurrence: false,
    enableWithRecurrence: false,
    date_start: null,
    date_end: null,
    availabilityDetailData: null,

    datePickerOpen: false,
    syncCalendarAnchorEl: null,
    otherCalendarsModalOpen: false,
  };

  select = (eventSlotSelected: EventSlot) => {
    if (this.props.disableAvailabilitySlotDisplay) return;

    const { startStr, endStr } = eventSlotSelected;

    const start = DateTime.fromISO(startStr).setZone(this.props.timezone);
    const end = DateTime.fromISO(endStr).setZone(this.props.timezone);

    if (!start.equals(end) && start.hasSame(end, 'day')) {
      this.setState({
        eventSlotSelected: {
          ...eventSlotSelected,
          startStr: start.toISO(),
          endStr: end.toISO(),
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

  openDatePicker = () => {
    this.setState({ datePickerOpen: true });
  };

  zoomIn = () =>
    this.props.setScheduleFilter({
      ...this.props.scheduleFilter,
      zoomLevel: Math.max((this.props.scheduleFilter.zoomLevel ?? 1) - 1, 0),
    });

  zoomOut = () =>
    this.props.setScheduleFilter({
      ...this.props.scheduleFilter,
      zoomLevel: Math.min((this.props.scheduleFilter.zoomLevel ?? 1) + 1, 2),
    });

  getSafeZoomLevel = () => {
    if (
      !this.props.scheduleFilter?.zoomLevel ||
      this.props.scheduleFilter?.zoomLevel === undefined ||
      Number.isNaN(this.props.scheduleFilter?.zoomLevel)
    ) {
      return ZOOM_LEVEL_FALLBACK;
    }

    // Safe because strange javascripts cases handled above. (Number.isNaN(undefined) === false)

    const safeZoomLevel = Number(this.props.scheduleFilter.zoomLevel);

    if (safeZoomLevel === 0) {
      return ZOOM_LEVEL_FALLBACK;
    }

    return safeZoomLevel;
  };

  dateClick = (eventSlotSelected: EventSlot) => {
    const start = DateTime.fromISO(eventSlotSelected.dateStr).setZone(
      this.props.timezone,
    );

    this.setState({
      eventSlotSelected: {
        ...eventSlotSelected,
        startStr: start.toISO(),
        endStr: start.plus({ minutes: 30 * this.getSafeZoomLevel() }).toISO(),
      },
    });
  };

  getAvailableSlotAsEvents = memoize(
    (
      availabilitySlots: Array<AvailabilitySlot>,
      privateBookings: Array<PrivateBooking>,
      offerList: Array<Offer>,
      resourceDatatypeView?: string,
      customEventList?: Array<CustomEvent>,
    ) => {
      const events = Immutable([
        ...availabilitySlots.map(availabilitySlotAsEvent(resourceDatatypeView)),
        ...(offerList ?? []).map(
          offerAsEvent(
            resourceDatatypeView,
            this.props.getHasPendingReplacementRequest,
          ),
        ),
        ...privateBookings.map(privateBookingAsEvent(resourceDatatypeView)),
        ...(customEventList ?? []).map(
          customEventAsEvent(resourceDatatypeView),
        ),
      ]);

      const allDaySlot = Immutable(
        !!events.reduce((acc, v) => acc || v.allDay, false),
      );

      return {
        events,
        allDaySlot,
      };
    },
  );

  onDisableAvailability = () => {
    this.props.disableResourceAvailabilitySlot(
      {
        date_start: this.state.eventSlotSelected?.startStr,
        date_end: this.state.eventSlotSelected?.endStr,
      },
      {
        onSuccess: () => {
          this.setState({ eventSlotSelected: null });
        },
      },
    );
    this.setState({ eventSlotSelected: null });
  };

  onCreateCustomEvent = () => {
    this.props.createCustomEvent(
      {
        date_start: this.state.eventSlotSelected?.startStr,
        date_end: this.state.eventSlotSelected?.endStr,
      },
      {
        onSuccess: () => {
          this.setState({ eventSlotSelected: null });
        },
      },
    );
    this.setState({ eventSlotSelected: null });
  };

  onRequestAvailabilityDetails = () => {
    const mergedIntervals = groupSlotsAndMerge(this.props.availabilitySlots);
    const intersectionWithSelection = intersectSelectionWithMergedIntervals(
      {
        startStr: this.state.eventSlotSelected?.startStr,
        endStr: this.state.eventSlotSelected?.endStr,
      },
      mergedIntervals,
    );
    const availabilityDetailData = formatSlotDetailData(
      intersectionWithSelection,
      this.props.establishments,
      this.props.resourceAvailable,
    );

    this.setState({ availabilityDetailData, eventSlotSelected: null });
  };

  onEnableAvailability = () => {
    this.props.enableResourceAvailabilitySlot(
      {
        date_start: this.state.eventSlotSelected?.startStr,
        date_end: this.state.eventSlotSelected?.endStr,
      },
      {
        onSuccess: () => {
          this.setState({ eventSlotSelected: null });
        },
      },
    );
    this.setState({ eventSlotSelected: null });
  };

  createRecurrence = (recurrence_until: string, eventSlot: EventSlot) => {
    const { enableWithRecurrence } = this.state;
    const endDate = DateTime.fromISO(recurrence_until);

    const all_date_start = [];
    let i = 0;

    while (
      (eventSlot.startStr
        ? DateTime.fromISO(eventSlot.startStr).plus({ weeks: i }).startOf('day')
        : DateTime.now().plus({ weeks: i }).startOf('day')) <=
      endDate.startOf('day')
    ) {
      all_date_start.push(
        eventSlot.startStr
          ? DateTime.fromISO(eventSlot.startStr).plus({ weeks: i })
          : DateTime.now().plus({ weeks: i }),
      );
      i += 1;
    }

    (enableWithRecurrence
      ? this.props.enableResourceAvailabilitySlot
      : this.props.disableResourceAvailabilitySlot)(
      {
        date_start: eventSlot?.startStr,
        date_end: eventSlot?.endStr,
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
    this.setState({ eventSlotSelected: null });
  };

  handleEventClick = (info) => {
    if (info.event.display !== 'background') {
      if (this.props.onEventClick) {
        this.props.onEventClick(info.el, info.event.extendedProps);
      }
    }
  };

  handleIntervalChange = ({ view, startStr, endStr }) => {
    if (view.type !== this.props.scheduleFilter.timeGrid) {
      this.props.setScheduleFilter({
        ...this.props.scheduleFilter,
        timeGrid: view.type,
      });
    }
    const date_start = DateTime.fromISO(startStr)
      .setZone(this.props.timezone)
      .toISODate();

    const date_end = DateTime.fromISO(endStr)
      .setZone(this.props.timezone)
      .toISODate();

    if (
      this.state.date_start !== date_start &&
      this.state.date_end !== date_end
    ) {
      this.setState({
        date_start,
        date_end,
      });
    }
  };

  hideCancelledPrivateBookings = memoize(
    (privateBookings, hideCancelledEvents) => {
      if (hideCancelledEvents !== undefined) {
        if (hideCancelledEvents === true) {
          return privateBookings.filter(
            (pb) => pb.booking_status_code === BOOKING_STATUS_OK.id,
          );
        }
      }
      return privateBookings;
    },
  );

  hideCancelledOffers = memoize((offerList, hideCancelledEvents) => {
    if (hideCancelledEvents !== undefined) {
      if (hideCancelledEvents === true) {
        return offerList.filter((offer) => offer.available === true);
      }
    }
    return offerList;
  });

  getSimilarDateDisplayAsFullCalendar = () => {
    const dateStart = this.state.date_start
      ? DateTime.fromISO(this.state.date_start)
      : DateTime.now();
    const dateEnd = this.state.date_end
      ? DateTime.fromISO(this.state.date_end).minus({ days: 1 })
      : DateTime.now();

    if (this.props.scheduleFilter?.timeGrid === 'timeGridDay') {
      return dateStart.toLocaleString(DateTime.DATE_FULL);
    }
    if (this.props.scheduleFilter?.timeGrid === 'dayGridMonth') {
      return dateStart.toFormat('LLL y');
    }

    if (dateStart.month === dateEnd.month) {
      return `${dateStart.toFormat('dd')} - ${dateEnd.toFormat('dd LLLL y')}`;
    }

    return `${dateStart.toFormat('dd LLLL')} - ${dateEnd.toFormat('DDD')}`;
  };

  setNewDate = (newDate: DateTime) => {
    this.calendarRef.current.getApi().gotoDate(newDate.toISODate());
  };

  onCloseDatePicker = () => {
    this.setState({ datePickerOpen: false });
  };

  hiddenDiv = () => {
    return <div style={{ display: 'none' }} />;
  };

  handleSyncCalendarClick = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({ syncCalendarAnchorEl: event.currentTarget });
  };

  handleSyncCalendarClose = () => {
    this.setState({ syncCalendarAnchorEl: null });
  };

  handleOutlookCalendarSubscription = () => {
    const calendarUrl = this.props.calendarSyncUrl;
    const outlookCalendarUrl = `https://outlook.office.com/calendar/0/addfromweb?url=${calendarUrl}`;

    window.open(outlookCalendarUrl, '_blank', 'noopener,noreferrer');
    this.handleSyncCalendarClose();
  };

  handleOtherCalendarsClick = () => {
    this.setState({ otherCalendarsModalOpen: true });
    this.handleSyncCalendarClose();
  };

  handleOtherCalendarsModalClose = () => {
    this.setState({ otherCalendarsModalOpen: false });
  };

  getCustomButtons = memoize(
    () =>
      Immutable({
        zoomIn: {
          text: '+',
          click: this.zoomIn,
        },
        zoomOut: {
          text: '-',
          click: this.zoomOut,
        },
        datePicker: {
          text: this.props.t('calendar.header.dateSelector'),
          click: this.openDatePicker,
        },
        calendarSync: {
          text: this.props.t('calendar.header.syncCalendar.button'),
          click: this.handleSyncCalendarClick,
        },
      }),
    this.props.t,
  );

  getHeaderToolbar = () => {
    // no need to memoize : non-nested object

    const right = this.props.resourceDatatypeView
      ? 'datePicker zoomOut,zoomIn resourceTimeGridDay,resourceTimeGridThreeDays,resourceTimeGridWeek'
      : 'datePicker zoomOut,zoomIn timeGridDay,timeGridWeek,dayGridMonth';
    const rightHeader = !!this.props.calendarSyncUrl
      ? `calendarSync ${right}`
      : right;
    return {
      left: 'prev,next today',
      center: isWidthUp('sm', this.props.width) ? 'title' : '',
      right: rightHeader,
    };
  };

  getViews = memoize(() =>
    Immutable({
      resourceTimeGridThreeDays: {
        type: 'resourceTimeGrid',
        duration: { days: 3 },
        buttonText: this.props.t('calendar.header.threeDaysView'),
      },
      resourceTimeGridDay: {
        titleFormat: {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        },
      },
    }),
  );

  getInitialView: () => string = () => {
    if (window.innerWidth < 400) {
      if (this.props.resourceDatatypeView) {
        return 'resourceTimeGridDay';
      }
      return 'timeGridDay';
    }
    if (
      this.props.resourceDatatypeView &&
      !this.props.scheduleFilter.timeGrid.startsWith('resource')
    ) {
      return 'resourceTimeGridThreeDays';
    }
    return this.props.scheduleFilter.timeGrid;
  };

  render() {
    const { classes } = this.props;
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

    return (
      <div className={classes.container}>
        {!isWidthUp('sm', this.props.width) && (
          <div className={classes.dateHeader}>
            {this.getSimilarDateDisplayAsFullCalendar()}
          </div>
        )}
        <div>
          <MuiPickersUtilsProvider
            locale={Settings.defaultLocale}
            utils={LocalizedLuxonUtils}
          >
            <DatePicker
              DialogProps={{ open: this.state.datePickerOpen }}
              initialFocusedDate={
                this.calendarRef.current
                  ? DateTime.fromJSDate(
                      this.calendarRef?.current?.getApi().getDate(),
                    ).toISODate()
                  : DateTime.now().toISODate()
              }
              onChange={this.setNewDate}
              onClose={this.onCloseDatePicker}
              TextFieldComponent={this.hiddenDiv}
              value={null}
            />
          </MuiPickersUtilsProvider>
          <div className={classes.syncButtonContainer}>
            <Menu
              keepMounted
              anchorEl={this.state.syncCalendarAnchorEl}
              anchorOrigin={{
                horizontal: 'center',
                vertical: 'bottom',
              }}
              getContentAnchorEl={null}
              onClose={this.handleSyncCalendarClose}
              open={Boolean(this.state.syncCalendarAnchorEl)}
              transformOrigin={{
                horizontal: 'center',
                vertical: 'top',
              }}
            >
              <MenuItem onClick={this.handleOutlookCalendarSubscription}>
                {this.props.t('calendar.header.syncCalendar.outlook')}
              </MenuItem>
              <MenuItem onClick={this.handleOtherCalendarsClick}>
                {this.props.t('calendar.header.syncCalendar.otherCalendars')}
              </MenuItem>
            </Menu>
          </div>
        </div>
        <FullCalendar
          ref={this.calendarRef}
          dateA
          editable
          filterResourcesWithEvents
          selectable
          allDaySlot={allDaySlot}
          customButtons={this.getCustomButtons()}
          dateClick={this.dateClick}
          datesSet={this.handleIntervalChange}
          eventClick={this.handleEventClick}
          eventContent={renderEventContent}
          events={events}
          firstDay={Info.getStartOfWeek()}
          headerToolbar={this.getHeaderToolbar()}
          initialView={this.getInitialView()}
          locale={
            i18n.language === LANGUAGES.ENGLISH
              ? LANGUAGES.ENGLISH_BRITISH
              : i18n.language
          }
          locales={SUPPORTED_LOCALES}
          plugins={SUPPORTED_PLUGINS}
          resources={this.props.resources}
          schedulerLicenseKey="0617518912-fcs-1639035029"
          select={this.select}
          slotDuration={`00:${
            15 * 2 ** (this.props.scheduleFilter.zoomLevel ?? 1)
          }:00`}
          slotMaxTime={
            this.props.scheduleTimerangeEnd
              ? `${DateTime.fromFormat(
                  this.props.scheduleTimerangeEnd,
                  'yyyy-MM-dd HH:mm',
                ).toFormat('HH')}:00:00`
              : '23:00:00'
          }
          slotMinTime={
            this.props.scheduleTimerangeBegin
              ? `${DateTime.fromFormat(
                  this.props.scheduleTimerangeBegin,
                  'yyyy-MM-dd HH:mm',
                ).toFormat('HH')}:00:00`
              : '06:00:00'
          }
          timeZone={this.props.timezone}
          views={this.getViews()}
        />
        {this.props.disableAvailabilitySlotDisplay ? null : (
          <Popover
            anchorOrigin={{
              vertical: 'center',
              horizontal: 'center',
            }}
            onClose={() => this.setState({ eventSlotSelected: null })}
            open={!!this.state.eventSlotSelected}
            transformOrigin={{
              vertical: 'center',
              horizontal: 'center',
            }}
          >
            <AvailabilitySlotForm
              eventSlotSelected={this.state.eventSlotSelected}
              onBookRequest={
                this.props.onBookRequest && this.state.eventSlotSelected
                  ? () => {
                      this.props.onBookRequest(
                        this.state.eventSlotSelected.startStr,
                      );
                      this.setState({ eventSlotSelected: null });
                    }
                  : null
              }
              onCreateCustomEvent={
                this.props.createCustomEvent && this.state.eventSlotSelected
                  ? () => {
                      this.onCreateCustomEvent(
                        this.state.eventSlotSelected.startStr,
                      );
                      this.setState({ eventSlotSelected: null });
                    }
                  : null
              }
              onDisableAvailability={
                this.props.disableResourceAvailabilitySlot
                  ? this.onDisableAvailability
                  : null
              }
              onDisableRecurrentAvailability={
                this.props.disableResourceAvailabilitySlot
                  ? () => this.setState({ disableWithRecurrence: true })
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
              onRequestAvailabilityDetails={() => {
                this.onRequestAvailabilityDetails();
                this.setState({ eventSlotSelected: null });
              }}
              selectInfo={this.state.selectInfo}
            />
          </Popover>
        )}
        <RecurrentAvailabilityFormDialog
          eventSlot={this.state.eventSlotSelected}
          fullScreen={this.props.fullScreen}
          loading={this.props.availabilitySlotUpdating}
          mode={this.state.disableWithRecurrence ? 'disable' : 'enable'}
          onClose={() =>
            this.setState({
              enableWithRecurrence: false,
              disableWithRecurrence: false,
            })
          }
          onSubmit={this.createRecurrence}
          open={
            this.state.eventSlotSelected &&
            (this.state.disableWithRecurrence ||
              this.state.enableWithRecurrence)
          }
        />
        {this.state.availabilityDetailData && (
          <SlotDetailDialog
            detailByResourceType={this.state.availabilityDetailData}
            onLeave={() => this.setState({ availabilityDetailData: null })}
          />
        )}
        {this.props.calendarSyncUrl && (
          <SyncCalendarDialog
            calendarUrl={this.props.calendarSyncUrl}
            onClose={this.handleOtherCalendarsModalClose}
            open={this.state.otherCalendarsModalOpen}
          />
        )}
      </div>
    );
  }
}

export default compose(
  withTranslation(['privateService']),
  withMobileDialog(),
  withStyles(styles, { withTheme: true }),
  withWidth(),
)(PrivateCalendar);
