import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import moment from 'moment-timezone';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import { connect } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { push as pushRouter } from 'connected-react-router';
import TodayIcon from '@material-ui/icons/Today';

import { Theme } from '@material-ui/core/styles';
import themeSelectors from '../../libs/theme/selectors';
import BookingCancellationDialog from '../../libs/booking/components/BookingCancellationDialog.component';
import MemberBillingProblemCard from '../../libs/member/components/MemberBillingProblemCard.component';
import BookingOptionCancelDialog from '../../libs/waiting-list/components/BookingOptionCancelDialog.component';
import ConsumerDashboardBookingPanel from '../../libs/consumer-space/components/ConsumerDashboardBookingPanel.component';
import ConsumerDashboardHeader from '../../libs/consumer-space/components/ConsumerDashboardHeader.component';
import ConsumerDashboardPassPanel from '../../libs/consumer-space/components/ConsumerDashboardPassPanel.component';
import ConsumerDashboardBookingOptionPanel from '../../libs/consumer-space/components/ConsumerDashboardBookingOptionPanel.component';
import { fetchMembership as fetchMembershipAction } from '../../libs/membership/actions';

import { getFavoriteEstablishment } from '../../libs/establishment/selectors';
import { getFavoriteMetaActivity } from '../../libs/meta-activity/selectors';

import { buildUrlParams } from '../../http';
import { getPrivateConsumerPassList } from '../../libs/private-service/selectors/private-consumer-pass';

import { getConsumerPacksByMemberWithPaymentPack } from '../../libs/consumer-payment-pack/selectors';
import { cancelBooking as cancelBookingAction } from '../../libs/booking/actions';
import { fetchOfferBulk as fetchOfferBulkAction } from '../../libs/offer/actions';
import {
  fetchEstablishmentFavorite,
  fetchEstablishmentBulk as fetchEstablishmentBulkAction,
} from '../../libs/establishment/actions';
import { fetchCoachBulk as fetchCoachBulkAction } from '../../libs/associated-coach/actions';
import {
  fetchMetaActivityFavorite,
  fetchMetaActivityBulk as fetchMetaActivityBulkAction,
} from '../../libs/meta-activity/actions';
import { getBookingOptionConsumerList } from '../../libs/waiting-list/selectors';
import {
  fetchBookingOptionAsConsumer,
  discardBookingOption as cancelBookingOptionAction,
} from '../../libs/waiting-list/actions';

import {
  fetchPrivateConsumerPassList,
  disablePrivateBooking,
} from '../../libs/private-service/actions';
import { fetchPaymentPackBulk as fetchPaymentPackBulkAction } from '../../libs/payment-packs/actions';
import { fetchByMember as fetchConsumerPackByMemberAction } from '../../libs/consumer-payment-pack/actions';
import { urlToMarketplace } from '../../libs/marketplace/utils';
import { fetchInvoiceList as fetchInvoiceListAction } from '../../libs/invoice/actions';

import { withInvoiceItem, getInvoiceList } from '../../libs/invoice/selectors';
import { RootState } from '../../reducers';
import { Membership } from '../../libs/membership/types';
import { OptionCallback } from '../../state/types';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import type { Booking } from '../../libs/booking/types';
import { Invoice } from '../../libs/invoice/types';
import { fetchBookingsAndPrivateBookings as fetchBookingsAndPrivateBookingsAction } from '../../libs/consumer-space/actions';
import { getAllBookingAndPrivateBooking } from '../../libs/consumer-space/selectors';
import { PrivateBooking } from '../../libs/private-service/types';
import PrivateBookingCancellationDialog from '../../libs/private-service/components/booking/PrivateBookingCancellationDialog';
import { MetaActivity } from '../../libs/meta-activity/types';
import {
  detachPaymentMethod,
  fetchPaymentMethodList,
} from '../../libs/payment/actions';
import {
  snackbarWarning,
  snackbarSuccess,
} from '../../actions/snackbar.actions';

type OwnProps = {
  companyId: number;
  membership?: Membership;
};

type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;

type ConnectedProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

type OwnConnectedStateHandlerProps = OwnProps &
  ConnectedProps &
  StateHandlerType;

type Props = WithHandlerType<typeof mapWithHandlers> &
  OwnConnectedStateHandlerProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

