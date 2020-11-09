// @flow

import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import {
  compose,
  withState,
  withStateHandlers,
  withHandlers,
  withProps,
} from 'recompose';
import { BOOKING_STATUS_OK } from '@bsport/common/lib/master-data/booking_status_code';
import PaginatedListStateful from '../../components/PaginatedListStateful.component';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import { fetchAssociatedCoachBulk as fetchAssociatedCoachBulkAction } from '../../libs/associated-coach/actions';
import {
  deletePrivateBooking as deletePrivateBookingAction,
  disablePrivateBooking as disablePrivateBookingAction,
  fetchPrivateBookings,
  fetchPrivateBooking as fetchPrivateBookingAction,
  fetchPrivateService as fetchPrivateServiceAction,
  fetchPrivateSlot as fetchPrivateSlotAction,
  fetchPrivateConsumerPass as fetchPrivateConsumerPassAction,
  attachCoachToPrivateBooking as attachCoachAction,
  restorePrivateBooking,
} from '../../libs/private-service/actions';
import { getCoaches } from '../../libs/associated-coach/selectors';
import {
  getPrivateBookingListBase,
  getPrivateBooking,
  withRelatedFields,
} from '../../libs/private-service/selectors/private-booking';
import { getPrivateConsumerPassDict } from '../../libs/private-service/selectors/private-consumer-pass';

import { fetchMember as fetchMemberAction } from '../../libs/member/actions';

import PrivateBookingListItem from '../../libs/private-service/components/booking/PrivateBookingListItem.component';
import PrivateBookingDetail from '../../libs/private-service/components/booking/PrivateBookingDetail.component';
import PrivateBookingDisableDialog from '../../libs/private-service/components/booking/PrivateBookingDisableDialog.component';
import PrivateBookingAttachCoachDialog from '../../libs/private-service/components/booking/PrivateBookingAttachCoachDialog.component';

import type {
  PrivateConsumerPass,
  PrivateBooking,
  PrivateService,
  PrivateSlot,
} from '../../libs/private-service/types';

type Props = {
  id: number,

  goToConsumerPass: (memberId: number, consumerPassId: number) => void,
  fetchMember: (id: number) => void,
  private_consumer_pass: ?PrivateConsumerPass,
  fetchPrivateBookings: (params: any) => void,
  private_booking_list: Array<PrivateBooking>,
  private_slot: PrivateSlot,

  private_service: PrivateService,
  goToPrivateConsumerPass: (
    memberId: number,
    privateConsumerPassId: number,
  ) => void,

  isOpenAttachCoach: boolean,
  serviceCoaches: Array<Coach>,
  attachCoach: (data: any) => void,
  availableCoaches: Array<Coach>,
  closeAttachCoach: () => void,

  openAttachCoach: () => void,
  private_consumer_pass: ?PrivateConsumerPass,
  onPrivateSlotClick: () => void,

  private_booking: ?PrivateBooking,
  privateBookingId: ?number,
  fetchPrivateBookingDetails: () => void,
  fetchPrivateConsumerPass: (id: number) => void,
  privateBookingsLoading: boolean,
  goToPrivateBooking: (memberId: number, privateBookingId: number) => void,
  setBookingToDelete: (?PrivateBooking) => void,
  bookingToDelete: ?PrivateBooking,
  disablePrivateBooking: (
    id: number,
    data: any,
    options: { onSuccess?: (PrivateBooking) => void, onError: (Error) => void },
  ) => void,
  deletePrivateBooking: (
    id: number,
    data: any,
    options: { onSuccess?: (PrivateBooking) => void, onError: (Error) => void },
  ) => void,
  restorePrivateBooking: (id: number) => void,
};

