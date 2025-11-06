// @flow
import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { compose, withStateHandlers } from 'recompose';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import { withTranslation, TFunction } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import IconButton from '@material-ui/core/IconButton';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ButtonBase from '@material-ui/core/ButtonBase';

import { Alert } from '@material-ui/lab';
import ObjectLevelPermissionWrapper from '#src/libs/role/permission-utils/ObjectLevelPermissionWrapper.component';
import PrivateCalendar from './PrivateCalendar.component';
import ResourceSelector from './resource/ResourceSelector.component';
import ResourceDatatypeFilter from './resource/ResourceDatatypeFilter.component';
import CalendarEventDetail from '../containers/CalendarEventDetail.container';

import PrivateBookingBooker from '../containers/PrivateBookingBooker.container';

import type { ResourceData } from '../types';
import FabPrivateCalendar from './FabPrivateCalendar.component';

import { CompanyTheme } from '../../theme/types';
import { ScheduleFilter } from '../../user-preference/types';

type Props = {
  t: TFunction,
  timezone: string,
  classes: Object,

  onEditResourceConfiguration: Array<ResourceData>,
  onChangeResourcesSelected: Array<ResourceData>,
  resourceAvailable: Array<ResourceData>,
  resourceSelectedListIds: Array<number>,
  setResourceFiltered: (resources: Array<number>) => void,
  resourceDataLoading: boolean,

  hideCancelledEvents?: boolean,

  offerList: Array<Offer>,
  showOfferListToogle: boolean,
  showCustomEventsToogle: boolean,
  showPrivateBookingToogle: boolean,
  showHideCancelledEventsToggle: boolean,

  privateBookerOpen: boolean,
  closePrivateBooker: () => void,

  handleEventClick: (anchorEl: HTMLElement, extendedProps: any) => void,
  popoverAnchor?: HTMLElement,

  privateBookings: Array<PrivateBooking>,
  onDateChange: ({
    date_start: string,
    date_end: string,
  }) => void,

  availabilitySlotUpdating: boolean,
  goToMember: (id: number) => void,
  disableResourceAvailabilitySlot: () => void,
  createCustomEvent: () => void,
  enableResourceAvailabilitySlot: () => void,
  availabilitySlots: Array<AvailabilitySlot>,
  customEventList: Array<CustomEvent>,

  privateBookingId: number,
  offerId: number,
  closePopover: () => void,
  refreshOffers: () => void,
  refreshPrivateBookings: () => void,

  goToCalendar: () => void,
  fetchAvailabilitySlots: () => void,

  onRequestPrivateBooking: (date: string) => void,
  privateBookingRequestedSlot?: string,
  resourcesByDatatype: Array<ResourceData>,
  resourceItemsFilter: Array<ResourceData>,
  resourceDatatypeFilter: any,
  collapsResourceSelector: any,
  customEventId?: number,
  privateCalendarDateStart: string,
  setPrivateCalendarDateStart: () => void,
  toogleExand: () => void,
  expanded: boolean,
  updateRessourcesFilters: (data: any) => void,
  companyTheme: CompanyTheme,
  isCoach: true,

  scheduleFilter: ScheduleFilter,
  setScheduleFilter: (scheduleFilter: ScheduleFilter) => void,
  coachesSelectedInRole?: Array<Coach>,
  establishments?: Array<EstablishmentWithAssociatedId>,
  hideResourceSelector?: boolean,
  getHasPendingReplacementRequest: (offerId: number) => boolean,
  coachNotRelatedToPrivateService: boolean,
  calendarSyncUrl?: string,
};

