// @flow

import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import InfoIcon from '@material-ui/icons/Info';
import { push, replace } from 'connected-react-router';
import { compose, withState, withStateHandlers, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import PaginatedListBase from '../../components/PaginatedListBase.component';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import memberSelectors from '../../libs/member/selectors';
import {
  cancelBooking as deleteBooking,
  discardAttendance as discardBookingAttendance,
  confirmAttendance as confirmBookingAttendance,
  fetchBookingsByConsumerPack,
} from '../../libs/booking/actions';
import { fetchMember as fetchMemberAction } from '../../libs/member/actions';
import {
  resetConsumerPackByMember as resetConsumerPackByMemberAction,
  fetchByMember as fetchConsumerPackByMemberAction,
  retrieveConsumerPackBulk,
  updateCredit as updateCreditAction,
  fetchPackExtensions,
  deletePackExtension,
  createPackExtension,
  refundConsumerPaymentPack as refundConsumerPaymentPackActions,
} from '../../libs/consumer-payment-pack/actions';
import { fetchPaymentPackBulk } from '../../libs/payment-packs/actions';
import { fetchSpecificInvoice } from '../../actions/invoice.actions';

import RefundConsumerPaymentPackDialog from '../../libs/consumer-payment-pack/components/RefundConsumerPaymentPackDialog.component';

import paymentPackSelectors from '../../libs/payment-packs/selectors';
import ConsumerPaymentPackExtensionFormDialog from '../../libs/consumer-payment-pack/components/ConsumerPaymentPackExtensionFormDialog.component';
import {
  getConsumerPaymentPackExtensions,
  getConsumerPack,
  getConsumerPaymentPackByMember,
  withPaymentPack,
} from '../../libs/consumer-payment-pack/selectors';
import { getConsumerPackBookingListWithConsumerPack } from '../../libs/booking/selectors';

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
  fetchConsumerPacks: (id: number, page: number, page_size: number) => void,
  fetchBookingsByConsumerPack: (id: number) => void,
  fetchInvoice: (uuid: string) => void,
  fetchExtensions: (consumerPassId: number) => void,
  refreshConsumerPack: (id: number) => void,
  passExtensions: Array<ConsumerPaymentPackExtension>,
  consumerPackLoading: boolean,
  consumerPacks: Array<ConsumerPaymentPack>,
  selectedConsumerPass: ?ConsumerPaymentPack,
  onSelectConsumerPass: (memberId: number, consumerPassId: number) => void,
  consumerPackInvoice: Invoice,
  goToInvoice: (uuid: string) => void,
  goToBooking: (memberId: number, bookingId: number) => void,
  deleteBooking: (id: number) => void,
  incrementCredit: (id: number) => void,
  decrementCredit: (id: number) => void,
  discardBookingAttendance: (id: number) => void,
  confirmBookingAttendance: (id: number) => void,
  goToRelationship: (memberId: number) => void,

  consumerPackCount: number,
  consumerPackCurrentPage: number,

  bookings: Array<Booking>,
  bookingCurrentPage: number,
  bookingLoading: boolean,
  bookingCount: number,

  consumerPassId: ?number,
  retrieveConsumerPackBulk: (Array<number>) => void,
  resetConsumerPackByMemberAction: () => void,

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

const CONSUMER_PAYMENT_PACK_PAGE_SIZE = 6;

const ClickOnConsumerPack = withTranslation(['paymentPack'])(
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
    if (this.props.consumerPassId) {
      this.props.retrieveConsumerPackBulk([this.props.consumerPassId], {
        onSuccess: ([pass]) => this.props.fetchInvoice(pass.invoice),
      });
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.id !== this.props.id) {
      this.fetchData();
    }
    if (
      prevProps.consumerPassId !== this.props.consumerPassId &&
      this.props.consumerPassId
    ) {
      this.props.retrieveConsumerPackBulk([this.props.consumerPassId]);
    }
    if (
      this.props.selectedConsumerPass &&
      (!prevProps.selectedConsumerPass ||
        this.props.selectedConsumerPass.id !==
          prevProps.selectedConsumerPass.id)
    ) {
      this.props.fetchInvoice(this.props.selectedConsumerPass.invoice);
      this.props.fetchExtensions(this.props.selectedConsumerPass.id);
      this.fetchBookings(1, 5);
    }
  }

  fetchData = () => {
    if (this.props.id) {
      this.props.fetchMember(this.props.id);
      this.props.resetConsumerPackByMemberAction();
    }
  };

  goToBooking = (booking: Booking) => {
    this.props.goToBooking(this.props.id, booking.id);
  };

  fetchBookings = (page, page_size) => {
    this.props.fetchBookingsByConsumerPack(
      this.props.selectedConsumerPass.id,
      page,
      page_size,
    );
  };

  render() {
    return (
      <Grid container direction="row" spacing={2}>
        <Grid item xs={12} lg={6}>
          <Paper>
            <PaginatedListBase
              itemPerPage={CONSUMER_PAYMENT_PACK_PAGE_SIZE}
              loading={this.props.consumerPackLoading}
              listProps={{ disablePadding: true }}
              items={this.props.consumerPacks}
              nbItems={this.props.consumerPackCount}
              page={this.props.consumerPackCurrentPage}
              onPageRequested={(page, pageSize) =>
                this.props.fetchConsumerPacks(this.props.id, page, pageSize, {
                  onSuccess: (cppList) =>
                    this.props.fetchPaymentPackBulk(
                      cppList.map((cpp) => cpp.payment_pack),
                    ),
                })
              }
              renderItem={(cpp) => (
                <ConsumerPackRowItem
                  hideConsumer
                  key={cpp.id}
                  selected={
                    this.props.selectedConsumerPass &&
                    this.props.selectedConsumerPass.id === cpp.id
                  }
                  consumerPack={cpp}
                  paymentPack={cpp.payment_pack}
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
          {this.props.selectedConsumerPass &&
          this.props.selectedConsumerPass.payment_pack ? (
            <ConsumerPackDetail
              requestRefund={this.props.requestRefund}
              paymentPack={this.props.selectedConsumerPass.payment_pack}
              consumerPack={this.props.selectedConsumerPass}
              bookings={this.props.bookings}
              onBookingRequested={(page, page_size) =>
                this.fetchBookings(page, page_size)
              }
              currentBookingPage={this.props.bookingCurrentPage}
              bookingLoading={this.props.bookingLoading}
              bookingCount={this.props.bookingCount}
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
        {!!this.props.consumerPaymentPackToRefund && (
          <RefundConsumerPaymentPackDialog
            open
            loading={this.props.refundLoading}
            consumerPaymentPack={this.props.consumerPaymentPackToRefund}
            onClose={this.props.closeRefund}
            onSubmit={this.props.refundConsumerPaymentPack}
          />
        )}
      </Grid>
    );
  }
}

const styles = (theme) => ({
  container: {
    padding: theme.spacing(2),
  },
  emptyMessageContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(4),
  },
  emptyMessageText: {
    marginTop: theme.spacing(2),
  },
  shareButtonContainer: {
    paddingTop: theme.spacing(3),
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
  withTranslation(['paymentPack']),
  withStyles(styles),
  withState('openCreateExtension', 'setOpenCreateExtension', false),
  connect(
    (state, { id, consumerPassId }) => ({
      member: memberSelectors.get(state, id),
      consumerPacks: withPaymentPack(getConsumerPaymentPackByMember)(state, id),
      consumerPackCount: state.consumerPaymentPack.byMember.count,
      consumerPackCurrentPage: state.consumerPaymentPack.byMember.page,
      selectedConsumerPass: withPaymentPack(getConsumerPack)(
        state,
        consumerPassId,
      ),
      consumerPackInvoice: state.invoice.invoice,
      consumerPackLoading: state.consumerPaymentPack.byMember.loading,
      passExtensions: getConsumerPaymentPackExtensions(state),
      passExtensionsLoading: state.consumerPaymentPack.extension.loading,
      bookings: getConsumerPackBookingListWithConsumerPack(state),
      bookingCurrentPage: state.booking.byConsumerPack.page,
      bookingLoading: state.booking.byConsumerPack.loading,
      bookingCount: state.booking.byConsumerPack.count,
      refundLoading: state.consumerPaymentPack.partialRefund.loading,
    }),
    {
      goToInvoice: (uuid) => push(`/invoice/${uuid}`),
      goToRelationship: (memberId) => push(`/member/${memberId}/relation`),
      goToBooking: (memberId, bookingId) =>
        push(`/member/${memberId}/bookings/${bookingId}/`),
      fetchBookingsByConsumerPack,
      onSelectConsumerPass: (memberId: number, id: number) =>
        replace(`/member/${memberId}/pass/${id}/`),
      deleteBooking,

      fetchExtensions: fetchPackExtensions,
      createExtension: createPackExtension,
      deleteExtension: deletePackExtension,
      refreshConsumerPack: (id) => retrieveConsumerPackBulk([id]),
      fetchPaymentPackBulk,

      discardBookingAttendance,
      confirmBookingAttendance,
      fetchMember: fetchMemberAction,

      incrementCredit: (id_: number) => updateCreditAction(id_, 1),
      decrementCredit: (id_: number) => updateCreditAction(id_, -1),
      refundConsumerPaymentPack: refundConsumerPaymentPackActions,

      fetchInvoice: (uuid: string) => fetchSpecificInvoice(uuid),

      retrieveConsumerPackBulk,
      fetchConsumerPacks: (
        memberId: number,
        page: number,
        page_size: number,
        options,
      ) =>
        fetchConsumerPackByMemberAction(memberId, page, page_size, {}, options),
      resetConsumerPackByMemberAction,
    },
  ),
  withStateHandlers(
    { consumerPaymentPackToRefund: null },
    {
      closeRefund: () => () => ({ consumerPaymentPackToRefund: null }),
      requestRefund: () => (consumerPaymentPackToRefund) => ({
        consumerPaymentPackToRefund,
      }),
    },
  ),
  withHandlers({
    refundConsumerPaymentPack: ({
      refundConsumerPaymentPack,
      id,
      fetchMember,
      closeRefund,
      refreshConsumerPack,
    }) => (idPass, data) => {
      refundConsumerPaymentPack(idPass, data, {
        onSuccess: () => {
          fetchMember(id);
          refreshConsumerPack(idPass);
          closeRefund();
        },
      });
    },
  }),
)(MemberDetailPass);