export class MemberDetailBooking extends Component<Props> {
  componentDidMount() {
    this.props.fetchPrivateBookings({ member: this.props.id });
    this.props.fetchMember(this.props.id);
    if (this.props.privateBookingId) {
      this.props.fetchPrivateBookingDetails();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (
      this.props.privateBookingId &&
      prevProps.privateBookingId !== this.props.privateBookingId
    ) {
      this.props.fetchPrivateBookingDetails();
    }
  }

  goToConsumerPass = (consumerPassId: number) => {
    this.props.goToConsumerPass(this.props.id, consumerPassId);
  };

  render() {
    return (
      <Grid container direction="row" spacing={3}>
        <Grid item xs={12} lg={6}>
          <Paper>
            <PaginatedListStateful
              itemPerPage={5}
              loading={this.props.privateBookingsLoading}
              listProps={{ disablePadding: true }}
              items={this.props.private_booking_list}
              renderItem={(b) => (
                <PrivateBookingListItem
                  onClick={() =>
                    this.props.goToPrivateBooking(this.props.id, b.id)
                  }
                  divider
                  selected={this.props.privateBookingId === b.id}
                  key={b.id}
                  private_booking={b}
                  onDelete={() => this.props.setBookingToDelete(b)}
                  onRestore={() => this.props.restorePrivateBooking(b.id)}
                />
              )}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} lg={6}>
          {this.props.private_booking ? (
            <PrivateBookingDetail
              private_booking={this.props.private_booking}
              availableCoaches={this.props.availableCoaches}
              private_slot={this.props.private_booking.private_slot}
              private_service={this.props.private_booking.private_service}
              onOpenAttachCoach={this.props.openAttachCoach}
              private_consumer_pass={this.props.private_consumer_pass}
              onPrivateSlotClick={this.props.onPrivateSlotClick}
              goToPrivateConsumerPass={(privateConsumerPassId) =>
                this.props.goToPrivateConsumerPass(
                  this.props.id,
                  privateConsumerPassId,
                )
              }
            />
          ) : null}
        </Grid>
        {!!this.props.isOpenAttachCoach && (
          <PrivateBookingAttachCoachDialog
            open={!!this.props.isOpenAttachCoach}
            associatedCoachList={this.props.serviceCoaches}
            onSubmit={this.props.attachCoach}
            onClose={this.props.closeAttachCoach}
          />
        )}
        {!!this.props.bookingToDelete && (
          <PrivateBookingDisableDialog
            open={!!this.props.bookingToDelete}
            private_booking={this.props.bookingToDelete}
            onSubmit={(force_refund) =>
              (this.props.bookingToDelete.booking_status_code ===
                BOOKING_STATUS_OK.id
                ? this.props.disablePrivateBooking
                : this.props.deletePrivateBooking)(
                this.props.bookingToDelete.id,
                { force_refund },
                {
                  onSuccess: () => {
                    this.props.fetchPrivateConsumerPass(
                      this.props.bookingToDelete.private_consumer_pass,
                    );
                    this.props.setBookingToDelete(null);
                  },
                  onError: () => {
                    this.props.setBookingToDelete(null);
                  },
                },
              )
            }
            onClose={() => this.props.setBookingToDelete(null)}
          />
        )}
      </Grid>
    );
  }
}

export default compose(
  routerParamsToProps({
    id: 'id:number',
    privateBookingId: 'privateBookingId:number',
  }),
  connect(
    (state, { privateBookingId }) => ({
      private_booking_list: getPrivateBookingListBase(state),
      private_booking: withRelatedFields(getPrivateBooking)(
        state,
        privateBookingId,
      ),
      privateBookingsLoading: state.privateService.privateBooking.loading,
      availableCoaches: getCoaches(state),
    }),
    {
      fetchPrivateBookings,
      fetchPrivateBooking: fetchPrivateBookingAction,
      fetchPrivateService: fetchPrivateServiceAction,
      fetchPrivateSlot: fetchPrivateSlotAction,
      fetchPrivateConsumerPass: fetchPrivateConsumerPassAction,
      fetchAssociatedCoachBulk: fetchAssociatedCoachBulkAction,
      deletePrivateBooking: deletePrivateBookingAction,
      disablePrivateBooking: disablePrivateBookingAction,
      fetchMember: fetchMemberAction,
      attachCoach: attachCoachAction,
      restorePrivateBooking,
      goToPrivateService: (privateServiceId) =>
        push(`/private-service/service/${privateServiceId}/`),
      goToPrivateBooking: (memberId, privateBookingId) =>
        push(`/member/${memberId}/private-booking/${privateBookingId}`),
      goToPrivateConsumerPass: (memberId, privateConsumerPassId) =>
        push(
          `/member/${memberId}/private-consumer-pass/${privateConsumerPassId}`,
        ),
    },
  ),
  connect((state, { private_booking }) => ({
    private_consumer_pass: private_booking
      ? getPrivateConsumerPassDict(state)[private_booking.private_consumer_pass]
      : null,
  })),
  withProps(({ private_booking, availableCoaches }) => ({
    serviceCoaches: availableCoaches.filter((c) =>
      c.associatedcoach_set.filter(
        (value) =>
          private_booking &&
          private_booking.private_service &&
          private_booking.private_service.coaches.indexOf(value) !== -1,
      ),
    ),
  })),
  withHandlers({
    onPrivateSlotClick: ({ goToPrivateService, private_booking }) => () =>
      goToPrivateService(private_booking.private_service.id),
  }),
  withState('bookingToDelete', 'setBookingToDelete', null),
  withStateHandlers(
    { isOpenAttachCoach: null },
    {
      openAttachCoach: (_, { private_booking }) => () => ({
        isOpenAttachCoach: private_booking,
      }),
      closeAttachCoach: () => () => ({ isOpenAttachCoach: null }),
    },
  ),
  withHandlers({
    attachCoach: ({ attachCoach, closeAttachCoach, privateBookingId }) => (
      data,
    ) => {
      attachCoach(privateBookingId, data, {
        onSuccess: () => closeAttachCoach(),
      });
    },
    fetchPrivateBookingDetails: ({
      privateBookingId,
      fetchPrivateConsumerPass,
      fetchAssociatedCoachBulk,
      fetchPrivateService,
      fetchPrivateSlot,
      fetchPrivateBooking,
    }) => () => {
      fetchPrivateBooking(privateBookingId, {
        onSuccess: (privateBooking) => {
          fetchPrivateService(privateBooking.private_service, {
            onSuccess: (service) => {
              if (service && service.coaches.length) {
                fetchAssociatedCoachBulk(service.coaches);
              }
            },
          });
          fetchPrivateSlot(
            privateBooking.private_service,
            privateBooking.private_slot,
          );
          fetchPrivateConsumerPass(privateBooking.private_consumer_pass);
        },
      });
    },
  }),
)(MemberDetailBooking);
