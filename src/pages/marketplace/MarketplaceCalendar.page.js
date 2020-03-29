// @flow

import React, { Component } from 'react';
import { compose, withHandlers, withProps } from 'recompose';
import { withRouter } from 'react-router';
import { push, replace as replaceRouter } from 'react-router-redux';

import withStyles from '@material-ui/core/styles/withStyles';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import memoize from 'memoize-one';

import { connect } from 'react-redux';
import {
  BUYABLE_ITEM_PASS,
  BUYABLE_ITEM_COMBO_ITEM,
} from '@bsport/common/lib/master-data/buyable-items';
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

import { snackbarSuccess } from '../../actions/snackbar.actions';

import type {
  Coach,
  Offer,
  Establishment,
  MetaActivity,
} from '../../libs/marketplace/types';

import { fetchMarketplaceOfferList as fetchOfferListAction } from '../../libs/offer/actions';
import {
  getMarketplaceOfferList,
  withMetaActivity,
  withCoach,
  withEstablishment,
} from '../../libs/offer/selectors';
import { fetchCoachBulk as fetchCoachBulkAction } from '../../libs/associated-coach/actions';
import { fetchEstablishmentBulk as fetchEstablishmentBulkAction } from '../../libs/establishment/actions';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '../../libs/meta-activity/actions';

import withTitle from '../../hocs/with-title.hoc';

import type { PaymentCombo } from '../../libs/payment-combo/types';

type Props = {
  filtersOpen: boolean,
  loading: boolean,
  hideMap: ?boolean,
  forceDayDisplayOnly: ?boolean,
  compactMode: ?boolean,
  startWeekThisWeekday: ?boolean,

  companyId: number,
  selectedDate: Object,

  offers: Array<Offer>,
  coaches: Array<Coach>,
  establishments: Array<Establishment>,
  metaActivities: Array<MetaActivity>,
  compatibleConsumerPacks: Array<ConsumerPaymentPack>,
  compatiblePaymentPacks: Array<PaymentPack>,

  filters: *,

  setFilters: (*) => void,
  toogleFiltersOpen: () => void,
  handleDateChange: (newDate: string) => void,
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
  fetchCoachBulk: (Array) => void,
  fetchOfferList: () => void,
};

type State = {
  offerId: ?number,
  offer: Object,
};

const readFiltersFromURL = memoize((search) => {
  // URL parameters starting with f_ are considered as ID filters for
  // offers, we parse ?f_levels=[1,2] to replace with { levels: [1,2] }
  try {
    const params = search.slice(1).split('&');
    const filters = params
      .map((param) => param.split('='))
      .filter((param) => param[0].includes('f_'))
      .map((param) => [param[0].split('f_')[1], JSON.parse(param[1])]);
    return filters.reduce((a, v) => ({ ...a, [v[0]]: v[1] }), {});
  } catch (err) {
    return {};
  }
});

const fromURLtoDate = (search: string) => {
  try {
    const params = search.slice(1).split('&');
    const date_string = params.find((p) => p.includes('date='));
    return Moment(date_string.split('=')[1], DATE_FORMAT).format(DATE_FORMAT);
  } catch (err) {
    return Moment().format(DATE_FORMAT);
  }
};

const fromPropsToNewDateURL = (date, location) => {
  const currentDate =
    typeof date === 'string' ? Moment(date, DATE_FORMAT) : Moment(date);
  const params = location.search.slice(1).split('&');
  const filtered_params = params.filter((p) => !p.includes('date='));
  return `${location.pathname}?${filtered_params.join(
    '&',
  )}&date=${currentDate.format(DATE_FORMAT)}`;
};

