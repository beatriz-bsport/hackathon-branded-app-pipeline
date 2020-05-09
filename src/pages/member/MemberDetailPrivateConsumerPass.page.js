// @flow
import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { BUYABLE_ITEM_PRIVATE_PASS } from '@bsport/common/lib/master-data/buyable-items';
import PaginatedListStateful from '../../components/PaginatedListStateful.component';
import memberSelectors from '../../libs/member/selectors';
import { fetchMember } from '../../libs/member/actions';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import {
  deletePrivateBooking as deletePrivateBookingAction,
  disablePrivateBooking as disablePrivateBookingAction,
  fetchPrivateConsumerPassList,
  fetchPrivateBookings,
  fetchPrivateConsumerPass,
} from '../../libs/private-service/actions';
import { getPrivateConsumerPassList } from '../../libs/private-service/selectors/private-consumer-pass';
import { getPrivateBookingListBase } from '../../libs/private-service/selectors/private-booking';
import PrivateConsumerPassBookerListItem from '../../libs/private-service/components/booking-module/PrivateConsumerPassBookerListItem.component';
import PrivateConsumerPassDetail from '../../libs/private-service/components/consumer-pass/PrivateConsumerPassDetail.component';
import { fetchByInvoiceItem as fetchInvoiceByInvoiceItem } from '../../actions/invoice.actions';

type Props = {
  fetchPrivateConsumerPassList: (params: any) => void,
  id: number,
  fetchMember: (id: number) => void,
  privateConsumerPassId: ?number,
  fetchPrivateBookings: (params: any) => void,
  fetchInvoiceByInvoiceItem: (
    buyable_item_identifier: number,
    object_id: number,
  ) => void,
  privateConsumerPassInvoice: ?Invoice,
  onInvoiceClick: (uuid: string) => void,
  privateBookingsLoading: boolean,
  private_consumer_pass_list: Array<PrivateConsumerPass>,
  private_consumer_pass: ?PrivateConsumerPass,
  private_booking_list: Array<PrivateBooking>,
  disablePrivateBooking: (
    id: number,
    data: any,
    options: {
      onSuccess?: (PrivateBooking) => void,
      onError?: (Error) => void,
    },
  ) => void,
  deletePrivateBooking: (
    id: number,
    data: any,
    options: {
      onSuccess?: (PrivateBooking) => void,
      onError?: (Error) => void,
    },
  ) => void,
  goToPrivateConsumerPass: (memberId: number, consumerPassId: number) => void,
  goToPrivateBooking: (memberId: number, privateBookingId: number) => void,
  fetchPrivateConsumerPass: (params: any) => void,
};

export class MemberDetailPrivateConsumerPass extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchPrivateConsumerPassList({ member: this.props.id });
    this.props.fetchMember(this.props.id);
    if (this.props.privateConsumerPassId) {
      this.fetchPrivateConsumerPassDetail();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (
      this.props.privateConsumerPassId &&
      (!prevProps.privateConsumerPassId ||
        prevProps.privateConsumerPassId !== this.props.privateConsumerPassId)
    ) {
      this.fetchPrivateConsumerPassDetail();
    }
  }

  fetchPrivateConsumerPassDetail = () => {
    this.props.fetchPrivateBookings({
      private_consumer_pass: this.props.privateConsumerPassId,
    });
    this.props.fetchInvoiceByInvoiceItem(
      BUYABLE_ITEM_PRIVATE_PASS,
      this.props.privateConsumerPassId,
    );
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
              items={this.props.private_consumer_pass_list}
              renderItem={(pcp) => (
                <PrivateConsumerPassBookerListItem
                  divider
                  selected={this.props.privateConsumerPassId === pcp.id}
                  key={pcp.id}
                  private_consumer_pass={pcp}
                  onClick={() =>
                    this.props.goToPrivateConsumerPass(this.props.id, pcp.id)
                  }
                />
              )}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} lg={6}>
          {this.props.privateConsumerPassId ? (
            <PrivateConsumerPassDetail
              private_booking_list={this.props.private_booking_list}
              privateBookingsLoading={this.props.privateBookingsLoading}
              private_consumer_pass={this.props.private_consumer_pass}
              disablePrivateBooking={this.props.disablePrivateBooking}
              deletePrivateBooking={this.props.deletePrivateBooking}
              fetchPrivateConsumerPass={this.props.fetchPrivateConsumerPass}
              invoice={this.props.privateConsumerPassInvoice}
              onInvoiceClick={this.props.onInvoiceClick}
              goToPrivateBooking={(privateBookingId) =>
                this.props.goToPrivateBooking(this.props.id, privateBookingId)
              }
            />
          ) : null}
        </Grid>
      </Grid>
    );
  }
}

export default compose(
  routerParamsToProps({
    id: 'id:number',
    privateConsumerPassId: 'privateConsumerPassId:number',
  }),
  connect(
    (state, { id }) => ({
      member: memberSelectors.get(state, id),
      private_consumer_pass_list: getPrivateConsumerPassList(state),
      private_booking_list: getPrivateBookingListBase(state),
      privateConsumerPassInvoice: state.invoice.invoice,
      privateConsumerPassLoading:
        state.privateService.privateConsumerPass.loading,
      privateBookingsLoading: state.privateService.privateBooking.loading,
    }),
    {
      fetchPrivateConsumerPassList,
      fetchPrivateBookings,
      fetchInvoiceByInvoiceItem,
      fetchPrivateConsumerPass,
      deletePrivateBooking: deletePrivateBookingAction,
      disablePrivateBooking: disablePrivateBookingAction,
      fetchMember,
      onInvoiceClick: (uuid: string) => push(`/invoice/${uuid}`),
      goToPrivateBooking: (memberId, privateBookingId) =>
        push(`/member/${memberId}/private-booking/${privateBookingId}`),
      goToPrivateConsumerPass: (memberId, privateConsumerPassId) =>
        push(
          `/member/${memberId}/private-consumer-pass/${privateConsumerPassId}`,
        ),
    },
  ),
)(MemberDetailPrivateConsumerPass);