export class ConsumerDashboard extends React.PureComponent<Props> {
  componentDidMount() {
    this.props.fetchBookingsAndPrivateBookings(1);

    this.props.fetchPrivateConsumerPassList({
      company: this.props.membership.company,
      mine: true,
    });
    this.props.fetchConsumerPacks(this.props.membership.id, 1, 300);

    this.props.fetchEstablishmentFavorite(this.props.membership.company);
    this.props.fetchMetaActivityFavorite(this.props.membership.company);

    this.props.fetchBookingOptionAsConsumer(this.props.membership.company, {
      min_date: moment().format('YYYY-MM-DD'),
    });
    this.props.fetchInvoiceListUnpaid();
  }

  refreshDebtStatus = () => {
    this.props.fetchMembership(this.props.membership.id);
    this.props.fetchInvoiceListUnpaid();
  };

  goToInvoice = (uuid: string, invoice: Invoice) => {
    window.open(invoice.stripe_invoice_pdf);
  };

  onDiscardBooking = (id: number, dialogOptions: OptionCallback) => {
    this.props.cancelBooking(this.props.bookingToCancel.id, null, {
      onSuccess: () => {
        dialogOptions.onSuccess();
        this.props.setBookingToCancel(null);
        this.props.fetchBookingsAndPrivateBookings(1);
      },
      onError: () => {
        dialogOptions.onError();
        this.props.setBookingToCancel(null);
      },
    });
  };

  onDiscardPrivateBooking = (id: number, dialogOptions: OptionCallback) => {
    this.props.discardPrivateBooking(
      id,
      {},
      {
        onSuccess: () => {
          dialogOptions.onSuccess();
          this.props.setPrivateBookingToCancel(null);
          this.props.fetchBookingsAndPrivateBookings(1);
        },
      },
    );
  };

