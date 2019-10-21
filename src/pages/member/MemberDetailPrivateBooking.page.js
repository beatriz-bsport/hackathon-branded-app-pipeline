// @flow

import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { compose, withState } from 'recompose';
import { BOOKING_STATUS_OK } from '@bsport/common/lib/master-data/booking_status_code';
import PaginatedListStateful from '../../components/PaginatedListStateful.component';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import {
  deletePrivateBooking as deletePrivateBookingAction,
  disablePrivateBooking as disablePrivateBookingAction,
  fetchPrivateBookings,
  fetchPrivateService,
  fetchPrivateSlot,
  fetchPrivateConsumerPass,
} from '../../libs/private-service/actions';
import {
  getPrivateBookingListBase,
  getPrivateBookingDict,
} from '../../libs/private-service/selectors/private-booking';
import { getPrivateConsumerPassDict } from '../../libs/private-service/selectors/private-consumer-pass';
import { getPrivateSlot } from '../../libs/private-service/selectors/private-slot';
import { getPrivateService } from '../../libs/private-service/selectors/private-service';

import { fetchMember as fetchMemberAction } from '../../libs/member/actions';

import PrivateBookingListItem from '../../libs/private-service/components/PrivateBookingListItem.component';
import PrivateBookingDetail from '../../libs/private-service/components/PrivateBookingDetail.component';
import PrivateBookingDisableDialog from '../../libs/private-service/components/PrivateBookingDisableDialog.component';

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
  goToPrivateService: (privateServiceId: number) => void,
  goToPrivateConsumerPass: (
    memberId: number,
    privateConsumerPassId: number,
  ) => void,

  private_booking: ?PrivateBooking,
  privateBookingId: ?number,
  fetchPrivateService: (id: number) => void,
  fetchPrivateSlot: (id: number) => void,
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
};

export class MemberDetailBooking extends Component<Props> {
  componentDidMount() {
    this.props.fetchPrivateBookings({ member: this.props.id });
    this.props.fetchMember(this.props.id);
    if (this.props.private_booking) {
      this.fetchPrivateBookingDetails();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (
      this.props.privateBookingId &&
      (!prevProps.private_booking ||
        prevProps.private_booking.id !== this.props.privateBookingId)
    ) {
      this.fetchPrivateBookingDetails();
    }
  }

  fetchPrivateBookingDetails = () => {
    const { private_booking } = this.props;
    if (private_booking) {
      this.props.fetchPrivateService(private_booking.private_service);
      this.props.fetchPrivateSlot(
        private_booking.private_service,
        private_booking.private_slot,
      );
      this.props.fetchPrivateConsumerPass(
        private_booking.private_consumer_pass,
      );
    }
  };

  goToConsumerPass = (consumerPassId: number) => {
    this.props.goToConsumerPass(this.props.id, consumerPassId);
  };

  render() {
    return (
      <Grid container direction="row" spacing={24}>
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
                />
              )}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} lg={6}>
          {this.props.private_booking ? (
            <PrivateBookingDetail
              private_booking={this.props.private_booking}
              private_slot={this.props.private_slot}
              private_service={this.props.private_service}
              private_consumer_pass={this.props.private_consumer_pass}
              onPrivateSlotClick={() =>
                this.props.goToPrivateService(
                  this.props.private_booking.private_service,
                )
              }
              goToPrivateConsumerPass={(privateConsumerPassId) =>
                this.props.goToPrivateConsumerPass(
                  this.props.id,
                  privateConsumerPassId,
                )
              }
            />
          ) : null}
        </Grid>
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
      private_booking: getPrivateBookingDict(state)[privateBookingId],
      privateBookingsLoading: state.privateService.privateBooking.loading,
    }),
    {
      fetchPrivateBookings,
      fetchPrivateService,
      fetchPrivateSlot,
      fetchPrivateConsumerPass,
      deletePrivateBooking: deletePrivateBookingAction,
      disablePrivateBooking: disablePrivateBookingAction,
      fetchMember: fetchMemberAction,
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
    private_service: private_booking
      ? getPrivateService(state, private_booking.private_service)
      : null,
    private_slot: private_booking
      ? getPrivateSlot(state, private_booking.private_slot)
      : null,
    private_consumer_pass: private_booking
      ? getPrivateConsumerPassDict(state)[private_booking.private_consumer_pass]
      : null,
  })),
  withState('bookingToDelete', 'setBookingToDelete', null),
)(MemberDetailBooking);