const fromPropsToURL = (filters: *, currentParams: string) => {
  // Rebuild the url parameters, keeping the old ones unrelated to filters

  // first we build our parameters based on provided filters
  const urlParamsArray = [];
  for (const filter_name in filters) {
    // eslint-disable-next-line
    if (filters.hasOwnProperty(filter_name)) {
      const filter_content = filters[filter_name];
      if (filter_content) {
        urlParamsArray.push(`f_${filter_name}=[${filter_content}]`);
      }
    }
  }

  // second we get other parameters not related to previously built params
  const otherUrlParamsArray = currentParams
    .replace('?', '')
    .split('&')
    .filter((a) => a !== '')
    .map((params) => params.split('='))
    .filter(
      (params) =>
        !urlParamsArray.map((up) => up.split('=')[0]).includes(params[0]),
    )
    .map((up) => `${up[0]}=${up[1]}`);

  // next we join everything
  let urlParams = '';
  if (urlParamsArray.length) {
    urlParams = `?${[...urlParamsArray, ...otherUrlParamsArray].join('&')}`;
  }
  return urlParams;
};

export class MarketplaceCalendar extends Component<Props, State> {
  state = {
    offerId: null,
    offer: null,
  };

  fetchData = () => {
    // always fetch began from week start
    const min_date = Moment(this.props.selectedDate, DATE_FORMAT)
      .clone()
      .startOf('week')
      .format(DATE_FORMAT);
    // the max date changes if start from today is enabled
    const max_date = Moment(this.props.selectedDate, DATE_FORMAT)
      .clone()
      .endOf('week')
      .format(DATE_FORMAT);
    // fetch offers of the week
    this.props.fetchEstablishmentBulk(this.props.filters.establishments || []);
    this.props.fetchCoachBulk(this.props.filters.coaches || []);
    this.props.fetchMetaActivityBulk(this.props.filters.metaActivities || []);
    this.props.fetchOfferList({
      company: this.props.companyId,
      min_date,
      max_date,
      filters: this.props.filters,
      is_workshop: false,
    });
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps: Props) {
    const filtersPropsChanged = !this.checkFiltersChange(
      prevProps.filters,
      this.props.filters,
    );
    if (
      filtersPropsChanged ||
      (!prevProps.selectedDate && this.props.selectedDate) ||
      Moment(prevProps.selectedDate, DATE_FORMAT)
        .clone()
        .week() !==
        Moment(this.props.selectedDate, DATE_FORMAT)
          .clone()
          .week()
    ) {
      this.fetchData();
    }
  }

  checkFiltersChange = (filters, prevFilters) => {
    if (
      (!!filters.coaches && !prevFilters.coaches) ||
      (!filters.coaches && !!prevFilters.coaches)
    ) {
      return false;
    }

    if (!!filters.coaches && !!prevFilters.coaches) {
      if (
        !(
          filters.coaches.length === prevFilters.coaches.length &&
          filters.coaches.every((value, index) => {
            return value === prevFilters.coaches.sort()[index];
          })
        )
      ) {
        return false;
      }
    }
    if (
      (!!filters.establishments && !prevFilters.establishments) ||
      (!filters.establishments && !!prevFilters.establishments)
    ) {
      return false;
    }

    if (!!filters.establishments && !!prevFilters.establishments) {
      if (
        !(
          filters.establishments.length === prevFilters.establishments.length &&
          filters.establishments.every((value, index) => {
            return value === prevFilters.establishments.sort()[index];
          })
        )
      ) {
        return false;
      }
    }
    if (
      (!!filters.metaActivities && !prevFilters.metaActivities) ||
      (!filters.metaActivities && !!prevFilters.metaActivities)
    ) {
      return false;
    }
    if (!!filters.metaActivities && !!prevFilters.metaActivities) {
      if (
        !(
          filters.metaActivities.length === prevFilters.metaActivities.length &&
          filters.metaActivities.every((value, index) => {
            return value === prevFilters.metaActivities.sort()[index];
          })
        )
      ) {
        return false;
      }
    }
    if (
      (!!filters.levels && !prevFilters.levels) ||
      (!filters.levels && !!prevFilters.levels)
    ) {
      return false;
    }
    if (!!filters.levels && !!prevFilters.levels) {
      if (
        !(
          filters.levels.length === prevFilters.levels.length &&
          filters.levels.every((value, index) => {
            return value === prevFilters.levels.sort()[index];
          })
        )
      ) {
        return false;
      }
    }
    return true;
  };

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
    try {
      (window.dataLayer || []).push({
        event: 'bsport:calendar:session-show',
        data: {
          name: offer.meta_activity.name,
          date: offer.date_start,
          coach: offer.coach_override
            ? offer.coach_override.name
            : offer.coach.name,
          establishment: offer.establishment_override
            ? offer.establishment_override.title
            : offer.establishment.name,
          activity: offer.meta_activity.id,
        },
      });
    } catch (err) {
      console.error(err);
    }
    this.props.goToBook(offer.id, this.props.companyId);
  };

  goToBookOption = (id: number) => {
    this.props.goToBookOption(id, this.props.companyId);
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
          setFilters={this.props.setFilters}
          filters={filters}
          loading={this.props.loading}
          offersLoading={this.props.loading}
          forceDayDisplayOnly={!!this.props.forceDayDisplayOnly}
          onClickOffer={this.openOfferDialog}
          onClickBook={this.goToBook}
          onClickBookOption={this.props.goToBookOption}
          onSelectDate={this.props.handleDateChange}
          selectedDate={this.props.selectedDate}
          coaches={coaches}
          establishments={establishments}
          metaActivities={this.props.metaActivities}
          filtersOpen={this.props.filtersOpen}
          toogleFiltersOpen={this.props.toogleFiltersOpen}
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
  withNamespaces(),
)(MarketplaceCalendar);