  render() {
    return (
      <div className={this.props.classes.container}>
        <div className={this.props.classes.header}>
          <div>
            <Button
              onClick={() => this.props.goToCalendar()}
              color="primary"
              variant="contained"
            >
              <TodayIcon className={this.props.classes.iconLeft} />
              {this.props.t('actions.goToCalendar')}
            </Button>
          </div>
        </div>
        <ConsumerDashboardHeader
          favoriteMetaActivity={this.props.favoriteMetaActivity}
          favoriteEstablishment={this.props.favoriteEstablishment}
          goToCalendar={this.props.goToCalendar}
        />
        <div style={{ marginBottom: 32 }}>
          <MemberBillingProblemCard
            invoiceLoading={this.props.invoiceLoading}
            memberId={this.props.membership.id}
            unpaidInvoiceList={this.props.unpaidInvoiceList}
            goToInvoice={this.goToInvoice}
            balance={this.props.membership.credit_account_balance}
            fetchInvoiceListUnpaid={this.refreshDebtStatus}
            hidePositiveBalance
            asConsumer
            availablePaymentMethodList={
              this.props.payment_method_available_basket
            }
            detachPaymentMethodLoading={this.props.detachPaymentMethodLoading}
            detachPaymentMethod={this.props.detachPaymentMethod}
            snackbarErrorMsg={this.props.snackbarErrorMsg}
            snackbarSuccessMsg={this.props.snackbarSuccessMsg}
          />
        </div>
        <Grid container direction="row" spacing={2}>
          <Grid item xs={12} md={6}>
            <ConsumerDashboardBookingPanel
              goToCalendar={this.props.goToCalendar}
              goToBroadcast={this.props.goToBroadcast}
              showMoreBooking={this.props.fetchBookingsAndPrivateBookings}
              timezone={this.props.companyTheme.timezone_name}
              membership={this.props.membership}
              onDiscardBooking={this.props.setBookingToCancel}
              onDiscardPrivateBooking={this.props.setPrivateBookingToCancel}
              bookingsAndPrivateBookings={this.props.bookingsAndPrivateBookings}
              loading={this.props.bookingsAndPrivateBookingsLoading}
              hasMore={this.props.hasMoreBookingsAndPrivateBookings}
              goToPrivateService={this.props.goToPrivateService}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ConsumerDashboardBookingOptionPanel
              bookingOptionList={this.props.bookingOptionList}
              cancelBookingOption={this.props.setOptionToCancel}
              confirmBookingOption={this.props.confirmBookingOption}
            />
            <ConsumerDashboardPassPanel
              consumerPackList={this.props.consumerPackList}
              privateConsumerPassList={this.props.privateConsumerPassList}
              consumerPackLoading={this.props.consumerPackLoading}
              privateConsumerPassLoading={this.props.privateConsumerPassLoading}
            />
          </Grid>
        </Grid>
        <BookingOptionCancelDialog
          open={this.props.optionToCancel}
          onCancel={() => this.props.setOptionToCancel(null)}
          onSubmit={this.props.cancelBookingOption}
        />
        <BookingCancellationDialog
          open={this.props.bookingToCancel}
          booking={this.props.bookingToCancel}
          onCancel={() => this.props.setBookingToCancel(null)}
          onSubmit={(options: OptionCallback) =>
            this.onDiscardBooking(this.props.bookingToCancel.id, options)
          }
        />

        <PrivateBookingCancellationDialog
          open={!!this.props.privateBookingToCancel}
          privateBooking={this.props.privateBookingToCancel}
          onCancel={() => this.props.setPrivateBookingToCancel(null)}
          onSubmit={(options) =>
            this.onDiscardPrivateBooking(
              this.props.privateBookingToCancel.id,
              options,
            )
          }
        />
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  container: {},
  header: {
    display: 'flex',
    padding: theme.spacing(1),
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
  statRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
  },
});

const mapStateToProps = (state: RootState) => ({
  bookingsAndPrivateBookings: getAllBookingAndPrivateBooking(state),
  bookingsAndPrivateBookingsLoading:
    state.consumer.bookingAndPrivateBooking.loading,
  hasMoreBookingsAndPrivateBookings:
    state.consumer.bookingAndPrivateBooking.hasMore,

  bookingOptionList: getBookingOptionConsumerList(state),

  privateConsumerPassList: getPrivateConsumerPassList(state),
  privateConsumerPassLoading: state.privateService.privateConsumerPass.loading,
  consumerPackLoading: state.consumerPaymentPack.byMember.loading,

  companyTheme: themeSelectors.getTheme(state),
  consumerPackList: getConsumerPacksByMemberWithPaymentPack(state),
  favoriteMetaActivity: getFavoriteMetaActivity(state),
  favoriteEstablishment: getFavoriteEstablishment(state),
  unpaidInvoiceList: withInvoiceItem(getInvoiceList)(state),
  invoiceLoading: state.invoice.list.loading,
  payment_method_available_basket:
    state.theme.theme.payment_method_available_basket,
  metaActivitiesById: state.metaActivity.byId,
  detachPaymentMethodLoading: state.paymentBackend.detachPaymentMethod.loading,
});

const mapDispatchToProps = {
  fetchInvoiceList: fetchInvoiceListAction,
  push: pushRouter,
  cancelBooking: cancelBookingAction,
  discardPrivateBooking: disablePrivateBooking,
  fetchOfferBulk: fetchOfferBulkAction,
  fetchMetaActivityBulk: fetchMetaActivityBulkAction,
  fetchCoachBulk: fetchCoachBulkAction,
  fetchEstablishmentBulk: fetchEstablishmentBulkAction,
  fetchPaymentPackBulk: fetchPaymentPackBulkAction,
  fetchConsumerPacks: (
    memberId: number,
    page: number,
    page_size: number,
    options: OptionCallback,
    params: any,
  ) =>
    fetchConsumerPackByMemberAction(memberId, page, page_size, options, params),
  fetchBookingOptionAsConsumer,
  fetchPrivateConsumerPassList,
  fetchMetaActivityFavorite,
  fetchEstablishmentFavorite,
  fetchMembership: fetchMembershipAction,
  cancelBookingOption: cancelBookingOptionAction,
  fetchBookingsAndPrivateBookings: fetchBookingsAndPrivateBookingsAction,
  detachPaymentMethodAction: detachPaymentMethod,
  fetchMemberPaymentMethod: fetchPaymentMethodList,
  snackbarErrorMsg: snackbarWarning,
  snackbarSuccessMsg: snackbarSuccess,
};

type StateHandlerInit = {
  bookingToCancel: Booking | null;
  privateBookingToCancel: PrivateBooking | null;
  optionToCancel: number | null;
};

const withStateHandlersInit: StateHandlerInit = {
  bookingToCancel: null,
  privateBookingToCancel: null,
  optionToCancel: null,
};

const withStateHandlersSetter = {
  setBookingToCancel: () => (bookingToCancel: Booking | null) => {
    return { bookingToCancel };
  },
  setPrivateBookingToCancel: () => (
    privateBookingToCancel: PrivateBooking | null,
  ) => {
    return { privateBookingToCancel };
  },
  setOptionToCancel: () => (optionToCancel: number | null) => {
    return { optionToCancel };
  },
};

const mapWithHandlers = {
  cancelBookingOption: (props: OwnConnectedStateHandlerProps) => () => {
    props.cancelBookingOption(props.optionToCancel, null, {
      onSuccess: () => props.setOptionToCancel(null),
    });
  },
  confirmBookingOption: (props: OwnConnectedStateHandlerProps) => (
    offerId: number,
    optionId: number,
  ) => {
    props.push(`/payment/offer/${offerId}?option_id=${optionId}`);
  },
  goToBroadcast: (props: OwnConnectedStateHandlerProps) => (
    bookingId: number,
  ) => {
    props.push(`/c/${props.membership.company}/broadcast/${bookingId}/`);
  },
  goToCalendar: (props: OwnConnectedStateHandlerProps) => (
    params: any,
    metaActivityId: number,
  ) => {
    const metaActivity: MetaActivity = props.metaActivitiesById[metaActivityId];
    const componentType =
      metaActivity && metaActivity.is_workshop ? 'workshop' : 'calendar';

    props.push(
      `${urlToMarketplace(
        props.membership.company_name,
        props.membership.company.toString(),
      )}/${componentType}/${buildUrlParams({ ...params, filtersOpen: true })}`,
    );
  },
  goToPrivateService: (props: OwnConnectedStateHandlerProps) => () => {
    props.push(
      `${urlToMarketplace(
        props.membership.company_name,
        props.membership.company.toString(),
      )}/private-service/`,
    );
  },
  fetchBookingsAndPrivateBookings: (props: OwnConnectedStateHandlerProps) => (
    page?: number,
  ) => {
    props.fetchBookingsAndPrivateBookings({
      page,
      date_start: moment().format('YYYY-MM-DD'),
      member: props.membership.id,
      options: {
        onSuccess: (bookingsAndPrivateBookings) => {
          const bookings = bookingsAndPrivateBookings
            .filter((bAndP) => bAndP.type === 'booking' && bAndP.booking)
            .map((b) => b.booking);

          props.fetchOfferBulk(
            bookings.map((b) => b.offer),
            {
              // @ts-ignore
              onSuccess: (offerList) => {
                // @ts-ignore
                props.fetchMetaActivityBulk(
                  // @ts-ignore
                  offerList.map((b) => b.meta_activity),
                );
                props.fetchCoachBulk([
                  // @ts-ignore
                  ...offerList.map((b) => b.coach),
                  // @ts-ignore
                  ...offerList.map((b) => b.coach_override),
                ]);
                props.fetchEstablishmentBulk([
                  // @ts-ignore
                  ...offerList.map((b) => b.establishment),
                  // @ts-ignore
                  ...offerList.map((b) => b.establishment_override),
                ]);
              },
            },
          );
        },
      },
    });
  },
  fetchInvoiceListUnpaid: (props: OwnConnectedStateHandlerProps) => () => {
    props.fetchInvoiceList({
      is_draft: false,
      is_v2: true,
      unpaid: true,
      member: props.membership.id,
    });
  },
  fetchConsumerPacks: (props: OwnConnectedStateHandlerProps) => (
    memberId: number,
    page: number,
    page_size: number,
  ) =>
    props.fetchConsumerPacks(
      memberId,
      page,
      page_size,
      {
        onSuccess: (cpps: any) => {
          props.fetchPaymentPackBulk(cpps.map((c: any) => c.payment_pack));
        },
      },
      { mine: true, reverted: false, current: true, disabled: false },
    ),
  detachPaymentMethod: ({
    detachPaymentMethodAction,
    fetchMemberPaymentMethod,
    snackbarErrorMsg,
    snackbarSuccessMsg,
    membership,
    t,
  }) => (pm_id, options) => {
    detachPaymentMethodAction(
      { member: membership.id, payment_method_id: pm_id },
      {
        onSuccess: () => {
          fetchMemberPaymentMethod({ member: membership.id });
          snackbarSuccessMsg(t('invoice:paymentMethod.detach.pm_deleted'));
          if (options && options.onSuccess) options.onSuccess();
        },
        onError: (data) => {
          snackbarErrorMsg(t(`invoice:paymentMethod.detach.${data}`));
        },
      },
    );
  },
};
export default compose(
  withTranslation(['consumerSpace']),
  // @ts-ignore
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  withHandlers(mapWithHandlers),
)(ConsumerDashboard);
