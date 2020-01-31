// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import moment from 'moment';
import { compose, withState, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { push as pushRouter } from 'react-router-redux';
import TodayIcon from '@material-ui/icons/Today';

import BookingCancellationDialog from './BookingCancellationDialog.component';
import BookingOptionCancelDialog from './BookingOptionCancelDialog.component';
import ConsumerDashboardBookingPanel from './ConsumerDashboardBookingPanel.component';
import ConsumerDashboardHeader from './ConsumerDashboardHeader.component';
import ConsumerDashboardPassPanel from './ConsumerDashboardPassPanel.component';
import ConsumerDashboardBookingOptionPanel from './ConsumerDashboardBookingOptionPanel.component';

import { getFavoriteEstablishment } from '../../libs/establishment/selectors';
import { getFavoriteMetaActivity } from '../../libs/meta-activity/selectors';

// import StatCard from './StatCard.component';
import { buildUrlParams } from '../../http';
import { getPrivateConsumerPassList } from '../../libs/private-service/selectors/private-consumer-pass';

import { getConsumerPacksByMemberWithPaymentPack } from '../../libs/consumer-payment-pack/selectors';
import {
  fetchConsumerDashboardBookingList as fetchConsumerDashboardBookingListAction,
  cancelBooking as cancelBookingAction,
} from '../../libs/booking/actions';
import { fetchOfferBulk as fetchOfferBulkAction } from '../../libs/offer/actions';
import {
  fetchEstablishmentFavorite,
  fetchEstablishmentBulk as fetchEstablishmentBulkAction,
} from '../../libs/establishment/actions';
import { fetchCoachBulk as fetchCoachBulkAction } from '../../libs/associated-coach/actions';
import {
  fetchMetaActivityFavorite,
  fetchMetaActivityBulk as fetchMetaActivityBulkAction,
} from '../../libs/meta-activity/actions/common';
import {
  getConsumerDasboardBookingList,
  withOfferFull,
} from '../../libs/booking/selectors';
import { getBookingOptionConsumerList } from '../../libs/waiting-list/selectors';
import {
  fetchBookingOptionAsConsumer,
  discardBookingOption as cancelBookingOptionAction,
} from '../../libs/waiting-list/actions';
import { getPrivateBookingListBase } from '../../libs/private-service/selectors/private-booking';

import {
  fetchPrivateBookings,
  fetchPrivateConsumerPassList,
} from '../../libs/private-service/actions';
import { fetchPaymentPackBulk as fetchPaymentPackBulkAction } from '../../libs/payment-packs/actions';
import { fetchByMember as fetchConsumerPackByMemberAction } from '../../libs/consumer-payment-pack/actions';

type Props = {
  t: TFunction,
  classes: Object,
  fetchConsumerDashboardBookingList: (page: ?number) => void,
  bookingList: Array<Booking>,
  bookingLoading: boolean,
  bookingCount: number,

  membership: Membership,

  fetchPrivateConsumerPassList: () => void,
  privateConsumerPassList: Array<PrivateConsumerPass>,
  privateConsumerPassLoading: boolean,

  fetchPrivateBookings: (params: any) => void,
  privateBookingList: Array<PrivateBooking>,
  fetchConsumerPacks: (member: number, page: number, page_size: number) => void,
  consumerPackLoading: boolean,
  consumerPackList: Array<ConsumerPaymentPack>,

  favoriteMetaActivity: ?MetaActivity,
  fetchMetaActivityFavorite: (company: number) => void,

  favoriteEstablishment: ?Establishment,
  fetchEstablishmentFavorite: (company: number) => void,

  goToCalendar: (params: any) => void,
  push: (path: string) => void,

  bookingToCancel: ?Booking,
  setBookingToCancel: (?Booking) => void,
  cancelBooking: (number) => void,

  bookingOptionList: Array<BookingOption>,
  fetchBookingOptionAsConsumer: (company: number) => void,
  confirmBookingOption: (offerId: number, optionId: number) => void,
  cancelBookingOption: () => void,
  setOptionToCancel: (id: number) => void,
  optionToCancel: ?number,
};

const BOOKING_PAGE_SIZE = 5;

export class ConsumerDashboard extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchConsumerDashboardBookingList(1);
    this.props.fetchPrivateBookings({
      member: this.props.membership.id,
      date_start__gte: moment().format('YYYY-MM-DD'),
    });

    this.props.fetchPrivateConsumerPassList();
    this.props.fetchConsumerPacks(this.props.membership.id, 1, 300);

    this.props.fetchEstablishmentFavorite(this.props.membership.company);
    this.props.fetchMetaActivityFavorite(this.props.membership.company);

    this.props.fetchBookingOptionAsConsumer(this.props.membership.company);
  }

  render() {
    return (
      <div className={this.props.classes.container}>
        <div className={this.props.classes.header}>
          <Button
            onClick={() => this.props.goToCalendar()}
            color="primary"
            variant="contained"
          >
            <TodayIcon className={this.props.classes.iconLeft} />
            {this.props.t('actions.goToCalendar')}
          </Button>
        </div>
        <ConsumerDashboardHeader
          favoriteMetaActivity={this.props.favoriteMetaActivity}
          favoriteEstablishment={this.props.favoriteEstablishment}
          goToCalendar={this.props.goToCalendar}
        />
        <Grid container direction="row" spacing={16}>
          <Grid item xs={12} md={6}>
            <ConsumerDashboardBookingPanel
              goToCalendar={this.props.goToCalendar}
              bookingList={this.props.bookingList}
              bookingCount={this.props.bookingCount}
              bookingLoading={this.props.bookingLoading}
              showMoreBooking={this.props.fetchConsumerDashboardBookingList}
              push={this.props.push}
              membership={this.props.membership}
              privateBookingList={this.props.privateBookingList}
              onDiscardBooking={this.props.setBookingToCancel}
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
          onSubmit={() =>
            this.props.cancelBooking(this.props.bookingToCancel.id)
          }
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {},
  header: {
    display: 'flex',
    padding: theme.spacing.unit,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  iconLeft: {
    marginRight: theme.spacing.unit,
  },
  statRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: theme.spacing.unit * 3,
  },
});

