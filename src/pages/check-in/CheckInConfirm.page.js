// @flow

import React from 'react';
import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import { goBack as goBackAction } from 'react-router-redux';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import CheckInConfirm from '../../libs/check-in/components/CheckInConfirm.component';
import memberSelectors from '../../libs/member/selectors';

type Props = {
  classes: Object,
  member: Member,
  paymentPack: any,
  booking: any,
  offer: any,
  goBack: () => void,
};

export const CheckInConfirmPage = (props: Props) => (
  <div className={props.classes.container}>
    <CheckInConfirm
      offer={props.offer}
      booking={props.booking}
      paymentPack={props.paymentPack}
      member={props.member}
      goBack={props.goBack}
    />
  </div>
);

const styles = (theme) => ({
  container: {
    width: '100%',
    padding: theme.spacing.unit * 2,
    minHeight: '70vh',
  },
});

export default compose(
  withStyles(styles),
  routerParamsToProps({
    bookingId: 'bookingId:number',
    offerId: 'offerId:number',
  }),
  connect(
    (state, { bookingId, offerId }) => ({
      offer: state.offer.offers.find((o) => o.id === offerId),
      members: memberSelectors.getByOffer(state),
      booking: state.booking.all.find((b) => b.id === bookingId),
      paymentPacks: state.paymentPack.all,
      bookingLoading: state.booking.loading,
    }),
    {
      goBack: goBackAction,
    },
  ),
  withProps(({ members, paymentPacks, booking }) => ({
    paymentPack: paymentPacks.find((pp) => pp.id === booking.payment_pack),
    member: members.find((m) => m.id === booking.member),
  })),
)(CheckInConfirmPage);