export const PrivateCalendarWithControls = (props: Props) => {
  const onChangeFilter = (filterName: string) => () =>
    props.setScheduleFilter({
      ...props.scheduleFilter,
      [filterName]: !props.scheduleFilter[filterName],
    });

  const { onDateChange, setPrivateCalendarDateStart } = props;
  const handleDateChange = React.useCallback(
    (data) => {
      onDateChange(data);
      setPrivateCalendarDateStart(data);
    },
    [onDateChange, setPrivateCalendarDateStart],
  );

  return (
    <div className={props.classes.container}>
      <Paper square className={props.classes.header}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'stretch',
            justifyContent: 'space-between',
          }}
        >
          {!props.hideResourceSelector && !!props.resourceAvailable && (
            <ResourceSelector
              collapse={props.collapsResourceSelector}
              loading={props.resourceDataLoading}
              onChangeResourcesSelected={props.onChangeResourcesSelected}
              onEditResourceConfiguration={props.onEditResourceConfiguration}
              resourceAvailable={props.resourceAvailable}
              resourceSelectedListIds={props.resourceSelectedListIds}
              setResourceFiltered={props.setResourceFiltered}
              updateRessourcesFilters={props.updateRessourcesFilters}
            />
          )}
        </div>
        <Divider />
        <div className={props.classes.rowBetween}>
          <div className={props.classes.collapseHeader}>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                props.toogleExand();
              }}
              size="small"
            >
              {props.expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
            <ButtonBase disabledRipple onClick={props.toogleExand}>
              <Typography>{props.t('calendar.toogle.title')}</Typography>
            </ButtonBase>
            <div
              style={{
                display: 'flex',
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}
            >
              {!!props.resourcesByDatatype &&
                !!props.resourcesByDatatype.length && (
                  <ResourceDatatypeFilter
                    resourcesByDatatype={props.resourcesByDatatype}
                    scheduleFilter={props.scheduleFilter}
                    setScheduleFilter={props.setScheduleFilter}
                  />
                )}
            </div>
          </div>

          <Collapse in={props.expanded}>
            <div className={props.classes.expandedInnerContainer}>
              <Grid container direction="row" justify="flex-start">
                {!!props.showOfferListToogle && (
                  <Grid item md={2} sm={3} xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={props.scheduleFilter.showOfferList}
                          onChange={onChangeFilter('showOfferList')}
                        />
                      }
                      label={props.t('calendar.toogle.showOfferList')}
                    />
                  </Grid>
                )}
                {!!props.showPrivateBookingToogle && (
                  <Grid item md={2} sm={3} xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={props.scheduleFilter.showPrivateBookings}
                          onChange={onChangeFilter('showPrivateBookings')}
                        />
                      }
                      label={props.t('calendar.toogle.showPrivateBookings')}
                    />
                  </Grid>
                )}
                {!!props.showCustomEventsToogle && (
                  <Grid item md={2} sm={3} xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={props.scheduleFilter.showCustomEvents}
                          onChange={onChangeFilter('showCustomEvents')}
                        />
                      }
                      label={props.t('calendar.toogle.showCustomEvents')}
                    />
                  </Grid>
                )}
                {!!props.showHideCancelledEventsToggle && (
                  <ObjectLevelPermissionWrapper
                    forcedBehavior="hidden"
                    requiredPermission="planning.calendar.allowed_actions.readCancellations"
                  >
                    <Grid item md={2} sm={3} xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={!props.scheduleFilter.hideCancelledEvents}
                            onChange={onChangeFilter('hideCancelledEvents')}
                          />
                        }
                        label={props.t('calendar.toogle.hideCancelledEvents')}
                      />
                    </Grid>
                  </ObjectLevelPermissionWrapper>
                )}
              </Grid>
            </div>
          </Collapse>
        </div>
      </Paper>
      {props.coachNotRelatedToPrivateService && (
        <Alert className={props.classes.alert} severity="warning">
          {props.t('availabilitySlot.notAssociatedWarning')}
        </Alert>
      )}
      {!!props.goToCalendar && (
        <Button
          color="primary"
          onClick={props.goToCalendar}
          style={{ width: '100%', margin: 8 }}
          variant="contained"
        >
          {props.t('openCalendar')}
          <ArrowForwardIcon style={{ marginLeft: 8 }} />
        </Button>
      )}
      <div className={props.classes.content}>
        <PrivateCalendar
          availabilitySlots={props.availabilitySlots}
          availabilitySlotUpdating={props.availabilitySlotUpdating}
          calendarSyncUrl={props.calendarSyncUrl}
          createCustomEvent={props.createCustomEvent}
          customEventList={
            props.scheduleFilter?.showCustomEvents
              ? props.customEventList || []
              : []
          }
          disableResourceAvailabilitySlot={
            props.disableResourceAvailabilitySlot
          }
          enableResourceAvailabilitySlot={props.enableResourceAvailabilitySlot}
          establishments={props.establishments || []}
          getHasPendingReplacementRequest={
            props.getHasPendingReplacementRequest
          }
          goToMember={props.goToMember}
          hideCancelledEvents={props.scheduleFilter?.hideCancelledEvents}
          offerList={
            props.scheduleFilter?.showOfferList ? props.offerList || [] : []
          }
          onBookRequest={props.isCoach ? null : props.onRequestPrivateBooking}
          onDateChange={handleDateChange}
          onEventClick={props.handleEventClick}
          privateBookings={
            props.scheduleFilter?.showPrivateBookings
              ? props.privateBookings || []
              : []
          }
          resourceAvailable={props.resourceAvailable}
          resourceDatatypeView={
            props.scheduleFilter.resourceFilter?.resourceDatatypeFilter || null
          }
          resources={
            props.scheduleFilter.resourceFilter?.resourceItemsFilter || []
          }
          scheduleFilter={props.scheduleFilter}
          scheduleTimerangeBegin={props.companyTheme.schedule_timerange_begin}
          scheduleTimerangeEnd={props.companyTheme.schedule_timerange_end}
          setScheduleFilter={props.setScheduleFilter}
          timezone={props.timezone}
        />
        <CalendarEventDetail
          customEventId={props.customEventId}
          fetchAvailabilitySlots={props.fetchAvailabilitySlots}
          isCoach={props.isCoach}
          offerId={props.offerId}
          onClose={props.closePopover}
          popoverAnchor={props.popoverAnchor}
          privateBookingId={props.privateBookingId}
          refreshOffers={props.refreshOffers}
          refreshPrivateBookings={props.refreshPrivateBookings}
        />
        <PrivateBookingBooker
          preventFetchCoachBulk
          coachesSelectedInRole={props.coachesSelectedInRole || []}
          onClose={() => {
            props.closePrivateBooker();
            if (props.refreshPrivateBookings) props.refreshPrivateBookings();
          }}
          open={props.privateBookerOpen}
          requestedSlot={props.privateBookingRequestedSlot}
        />
        {props.createCustomEvent && (
          <FabPrivateCalendar
            createCustomEvent={props.createCustomEvent}
            onSubmitPrivateServiceWithDate={props.onRequestPrivateBooking}
            startDate={props.privateCalendarDateStart}
            timezone={props.timezone}
          />
        )}
      </div>
    </div>
  );
};

