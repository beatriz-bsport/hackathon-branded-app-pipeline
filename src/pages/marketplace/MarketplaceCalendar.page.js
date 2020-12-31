// @flow

import React, { Component } from 'react';
import { compose, withHandlers, withProps } from 'recompose';
import { withRouter } from 'react-router';
import { push, replace as replaceRouter } from 'connected-react-router';

import withStyles from '@material-ui/core/styles/withStyles';

import { withTranslation } from 'react-i18next';
import { isEqual } from 'lodash';

import { connect } from 'react-redux';

import {
  BUYABLE_ITEM_PASS,
  BUYABLE_ITEM_COMBO_ITEM,
} from '@bsport/common/lib/master-data/buyable-items';
import withQueryParams from '../../hocs/with-query-params.hoc';
import withReplaceQueryParams from '../../hocs/with-replace-query-params.hoc';
import { consumerPayWithConsumerPaymentPack as payWithConsumerPaymentPackAPI } from '../../api/payment';
import { addItemToBasket as addItemToBasketAction } from '../../libs/checkout/actions';
import * as paymentActions from '../../actions/payment.actions';
import MarketplaceCalendarComponent from '../../libs/marketplace/components/MarketplaceCalendar.component';
import MarketplaceActivityDialog from '../../libs/marketplace/components/MarketplaceActivityDialog.component';
import { getCurrentBasket } from '../../libs/checkout/selectors';
import { getPaymentComboListAvailableOnline } from '../../libs/payment-combo/selectors';

import { Moment } from '../../i18n';
import { DATE_FORMAT } from '../../datetime';
import themeSelectors from '../../libs/theme/selectors';
import { getCoaches } from '../../libs/associated-coach/selectors';
import { getMetaActivities } from '../../libs/meta-activity/selectors';

import { getAllEstablishments } from '../../libs/establishment/selectors';

import {
  snackbarSuccess,
  snackbarError as snackbarErrorActions,
} from '../../actions/snackbar.actions';

import {
  Coach,
  Offer,
  Establishment,
  MetaActivity,
} from '../../libs/marketplace/types';

import {
  fetchMarketplaceOfferList as fetchOfferListAction,
  fetchBookedGender as fetchBookedGenderAction,
} from '../../libs/offer/actions';
import {
  getMarketplaceOfferList,
  withMetaActivity,
  withCoach,
  withEstablishment,
  withGender,
} from '../../libs/offer/selectors';
import { fetchAssociatedCoachBulkFromCoachIds as fetchAssociatedCoachBulkFromCoachIdsAction } from '../../libs/associated-coach/actions';
import { fetchEstablishmentBulk as fetchEstablishmentBulkAction } from '../../libs/establishment/actions';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '../../libs/meta-activity/actions';

import withTitle from '../../hocs/with-title.hoc';

import type { PaymentCombo } from '../../libs/payment-combo/types';
import Analytics from '../../components/analytics/Analytics.component';

type Props = {
  filtersOpen: boolean,
  loading: boolean,
  hideMap: ?boolean,
  forceDayDisplayOnly: ?boolean,
  compactMode: ?boolean,
  startWeekThisWeekday: ?boolean,
  companyId: number,
  offers: Array<Offer>,
  coaches: Array<Coach>,
  establishments: Array<Establishment>,
  metaActivities: Array<MetaActivity>,
  compatibleConsumerPacks: Array<ConsumerPaymentPack>,
  compatiblePaymentPacks: Array<PaymentPack>,
  filters: *,
  setFilters: (*) => void,
  goToBook: (offer: Offer, comapnyId: number) => void,
  onBookOfferFromPack: (offerId: number, consumerPackId: number) => void,
  goToBookOption: (offerId: number, comapnyId: number) => void,
  fetchPaymentPacks: (offerId: number) => void,
  fetchCompatiblePass: (offerId: number) => void,
  goToPackPayment: (id: number) => void,
  goToPaymentComboPayment: (comboId: number, offerId: number) => void,
  paymentComboList: Array<PaymentCombo>,
  theme: Object,
  classes: Object,
  fetchEstablishmentBulk: (Array) => void,
  fetchMetaActivityBulk: (Array) => void,
  fetchAssociatedCoachBulkFromCoachIds: (
    Array<number>,
    companyId: number,
  ) => void,
  fetchOfferList: (params: any) => void,
  otherParams: {
    date: string,
    filtersOpen: boolean,
  },
  setOtherParams: (*) => void,
};

type State = {
  offerId: ?number,
  offer: Object,
};

export class MarketplaceCalendar extends Component<Props, State> {
  state = {
    offerId: null,
    offer: null,
  };

