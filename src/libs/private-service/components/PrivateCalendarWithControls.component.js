// @flow
import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { compose, withStateHandlers } from 'recompose';
import Paper from '@material-ui/core/Paper';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Checkbox from '@material-ui/core/Checkbox';

import PrivateCalendar from './PrivateCalendar.component';
import ResourceSelector from './resource/ResourceSelector.component';
import ResourceDatatypeFilter from './resource/ResourceDatatypeFilter.component';
import CalendarEventDetail from '../containers/CalendarEventDetail.container';

import PrivateBookingBooker from '../containers/PrivateBookingBooker.container';

import type { ResourceData } from '../types';

type Props = {
  t: TFunction,
  classes: Object,

  onEditResourceConfiguration: Array<ResourceData>,
  onChangeResourcesSelected: Array<ResourceData>,
  resourceAvailable: Array<ResourceData>,
  resourceSelectedListIds: Array<number>,
  setResourceFiltered: (Array<number>) => void,
  resourceDataLoading: boolean,

  offerList: Array<Offer>,
  showOfferList: boolean,
  showOfferListToogle: boolean,
  toogleShowOfferList: () => void,
  showPrivateBookings: boolean,
  toogleShowPrivateBookings: () => void,
  showPrivateBookingToogle: () => void,

  privateBookerOpen: boolean,
  closePrivateBooker: () => void,

  handleEventClick: (anchorEl: HTMLElement, extendedProps: any) => void,
  popoverAnchor: ?HTMLElement,

  privateBookings: Array<PrivateBooking>,
  onDateChange: ({
    date_start: string,
    date_end: string,
  }) => void,

  availabilitySlotUpdating: boolean,
  goToMember: (id: number) => void,
  disableResourceAvailabilitySlot: () => void,
  enableResourceAvailabilitySlot: () => void,
  availabilitySlots: Array<AvailabilitySlot>,

  privateBookingId: number,
  offerId: number,
  closePopover: () => void,
  refreshOffers: () => void,
  refreshPrivateBookings: () => void,

  onRequestPrivateBooking: (date: string) => void,
  privateBookingRequestedSlot: ?string,
};

export const PrivateCalendarMultiResource = (props: Props) => (
  <div>
    <Paper square className={props.classes.header}>
      {!!props.resourceAvailable && (
        <ResourceSelector
          resourceAvailable={props.resourceAvailable}
          resourceSelectedListIds={props.resourceSelectedListIds}
          resourceDataLoading={props.resourceDataLoading}
          onEditResourceConfiguration={props.onEditResourceConfiguration}
          onChangeResourcesSelected={props.onChangeResourcesSelected}
          setResourceFiltered={props.setResourceFiltered}
        />
      )}
      <div className={props.classes.row}>
        {!!props.showOfferListToogle && (
          <FormControlLabel
            label={props.t('calendar.toogle.showOfferList')}
            control={
              <Checkbox
                checked={props.showOfferList}
                onChange={props.toogleShowOfferList}
              />
            }
          />
        )}
        {!!props.showPrivateBookingToogle && (
          <FormControlLabel
            label={props.t('calendar.toogle.showPrivateBookings')}
            control={
              <Checkbox
                checked={props.showPrivateBookings}
                onChange={props.toogleShowPrivateBookings}
              />
            }
          />
        )}
      </div>
      {!!props.resourcesByDatatype && !!props.resourcesByDatatype.length && (
        <ResourceDatatypeFilter
          resourcesByDatatype={props.resourcesByDatatype}
          onResourceDatatypeFilterChange={props.setResourceFilter}
        />
      )}
    </Paper>
    <div className={props.classes.content}>
      <PrivateCalendar
        disableResourceAvailabilitySlot={props.disableResourceAvailabilitySlot}
        resources={props.resourceItemsFilter}
        resourceDatatypeView={props.resourceDatatypeFilter}
        enableResourceAvailabilitySlot={props.enableResourceAvailabilitySlot}
        availabilitySlots={props.availabilitySlots}
        privateBookings={
          props.showPrivateBookings ? props.privateBookings || [] : []
        }
        offerList={props.showOfferList ? props.offerList || [] : []}
        availabilitySlotUpdating={props.availabilitySlotUpdating}
        goToMember={props.goToMember}
        onDateChange={props.onDateChange}
        onEventClick={props.handleEventClick}
        onBookRequest={props.onRequestPrivateBooking}
      />
      <CalendarEventDetail
        popoverAnchor={props.popoverAnchor}
        privateBookingId={props.privateBookingId}
        offerId={props.offerId}
        onClose={props.closePopover}
        refreshOffers={props.refreshOffers}
        refreshPrivateBookings={props.refreshPrivateBookings}
      />
      <PrivateBookingBooker
        open={props.privateBookerOpen}
        requestedSlot={props.privateBookingRequestedSlot}
        onClose={props.closePrivateBooker}
      />
    </div>
  </div>
);

const styles = (theme) => ({
  header: {
    marginBottom: theme.spacing(2),
    marginLeft: -theme.spacing(2),
    marginTop: -theme.spacing(2),
    marginRight: -theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default compose(
  withNamespaces(['privateService']),
  withStyles(styles),
  withStateHandlers(
    { privateBookerOpen: false, privateBookingRequestedSlot: null },
    {
      closePrivateBooker: () => () => ({
        privateBookerOpen: false,
        privateBookingRequestedSlot: null,
      }),
      onRequestPrivateBooking: () => (privateBookingRequestedSlot) => ({
        privateBookerOpen: true,
        privateBookingRequestedSlot,
      }),
    },
  ),
  withStateHandlers(
    { resourceItemsFilter: [], resourceDatatypeFilter: null },
    {
      setResourceFilter: () => (
        resourceDatatypeFilter,
        resourceItemsFilter,
      ) => ({
        resourceDatatypeFilter,
        resourceItemsFilter,
      }),
    },
  ),
  withStateHandlers(
    { showPrivateBookings: true, showOfferList: true },
    {
      toogleShowOfferList: ({ showOfferList }) => () => ({
        showOfferList: !showOfferList,
      }),
      toogleShowPrivateBookings: ({ showPrivateBookings }) => () => ({
        showPrivateBookings: !showPrivateBookings,
      }),
    },
  ),
  withStateHandlers(
    { popoverAnchor: null, privateBookingId: null, offerId: null },
    {
      closePopover: () => () => ({
        popoverAnchor: null,
        privateBookingId: null,
        offerId: null,
      }),
      handleEventClick: () => (anchorEl, extendedProps) => {
        return {
          popoverAnchor: anchorEl,
          privateBookingId:
            (extendedProps && extendedProps.private_booking) || null,
          offerId: (extendedProps && extendedProps.offer) || null,
        };
      },
    },
  ),
)(PrivateCalendarMultiResource);