export default compose(
  withRouter,
  connect(
    null,
    { replace: replaceRouter },
  ),
  withProps(({ location }) => ({
    filters: readFiltersFromURL(location.search),
    filtersOpen: location.search.includes('filtersOpen=true'),
    forceDayDisplayOnly: location.search.includes('onlyDay=true'),
  })),
  withHandlers({
    setFilters: ({ replace, location }) => (filters) => {
      const urlParams = fromPropsToURL(filters, location.search);
      replace(location.pathname + urlParams);
    },
    toogleFiltersOpen: ({ replace, location }) => () => {
      if (location.search.includes('filtersOpen=true')) {
        replace(
          location.pathname +
            location.search
              .replace('&filtersOpen=true', '')
              .replace('filtersOpen=true', ''),
        );
      } else if (location.search === '') {
        replace(`${location.pathname}?filtersOpen=true`);
      } else {
        replace(`${location.pathname + location.search}&filtersOpen=true`);
      }
    },
  }),
  connect(
    (state) => ({
      offers: withCoach(
        withMetaActivity(withEstablishment(getMarketplaceOfferList)),
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
      fetchOfferList: fetchOfferListAction,
      fetchEstablishmentBulk: fetchEstablishmentBulkAction,
      fetchCoachBulk: fetchCoachBulkAction,
      fetchMetaActivityBulk: fetchMetaActivityBulkAction,
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
      fetchCoachBulk,
      fetchMetaActivityBulk,
    }) => (params) => {
      fetchOfferList(params, {
        onSuccess: (offerList) => {
          fetchEstablishmentBulk([
            ...offerList.map((o) => o.establishment),
            ...offerList.map((o) => o.establishment_override),
          ]);
          fetchCoachBulk([
            ...offerList.map((o) => o.coach),
            ...offerList.map((o) => o.coach_override),
          ]);
          fetchMetaActivityBulk([...offerList.map((o) => o.meta_activity)]);
        },
      });
    },
  }),
  connect(
    null,
    (dispatch) => ({
      onCompletePurchase() {
        dispatch(push('/'));
        dispatch(snackbarSuccess('booking.success'));
      },
    }),
  ),
  withHandlers({
    handleDateChange: ({ location, replace }) => (newDate_: string) => {
      const pathname = fromPropsToNewDateURL(newDate_, location);
      replace(pathname);
    },
  }),
  withProps(({ location }) => ({
    selectedDate: fromURLtoDate(location.search),
  })),
  withHandlers({
    onBookOfferFromPack: ({ onCompletePurchase }) => (offerId, packId) => {
      payWithConsumerPaymentPackAPI(packId, offerId, {})
        .then(() => {
          onCompletePurchase();
        })
        .catch((err) => {
          console.error(err);
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
  withNamespaces(),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:marketplace.marketplaceCalendar'),
  ),
)(MarketplaceCalendarStyled);
