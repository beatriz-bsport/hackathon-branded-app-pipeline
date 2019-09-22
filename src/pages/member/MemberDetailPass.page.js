// @flow

import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import InfoIcon from '@material-ui/icons/Info';
import { push } from 'connected-react-router';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import PaginatedListStateful from '../../components/PaginatedListStateful.component';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import memberSelectors from '../../libs/member/selectors';
import {
  deleteBooking,
  discardBookingAttendance,
  confirmBookingAttendance,
  fetchBookingsByMember,
} from '../../libs/booking/actions';
import { fetchMember as fetchMemberAction } from '../../libs/member/actions';
import {
  fetchByMember as fetchConsumerPackByMemberAction,
  updateCredit as updateCreditAction,
} from '../../actions/consumer-payment-pack.actions';
import { fetchAll as fetchAllPaymentPacks } from '../../actions/paymentPack.actions';
import { fetchSpecificInvoice } from '../../actions/invoice.actions';

import paymentPackSelectors from '../../libs/payment-packs/selectors';
import bookingSelectors from '../../libs/booking/selectors';

import ConsumerPackRowItem from '../../libs/payment-packs/ConsumerPackRowItem.component';
import ConsumerPackDetail from '../../libs/payment-packs/ConsumerPackDetail.component';
import RevertBookingDialog from '../../libs/booking/components/RevertBookingDialog.component';

import type { Member } from '../../libs/member/types';
import type {
  PaymentPack,
  ConsumerPaymentPack,
} from '../../libs/payment-packs/types';
import type { Invoice } from '../../libs/invoice/types';
import type { Booking } from '../../libs/booking/types';

type Props = {
  member: ?Member,
  id: number,
  fetchMember: (id: number) => void,
  fetchConsumerPacks: (id: number) => void,
  fetchBookingsByMember: (id: number) => void,
  fetchAllPaymentPacks: () => void,
  fetchInvoice: (uuid: string) => void,
  consumerPackLoading: boolean,
  consumerPacks: Array<ConsumerPaymentPack>,
  getPaymentPack: (id: number) => PaymentPack,
  getConsumerPackBookings: (id: number) => Array<Booking>,
  consumerPackInvoice: Invoice,
  goToInvoice: (uuid: string) => void,
  goToOffer: (id: number) => void,
  deleteBooking: (id: number) => void,
  incrementCredit: (id: number) => void,
  decrementCredit: (id: number) => void,
  discardBookingAttendance: (id: number) => void,
  confirmBookingAttendance: (id: number) => void,
  goToRelationship: (memberId: number) => void,
  t: TFunction,
  classes: Object,
};

type State = {
  selectedConsumerPack: ?ConsumerPaymentPack,
  bookingToRevert: ?Booking,
};

const ClickOnConsumerPack = withNamespaces(['paymentPack'])(
  (props: { classes: Object, t: TFunction }) => (
    <div className={props.classes.container}>
      <div className={props.classes.emptyMessageContainer}>
        <InfoIcon fontSize="large" color="disabled" />
        <Typography
          className={props.classes.emptyMessageText}
          color="textSecondary"
          variant="caption"
        >
          {props.t('details.pleaseSelectAPack')}
        </Typography>
      </div>
    </div>
  ),
);