export default compose(
  withNamespaces(['consumerSpace']),
  withStyles(styles),
  connect(
    (state, { membership }) => ({
      bookingList: withOfferFull(getConsumerDasboardBookingList)(state),
      bookingCount: state.booking.consumerDashboard.count,
      bookingLoading: state.booking.consumerDashboard.loading,

      bookingOptionList: getBookingOptionConsumerList(state),

      privateConsumerPassList: getPrivateConsumerPassList(state),
      privateBookingList: getPrivateBookingListBase(state),
      privateConsumerPassLoading:
        state.privateService.privateConsumerPass.loading,
      consumerPackLoading: state.consumerPaymentPack.byMember.loading,

      consumerPackList: getConsumerPacksByMemberWithPaymentPack(
        state,
        membership.member,
      ),
      favoriteMetaActivity: getFavoriteMetaActivity(state),
      favoriteEstablishment: getFavoriteEstablishment(state),
    }),
    {
      push: pushRouter,
      cancelBooking: cancelBookingAction,
      fetchPrivateBookings,
      fetchConsumerDashboardBookingList: fetchConsumerDashboardBookingListAction,
      fetchOfferBulk: fetchOfferBulkAction,
      fetchMetaActivityBulk: fetchMetaActivityBulkAction,
      fetchCoachBulk: fetchCoachBulkAction,
      fetchEstablishmentBulk: fetchEstablishmentBulkAction,
      fetchPaymentPackBulk: fetchPaymentPackBulkAction,
      fetchConsumerPacks: (
        memberId: number,
        page: number,
        page_size: number,
        params: any,
        options: OptionCallback,
      ) =>
        fetchConsumerPackByMemberAction(
          memberId,
          page,
          page_size,
          params,
          options,
        ),
      fetchBookingOptionAsConsumer,
      fetchPrivateConsumerPassList,
      fetchMetaActivityFavorite,
      fetchEstablishmentFavorite,

      cancelBookingOption: cancelBookingOptionAction,
    },
  ),
  withState('optionToCancel', 'setOptionToCancel', null),
  withHandlers({
    cancelBookingOption: ({
      cancelBookingOption,
      optionToCancel,
      setOptionToCancel,
    }) => () => {
      cancelBookingOption(optionToCancel, {
        onSuccess: () => setOptionToCancel(null),
      });
    },
    confirmBookingOption: ({ push }) => (offerId, optionId) => {
      push(`/payment/offer/${offerId}?option_id=${optionId}`);
    },
  }),

  withState('bookingToCancel', 'setBookingToCancel', null),
  withHandlers({
    cancelBooking: ({ cancelBooking, setBookingToCancel }) => (id, data) => {
      cancelBooking(id, data, { onSuccess: () => setBookingToCancel(null) });
    },
    goToCalendar: ({ membership, push }) => (params) =>
      push(
        `/m/${membership.company_name}/${
          membership.company
        }/calendar/${buildUrlParams({ ...params, filtersOpen: true })}`,
      ),
  }),
  withHandlers({
    fetchConsumerDashboardBookingList: ({
      fetchOfferBulk,
      fetchEstablishmentBulk,
      fetchCoachBulk,
      fetchMetaActivityBulk,
      fetchConsumerDashboardBookingList,
      membership,
    }) => (page?: number) =>
      fetchConsumerDashboardBookingList(
        membership.id,
        page,
        BOOKING_PAGE_SIZE,
        {
          onSuccess: (bookingList) => {
            fetchOfferBulk(bookingList.map((b) => b.offer), {
              onSuccess: (offerList) => {
                fetchMetaActivityBulk(offerList.map((b) => b.meta_activity));
                fetchCoachBulk([
                  ...offerList.map((b) => b.coach),
                  ...offerList.map((b) => b.coach_override),
                ]);
                fetchEstablishmentBulk([
                  ...offerList.map((b) => b.establishment),
                  ...offerList.map((b) => b.establishment_override),
                ]);
              },
            });
          },
        },
      ),
  }),
  withHandlers({
    fetchConsumerPacks: ({ fetchPaymentPackBulk, fetchConsumerPacks }) => (
      ...args
    ) =>
      fetchConsumerPacks(
        ...args,
        { mine: true, reverted: false, current: true },
        {
          onSuccess: (cpps) => {
            fetchPaymentPackBulk(cpps.map((c) => c.payment_pack));
          },
        },
      ),
  }),
)(ConsumerDashboard);