const styles = (theme) => ({
  container: {
    position: 'relative',
    width: '100%',
  },
  header: {
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(-3),
    marginTop: theme.spacing(-2),
    marginRight: theme.spacing(-3),
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    width: '100%',
  },
  collapseHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing(1),
    '& > *': {
      marginRight: theme.spacing(2),
    },
  },
  expandedInnerContainer: {
    borderLeft: '3px solid black',
    paddingLeft: theme.spacing(1),
    marginLeft: theme.spacing(2),
    width: '100%',
  },
  dataFilterButton: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: theme.spacing(3),
  },
  alert: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
  },
});

export default compose(
  React.memo,
  withTranslation(['privateService']),
  withStyles(styles),
  withStateHandlers(
    {
      privateBookerOpen: false,
      privateBookingRequestedSlot: null,
      privateCalendarDateStart: '',
      expanded: false,
    },
    {
      toogleExand:
        ({ expanded }) =>
        () => ({ expanded: !expanded }),
      closePrivateBooker: () => () => ({
        privateBookerOpen: false,
        privateBookingRequestedSlot: null,
      }),
      onRequestPrivateBooking: () => (privateBookingRequestedSlot) => ({
        privateBookerOpen: true,
        privateBookingRequestedSlot,
      }),
      setPrivateCalendarDateStart:
        () => (data: { date_start: string, date_end: string }) => {
          return { privateCalendarDateStart: data.date_start };
        },
    },
  ),
  withStateHandlers(
    {
      popoverAnchor: null,
      customEventId: null,
      privateBookingId: null,
      offerId: null,
    },
    {
      closePopover: () => () => ({
        popoverAnchor: null,
        privateBookingId: null,
        customEventId: null,
        offerId: null,
      }),
      handleEventClick: () => (anchorEl, extendedProps) => {
        return {
          popoverAnchor: anchorEl,
          customEventId: (extendedProps && extendedProps.customEventId) || null,
          privateBookingId:
            (extendedProps && extendedProps.private_booking) || null,
          offerId: (extendedProps && extendedProps.offer) || null,
        };
      },
    },
  ),
)(PrivateCalendarWithControls);