export class MemberDetailPass extends Component<Props, State> {
  state = {
    selectedConsumerPack: null,
    bookingToRevert: null,
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.id !== this.props.id) {
      this.fetchData();
    }
  }

  fetchData = () => {
    if (this.props.id) {
      this.props.fetchMember(this.props.id);
      this.props.fetchConsumerPacks(this.props.id);
      this.props.fetchBookingsByMember(this.props.id);
      this.props.fetchAllPaymentPacks();
    }
  };

  onConsumerPackSelected = (selectedConsumerPack: ConsumerPaymentPack) => {
    this.setState({ selectedConsumerPack });
    if (selectedConsumerPack.invoice) {
      this.props.fetchInvoice(selectedConsumerPack.invoice);
    }
  };

  render() {
    return (
      <Grid container direction="row" spacing={16}>
        <Grid item xs={12} lg={6}>
          <Paper>
            <PaginatedListStateful
              itemPerPage={10}
              loading={this.props.consumerPackLoading}
              listProps={{ disablePadding: true }}
              items={this.props.consumerPacks}
              renderItem={(cpp) => (
                <ConsumerPackRowItem
                  hideConsumer
                  selected={
                    this.state.selectedConsumerPack &&
                    this.state.selectedConsumerPack.id === cpp.id
                  }
                  consumerPack={cpp}
                  paymentPack={this.props.getPaymentPack(
                    parseInt(cpp.payment_pack_id, 10),
                  )}
                  incrementCredit={() => this.props.incrementCredit(cpp.id)}
                  decrementCredit={() => this.props.decrementCredit(cpp.id)}
                  onClick={() => this.onConsumerPackSelected(cpp)}
                />
              )}
            />
          </Paper>
          {this.props.consumerPacks.length ? (
            <div className={this.props.classes.shareButtonContainer}>
              <Button
                variant="outlined"
                onClick={() => this.props.goToRelationship(this.props.id)}
                color="primary"
              >
                {this.props.t('details.shareAPass')}
              </Button>
            </div>
          ) : null}
        </Grid>
        <Grid item xs={12} lg={6}>
          {this.state.selectedConsumerPack ? (
            <ConsumerPackDetail
              paymentPack={
                this.state.selectedConsumerPack
                  ? this.props.getPaymentPack(
                      parseInt(
                        this.state.selectedConsumerPack.payment_pack_id,
                        10,
                      ),
                    )
                  : null
              }
              consumerPack={this.state.selectedConsumerPack}
              bookings={this.props.getConsumerPackBookings(
                this.state.selectedConsumerPack.id,
              )}
              invoice={this.props.consumerPackInvoice}
              discardBookingAttendance={this.props.discardBookingAttendance}
              confirmBookingAttendance={this.props.confirmBookingAttendance}
              onBookingClick={this.props.goToOffer}
              handleRevert={(bookingToRevert) =>
                this.setState({ bookingToRevert })
              }
              member={this.props.member}
              onInvoiceClick={this.props.goToInvoice}
            />
          ) : (
            <ClickOnConsumerPack classes={this.props.classes} />
          )}
        </Grid>
        <RevertBookingDialog
          handleBookingDeletion={() => {
            this.props.deleteBooking(this.state.bookingToRevert.id);
            this.setState({ bookingToRevert: null });
          }}
          bookingToRevert={this.state.bookingToRevert}
          offerIsAvailable
          closeRevertBookingDialog={() =>
            this.setState({ bookingToRevert: null })
          }
        />
      </Grid>
    );
  }
}

const styles = (theme) => ({
  container: {
    padding: theme.spacing.unit * 2,
  },
  emptyMessageContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.unit * 4,
  },
  emptyMessageText: {
    marginTop: theme.spacing.unit * 2,
  },
  shareButtonContainer: {
    paddingTop: theme.spacing.unit * 2,
  },
});

export default compose(
  routerParamsToProps({ id: 'id:number' }),
  withNamespaces(['paymentPack']),
  withStyles(styles),
  connect(
    (state, { id }) => ({
      member: memberSelectors.get(state, id),
      consumerPacks: state.consumerPaymentPack.items,
      getPaymentPack: (id_) => paymentPackSelectors.get(state, id_),
      consumerPackInvoice: state.invoice.invoice,
      consumerPackLoading: state.consumerPaymentPack.byMember.loading,
      getConsumerPackBookings: (id_) =>
        bookingSelectors.getByConsumerPack(state, id_),
    }),
    {
      goToInvoice: (uuid) => push(`/invoice/${uuid}`),
      goToRelationship: (memberId) => push(`/member/${memberId}/relation`),
      goToOffer: (b) => push(`/offer/${b.offer}`),
      fetchBookingsByMember,
      deleteBooking,
      discardBookingAttendance,
      confirmBookingAttendance,
      fetchMember: fetchMemberAction,
      incrementCredit: (id_: number) => updateCreditAction(id_, 1),
      decrementCredit: (id_: number) => updateCreditAction(id_, -1),
      fetchInvoice: (uuid: string) => fetchSpecificInvoice(uuid),
      fetchAllPaymentPacks,
      fetchConsumerPacks: (memberId: number) =>
        fetchConsumerPackByMemberAction(memberId),
    },
  ),
)(MemberDetailPass);
