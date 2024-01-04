import React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { push } from 'connected-react-router';
// @ts-expect-error
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import { fetchOfferBulk as fetchOfferBulkAction } from '#libs/offer/actions';
import { fetchGroupOffer as fetchGroupOfferAction } from '#libs/group-offer/actions';
import { fetchLevelList as fetchLevelListAction } from '#libs/level/actions';
import { retrieveConsumerPackBulk as retrieveConsumerPackBulkAction } from '#libs/consumer-payment-pack/actions';
import { fetchCoachBulk as fetchCoachBulkAction } from '#libs/associated-coach/actions';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '#libs/meta-activity/actions';
import {
  fetchMyPastBookingAsMember as fetchMyPastBookingAsMemberAction,
  fetchMyFutureBookingAsMember as fetchMyFutureBookingAsMemberAction,
} from '#libs/consumer-space/actions';

import { getMembership } from '#libs/membership/selectors';
import {
  getMyPastBookingsState,
  getMyFutureBookingsState,
} from '#libs/consumer-space/selectors';

import ConsumerBookingPageReworked from '#libs/consumer-space/components/reworked/@MyBookings/ConsumerBookingPageReworked';

import type { BookingREST } from '#libs/booking/types';
import type { RootState } from '../../reducers';
import type { WithHandlerType } from '../../utils/types';

type OwnProps = {};
type ParamsProps = {
  companyId: number;
};

type OwnAndConnectedProps = OwnProps &
  ParamsProps &
  ConnectedProps<typeof connector>;

type Props = {
  // Keeping for typing only
  bookings: BookingREST[];
  fetchBookingList: (member: number, page: number, page_size: number) => void;
  goToCalendar: (companyName: string, companyId: number) => void;
} & WithHandlerType<typeof mapWithHandlers> &
  OwnAndConnectedProps;

export class ConsumerBooking extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchMyFutureBookingAsMember({
      member: this.props.membership.id,
    });
    this.props.fetchMyPastBookingAsMember({ member: this.props.membership.id });
  }

  render() {
    return (
      <ConsumerBookingPageReworked
        futureBookingsState={this.props.myFutureBookingsState}
        pastBookingsState={this.props.myPastBookingsState}
      />
    );
  }
}

const connector = connect(
  (state: RootState, { companyId }: OwnProps & ParamsProps) => ({
    companyId: state.theme.theme.company,
    membership: getMembership(state, companyId),
    timezone: state.theme.theme.timezone_name,
    // REWORKED
    myPastBookingsState: getMyPastBookingsState(state),
    myFutureBookingsState: getMyFutureBookingsState(state),
  }),
  {
    fetchCoachBulk: fetchCoachBulkAction,
    fetchGroupOffer: fetchGroupOfferAction,
    fetchLevelList: fetchLevelListAction,
    fetchMetaActivityBulk: fetchMetaActivityBulkAction,
    fetchOfferBulk: fetchOfferBulkAction,
    push,
    retrieveConsumerPackBulk: retrieveConsumerPackBulkAction,
    // REWORKED
    fetchMyPastBookingAsMember: fetchMyPastBookingAsMemberAction,
    fetchMyFutureBookingAsMember: fetchMyFutureBookingAsMemberAction,
  },
);

const mapWithHandlers = {};
export default compose(
  routerParamsToProps({ companyId: 'companyId:number' }),
  connector,
  withHandlers(mapWithHandlers),
  marketplaceCssHoc(),
)(ConsumerBooking);
