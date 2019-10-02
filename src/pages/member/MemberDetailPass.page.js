// @flow

import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import InfoIcon from '@material-ui/icons/Info';
import { push, replace } from 'connected-react-router';
import { compose, withState } from 'recompose';
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
  fetchConsumerPackAsManager,
  fetchPackExtensions,
  deletePackExtension,
  createPackExtension,
} from '../../actions/consumer-payment-pack.actions';
import { fetchAllPaymentPacks } from '../../libs/payment-packs/actions';
import { fetchSpecificInvoice } from '../../actions/invoice.actions';

import paymentPackSelectors from '../../libs/payment-packs/selectors';
import ConsumerPaymentPackExtensionFormDialog from '../../libs/consumer-payment-pack/components/ConsumerPaymentPackExtensionFormDialog.component';
import { getConsumerPaymentPackExtensions } from '../../libs/consumer-payment-pack/selectors';
import bookingSelectors from '../../libs/booking/selectors';

import ConsumerPackRowItem from '../../libs/consumer-payment-pack/components/ConsumerPackRowItem.component';
import ConsumerPackDetail from '../../libs/consumer-payment-pack/components/ConsumerPackDetail.component';
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
  fetchExtensions: (consumerPassId: number) => void,
  refreshConsumerPack: (id: number) => void,
  passExtensions: Array<ConsumerPaymentPackExtension>,
  consumerPackLoading: boolean,
  consumerPacks: Array<ConsumerPaymentPack>,
  selectedConsumerPass: ?ConsumerPaymentPack,
  onSelectConsumerPass: (memberId: number, consumerPassId: number) => void,
  getPaymentPack: (id: number) => PaymentPack,
  getConsumerPackBookings: (id: number) => Array<Booking>,
  consumerPackInvoice: Invoice,
  goToInvoice: (uuid: string) => void,
  goToBooking: (memberId: number, bookingId: number) => void,
  deleteBooking: (id: number) => void,
  incrementCredit: (id: number) => void,
  decrementCredit: (id: number) => void,
  discardBookingAttendance: (id: number) => void,
  confirmBookingAttendance: (id: number) => void,
  goToRelationship: (memberId: number) => void,

  passExtensionsLoading: boolean,
  setOpenCreateExtension: (boolean) => void,
  deleteExtension: (
    id: number,
    options: ?{ onSuccess: ?() => void, onError: ?() => void },
  ) => void,
  openCreateExtension: boolean,
  setOpenCreateExtension: (boolean) => void,
  createExtension: (data: any) => void,

  t: TFunction,
  classes: Object,
};

type State = {
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
    bookingToRevert: null,
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.id !== this.props.id) {
      this.fetchData();
    }
    if (
      this.props.selectedConsumerPass &&
      (!prevProps.selectedConsumerPass ||
        this.props.selectedConsumerPass.id !==
          prevProps.selectedConsumerPass.id)
    ) {
      this.props.fetchInvoice(this.props.selectedConsumerPass.invoice);
      this.props.fetchExtensions(this.props.selectedConsumerPass.id);
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

  goToBooking = (booking: Booking) => {
    this.props.goToBooking(this.props.id, booking.id);
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
                  key={cpp.id}
                  selected={
                    this.props.selectedConsumerPass &&
                    this.props.selectedConsumerPass.id === cpp.id
                  }
                  consumerPack={cpp}
                  paymentPack={this.props.getPaymentPack(
                    parseInt(cpp.payment_pack_id, 10),
                  )}
                  incrementCredit={() => this.props.incrementCredit(cpp.id)}
                  decrementCredit={() => this.props.decrementCredit(cpp.id)}
                  onClick={() =>
                    this.props.onSelectConsumerPass(this.props.id, cpp.id)
                  }
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
          {this.props.selectedConsumerPass ? (
            <ConsumerPackDetail
              paymentPack={
                this.props.selectedConsumerPass
                  ? this.props.getPaymentPack(
                      parseInt(
                        this.props.selectedConsumerPass.payment_pack_id,
                        10,
                      ),
                    )
                  : null
              }
              consumerPack={this.props.selectedConsumerPass}
              bookings={this.props.getConsumerPackBookings(
                this.props.selectedConsumerPass.id,
              )}
              invoice={this.props.consumerPackInvoice}
              discardBookingAttendance={this.props.discardBookingAttendance}
              confirmBookingAttendance={this.props.confirmBookingAttendance}
              onBookingClick={this.goToBooking}
              extensions={this.props.passExtensions}
              extensionsLoading={this.props.passExtensionsLoading}
              handleRevert={(bookingToRevert) =>
                this.setState({ bookingToRevert })
              }
              member={this.props.member}
              onInvoiceClick={this.props.goToInvoice}
              onCreateExtension={() => this.props.setOpenCreateExtension(true)}
              deleteExtension={(id) => {
                this.props.deleteExtension(id, {
                  onSuccess: () =>
                    this.props.refreshConsumerPack(
                      this.props.selectedConsumerPass.id,
                    ),
                });
              }}
            />
          ) : (
            <ClickOnConsumerPack classes={this.props.classes} />
          )}
        </Grid>
        <ConsumerPaymentPackExtensionFormDialog
          open={this.props.openCreateExtension}
          onClose={() => this.props.setOpenCreateExtension(false)}
          consumerPaymentPack={this.props.selectedConsumerPass}
          onSubmit={(data) => {
            this.props.createExtension(
              {
                ...data,
                consumer_payment_pack: this.props.selectedConsumerPass.id,
              },
              {
                onSuccess: () => {
                  this.props.refreshConsumerPack(
                    this.props.selectedConsumerPass.id,
                  );
                  this.props.setOpenCreateExtension(false);
                },
              },
            );
          }}
        />
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
    paddingTop: theme.spacing.unit * 3,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default compose(
  routerParamsToProps({
    id: 'id:number',
    consumerPassId: 'consumerPassId:number',
  }),
  withNamespaces(['paymentPack']),
  withStyles(styles),
  withState('openCreateExtension', 'setOpenCreateExtension', false),
  connect(
    (state, { id, consumerPassId }) => ({
      member: memberSelectors.get(state, id),
      consumerPacks: state.consumerPaymentPack.items,
      selectedConsumerPass: state.consumerPaymentPack.items.find(
        (cpp) => cpp.id === consumerPassId,
      ),
      getPaymentPack: (id_) => paymentPackSelectors.get(state, id_),
      consumerPackInvoice: state.invoice.invoice,
      consumerPackLoading: state.consumerPaymentPack.byMember.loading,
      passExtensions: getConsumerPaymentPackExtensions(state),
      passExtensionsLoading: state.consumerPaymentPack.extension.loading,
      getConsumerPackBookings: (id_) =>
        bookingSelectors.getByConsumerPack(state, id_),
    }),
    {
      goToInvoice: (uuid) => push(`/invoice/${uuid}`),
      goToRelationship: (memberId) => push(`/member/${memberId}/relation`),
      goToBooking: (memberId, bookingId) =>
        push(`/member/${memberId}/bookings/${bookingId}/`),
      fetchBookingsByMember,
      onSelectConsumerPass: (memberId: number, id: number) =>
        replace(`/member/${memberId}/pass/${id}/`),
      deleteBooking,

      fetchExtensions: fetchPackExtensions,
      createExtension: createPackExtension,
      deleteExtension: deletePackExtension,
      refreshConsumerPack: fetchConsumerPackAsManager,

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