  fetchData = () => {
    const min_date = Moment(this.props.otherParams.date)
      .startOf('week')
      .format(DATE_FORMAT);

    const max_date = Moment(this.props.otherParams.date)
      .endOf('week')
      .format(DATE_FORMAT);

    this.props.fetchEstablishmentBulk(this.props.filters.establishments || []);

    this.props.fetchAssociatedCoachBulkFromCoachIds(
      this.props.filters.coaches || [],
      this.props.companyId,
    );

    const optionalParams = {};

    if (this.props.theme) {
      if (!this.props.theme.show_workshops_customer) {
        optionalParams.is_workshop = false;
      }
      if (!this.props.theme.show_cancelled_offers_customer) {
        optionalParams.available = true;
      }
    }

    this.props.fetchMetaActivityBulk(this.props.filters.activity__in || []);
    this.props.fetchOfferList({
      company: this.props.companyId,
      min_date,
      max_date,
      ...this.props.filters,
      ...optionalParams,
    });
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps: Props) {
    const filtersPropsChanged = !isEqual(prevProps.filters, this.props.filters);
    const selectedDateChanged =
      prevProps.otherParams.date !== this.props.otherParams.date;

    if (filtersPropsChanged || selectedDateChanged) {
      this.fetchData();
    }
  }

  openOfferDialog = (offerId: number) => {
    this.setState({
      offerId,
      offer: this.props.offers.find((o) => o.id === offerId),
    });
  };

  closeOfferDialog = () => {
    this.setState({ offerId: null });
  };

  goToBook = (offer: Offer) => {
    Analytics.calendarSessionShow(offer);
    this.props.goToBook(offer.id, this.props.companyId);
  };

  goToBookOption = (id: number) => {
    this.props.goToBookOption(id, this.props.companyId);
  };

  handleDateChange = (d) => {
    this.props.setOtherParams('date')(Moment(d).format('YYYY-MM-DD'));
  };

  toogleFiltersOpen = () => {
    this.props.setOtherParams('filtersOpen')(
      this.props.otherParams.filtersOpen === 'true' ? '' : 'true',
    );
  };

  render() {
    const {
      classes,
      offers,
      filters,
      establishments,
      coaches,
      startWeekThisWeekday,
    } = this.props;
    return (
      <div className={classes.container}>
        <MarketplaceActivityDialog
          offerId={this.state.offerId}
          offer={this.state.offer}
          showBookingButton
          displayPacksInformation
          onClose={this.closeOfferDialog}
          open={!!this.state.offerId}
          compatibleConsumerPacks={this.props.compatibleConsumerPacks}
          compatiblePaymentPacks={this.props.compatiblePaymentPacks}
          fetchPassData={() => {
            this.props.fetchPaymentPacks(this.state.offerId);
            this.props.fetchCompatiblePass(this.state.offerId);
          }}
          goToPackPayment={this.props.goToPackPayment}
          goToPaymentComboPayment={this.props.goToPaymentComboPayment}
          paymentComboList={this.props.paymentComboList}
          goToOfferPayment={this.goToBook}
          onBookFromPack={(packId) =>
            this.props.onBookOfferFromPack(this.state.offerId, packId)
          }
          hideMap={!!this.props.hideMap}
        />
        <MarketplaceCalendarComponent
          offers={offers}
          showOfferFilling={this.props.theme.show_offers_filling}
          showOfferGender={this.props.theme.show_booked_gender_offer}
          setFilters={this.props.setFilters}
          filters={filters}
          loading={this.props.loading}
          offersLoading={this.props.loading}
          forceDayDisplayOnly={!!this.props.forceDayDisplayOnly}
          onClickOffer={this.openOfferDialog}
          onClickBook={this.goToBook}
          onClickBookOption={this.props.goToBookOption}
          onSelectDate={this.handleDateChange}
          selectedDate={this.props.otherParams.date}
          coaches={coaches}
          establishments={establishments}
          metaActivities={this.props.metaActivities}
          filtersOpen={this.props.otherParams.filtersOpen === 'true'}
          toogleFiltersOpen={this.toogleFiltersOpen}
          compactMode={this.props.compactMode}
          startWeekThisWeekday={startWeekThisWeekday}
        />
      </div>
    );
  }
}

const styles = () => ({
  container: {
    width: '100%',
  },
});

export const MarketplaceCalendarStyled = compose(
  withStyles(styles),
  withTranslation(),
)(MarketplaceCalendar);

export default compose(
  withRouter,
  connect(null, { replace: replaceRouter }),
  withReplaceQueryParams(
    ['f_coaches', 'f_metaActivities', 'f_levels', 'f_establishments'],
    ['coaches', 'activity__in', 'levels', 'establishments'],
  ),
  withQueryParams([
    ['coaches', 'establishments', 'activity__in', 'levels'],
    'filters',
    'setFilters',
    'arrayNumber',
  ]),
  withQueryParams([['filtersOpen', 'date'], 'otherParams', 'setOtherParams']),
  withProps(({ location }) => ({
    forceDayDisplayOnly: location.search.includes('onlyDay=true'),
  })),
  connect(
    (state) => ({
      offers: withCoach(
        withMetaActivity(
          withEstablishment(withGender(getMarketplaceOfferList)),
        ),
      )(state),
      loading: state.offer.marketplace.loading,
      coachLoading: state.coach.loading,
      establishmentLoading: state.establishment.bulkRetrieve.loading,
      activityLoading: state.metaActivity.loading,
      coaches: getCoaches(state),
      establishments: getAllEstablishments(state),
      metaActivities: getMetaActivities(state),
      theme: themeSelectors.getTheme(state),
    }),
    {
      snackbarError: snackbarErrorActions,
      fetchOfferList: fetchOfferListAction,
      fetchEstablishmentBulk: fetchEstablishmentBulkAction,
      fetchAssociatedCoachBulkFromCoachIds: fetchAssociatedCoachBulkFromCoachIdsAction,
      fetchMetaActivityBulk: fetchMetaActivityBulkAction,
      fetchBookedGender: fetchBookedGenderAction,
      goToBook: (id: number, companyId: number) =>
        push(`/customer/payment/offer/${id}?membership=${companyId}`),
      goToBookOption: (id: number, companyId: number) =>
        push(`/customer/payment/offer/${id}?membership=${companyId}`),
    },
  ),
  withHandlers({
    fetchOfferList: ({
      fetchOfferList,
      fetchEstablishmentBulk,
      fetchMetaActivityBulk,
      fetchAssociatedCoachBulkFromCoachIds,
      fetchBookedGender,
      companyId,
      theme,
    }) => (params) => {
      fetchOfferList(params, {
        onSuccess: (offerList) => {
          fetchEstablishmentBulk([
            ...offerList.map((o) => o.establishment),
            ...offerList.map((o) => o.establishment_override),
          ]);
          fetchAssociatedCoachBulkFromCoachIds(
            [
              ...offerList.map((o) => o.coach),
              ...offerList.map((o) => o.coach_override),
            ],
            companyId,
          );

          fetchMetaActivityBulk([...offerList.map((o) => o.meta_activity)]);
        },
      });
      if (theme && theme.show_booked_gender_offer) {
        fetchBookedGender(params);
      }
    },
  }),
  connect(null, (dispatch) => ({
    onCompletePurchase() {
      dispatch(push('/'));
      dispatch(snackbarSuccess('booking.register.success'));
    },
  })),
  withTranslation(['booking', 'titles']),
  withHandlers({
    onBookOfferFromPack: ({ onCompletePurchase, t, snackbarError }) => (
      offerId,
      packId,
    ) => {
      payWithConsumerPaymentPackAPI(packId, offerId, {})
        .then(() => {
          onCompletePurchase();
        })
        .catch((err) => {
          console.error(err);
          if (err && err.response && err.response.status === 423) {
            switch (err.response.data) {
              case 'unavailable for female':
                snackbarError(
                  t('booking:bookingModule.messages.femaleUnavailable'),
                );
                break;
              case 'unavailable for male':
                snackbarError(
                  t('booking:bookingModule.messages.maleUnavailable'),
                );
                break;
              default:
                snackbarError(t('booking:bookingModule.messages.offerLocked'));
                break;
            }
          }
        });
    },
  }),
  // for MarketplaceActivityDialog
  connect(
    (state) => ({
      compatibleConsumerPacks: state.payment.compatibleConsumerPacks || [],
      compatiblePaymentPacks: state.payment.compatiblePaymentPacks || [],
      paymentComboList: getPaymentComboListAvailableOnline(state),
      currentBasket: getCurrentBasket(state),
    }),
    {
      fetchPaymentPacks: paymentActions.fetchCompatiblePaymentPacks,
      fetchCompatiblePass: paymentActions.fetchCompatiblePass,
      addItemToBasket: addItemToBasketAction,
    },
  ),
  withHandlers({
    goToPackPayment: ({
      authenticated,
      requestSignUp,
      toogleCurrentBasketOpen,
      currentBasket,
      addItemToBasket,
    }) => (packId, offerId) => {
      if (!authenticated) {
        requestSignUp();
      } else {
        addItemToBasket(currentBasket.id, {
          buyable_item_identifier: BUYABLE_ITEM_PASS,
          quantity: 1,
          buyable_item_id: packId,
          extra_data: { offer_next: offerId },
        });
        toogleCurrentBasketOpen(true);
      }
    },
    goToPaymentComboPayment: ({
      authenticated,
      requestSignUp,
      toogleCurrentBasketOpen,
      currentBasket,
      addItemToBasket,
    }) => (comboId, offerId) => {
      if (!authenticated) {
        requestSignUp();
      } else {
        addItemToBasket(currentBasket.id, {
          buyable_item_identifier: BUYABLE_ITEM_COMBO_ITEM,
          quantity: 1,
          buyable_item_id: comboId,
          extra_data: { offer_next: offerId },
        });
        toogleCurrentBasketOpen(true);
      }
    },
  }),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:marketplace.marketplaceCalendar'),
  ),
)(MarketplaceCalendarStyled);
