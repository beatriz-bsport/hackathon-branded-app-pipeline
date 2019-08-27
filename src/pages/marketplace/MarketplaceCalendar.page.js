// @flow
import React, { Component } from 'react';
import { compose, withProps } from 'recompose';
import { withRouter } from 'react-router';
import { push, replace as replaceRouter } from 'react-router-redux';

import withStyles from '@material-ui/core/styles/withStyles';

import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';
import * as paymentActions from '../../actions/payment.actions';
import MarketplaceCalendarComponent from '../../libs/marketplace/components/MarketplaceCalendar.component';
import MarketplaceActivityDialog from '../../libs/marketplace/components/MarketplaceActivityDialog.component';

import { Moment } from '../../i18n';
import {
  getOffersFiltered,
  isOfferLoading,
} from '../../libs/marketplace/selectors';
import { snackbarSuccess } from '../../actions/snackbar.actions';

import type {
  Coach,
  Offer,
  Establishment,
  MetaActivity,
} from '../../libs/marketplace/types';

import {
  resetOffersAction,
  fetchCompanyOffersAction,
} from '../../libs/marketplace/actions';

type Props = {
  filtersOpen: boolean,
  loading: boolean,
  hideMap: ?boolean,
  forceDayDisplayOnly: ?boolean,

  companyId: number,
  selectedDate: Object,

  offers: Array<Offer>,
  coaches: Array<Coach>,
  establishments: Array<Establishment>,
  metaActivities: Array<MetaActivity>,
  compatibleConsumerPacks: Array<ConsumerPaymentPack>,
  compatiblePaymentPacks: Array<PaymentPack>,

  filters: *,

  resetOffers: () => void,
  setFilters: (*) => void,
  toogleFiltersOpen: () => void,
  handleDateChange: (newDate: Object) => void,
  goToBook: (offerId: number, comapnyId: number) => void,
  goToBookOption: (offerId: number, comapnyId: number) => void,
  fetchPaymentPacks: (offerId: number) => void,
  fetchCompatiblePass: (offerId: number) => void,
  goToPackPayment: (id: number) => void,
  onCompletePurchase: () => void,
  fetchCompanyOffers: (*, *, *) => void,

  classes: Object,
};

type State = {
  offerId: ?number,
  offer: Object,
};

const readFiltersFromURL = (search) => {
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
};

const fromURLtoDate = (search: string) => {
  try {
    const params = search.slice(1).split('&');
    const date_string = params.find((p) => p.includes('date='));
    return Moment(date_string.split('=')[1], 'YYYY-MM-DD');
  } catch (err) {
    return Moment();
  }
};

const fromPropsToNewDateURL = (date, location) => {
  const params = location.search.slice(1).split('&');
  const filtered_params = params.filter((p) => !p.includes('date='));
  const newDate = Moment(date);
  return `${location.pathname}?${filtered_params.join(
    '&',
  )}&date=${newDate.format('YYYY-MM-DD')}`;
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

  componentWillMount() {
    this.props.resetOffers();
  }

  componentDidMount() {
    const min_date = this.props.selectedDate
      .clone()
      .startOf('week')
      .format('YYYY-MM-DD');
    const max_date = this.props.selectedDate
      .clone()
      .endOf('week')
      .format('YYYY-MM-DD');
    this.props.fetchCompanyOffers(this.props.companyId, min_date, max_date);
  }

  componentDidUpdate(prevProps: Props) {
    if (
      (!prevProps.selectedDate && this.props.selectedDate) ||
      Moment(
        prevProps.selectedDate.format('YYYY-MM-DD'),
        'YYYY-MM-DD',
      ).week() !==
        Moment(
          this.props.selectedDate.format('YYYY-MM-DD'),
          'YYYY-MM-DD',
        ).week()
    ) {
      const min_date = this.props.selectedDate
        .clone()
        .startOf('week')
        .format('YYYY-MM-DD');
      const max_date = this.props.selectedDate
        .clone()
        .endOf('week')
        .format('YYYY-MM-DD');
      this.props.fetchCompanyOffers(this.props.companyId, min_date, max_date);
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

  getWeekOffers = () => {
    const date_start = this.props.selectedDate
      .clone()
      .startOf('week')
      .format('YYYY-MM-DD');
    // structure offers par week days
    return [0, 1, 2, 3, 4, 5, 6].map((i) => {
      const _date = Moment(date_start, 'YYYY-MM-DD')
        .add(i, 'days')
        .format('YYYY-MM-DD');
      return this.props.offers.filter((o) =>
        Moment(o.date_start).isSame(Moment(_date), 'day'),
      );
    });
  };

  render() {
    const { classes, offers, filters, establishments, coaches } = this.props;

    const selectedDayOffers = offers.filter((o) =>
      Moment(o.date_start).isSame(this.props.selectedDate, 'day'),
    );
    const weekOffers = this.getWeekOffers();

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
          goToOfferPayment={(id) =>
            this.props.goToBook(id, this.props.companyId)
          }
          onCompletePurchase={this.props.onCompletePurchase}
          hideMap={!!this.props.hideMap}
        />
        <MarketplaceCalendarComponent
          offers={offers}
          setFilters={this.props.setFilters}
          filters={filters}
          loading={this.props.loading}
          dayOffers={selectedDayOffers}
          forceDayDisplayOnly={!!this.props.forceDayDisplayOnly}
          weekOffers={weekOffers}
          onClickOffer={this.openOfferDialog}
          onClickBook={(id) => this.props.goToBook(id, this.props.companyId)}
          onClickBookOption={(id) =>
            this.props.goToBookOption(id, this.props.companyId)
          }
          onSelectDate={(newDate) =>
            this.props.handleDateChange(newDate.clone())
          }
          selectedDate={this.props.selectedDate || Moment()}
          coaches={coaches}
          establishments={establishments}
          metaActivities={this.props.metaActivities}
          filtersOpen={this.props.filtersOpen}
          toogleFiltersOpen={this.props.toogleFiltersOpen}
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
  withProps(({ location, replace }) => ({
    filters: readFiltersFromURL(location.search),
    filtersOpen: location.search.includes('filtersOpen=true'),
    setFilters: (filters) => {
      const urlParams = fromPropsToURL(filters, location.search);
      replace(location.pathname + urlParams);
    },
    toogleFiltersOpen: () => {
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
    forceDayDisplayOnly: location.search.includes('onlyDay=true'),
  })),
  connect(
    (state, { filters }) => ({
      offers: getOffersFiltered(state, filters),
      loading: isOfferLoading(state),
      coaches: state.marketplacev2.coaches.items,
      establishments: state.marketplacev2.establishments.items,
      metaActivities: state.marketplacev2.metaActivities.items,
    }),
    {
      resetOffers: resetOffersAction,
      fetchCompanyOffers: fetchCompanyOffersAction,
      goToBook: (id: number, companyId: number) =>
        push(`/customer/payment/offer/${id}?membership=${companyId}`),
      goToBookOption: (id: number, companyId: number) =>
        push(`/customer/payment/offer/${id}?membership=${companyId}`),
    },
  ),
  connect(
    null,
    (dispatch) => ({
      onCompletePurchase() {
        dispatch(push('/'));
        dispatch(snackbarSuccess('booking.success'));
      },
    }),
  ),
  withProps(({ replace, location }) => ({
    handleDateChange: (newDate_: Object) => {
      const pathname = fromPropsToNewDateURL(newDate_, location);
      replace(pathname);
    },
  })),
  withProps(({ location }) => ({
    selectedDate: fromURLtoDate(location.search),
  })),
  // for MarketplaceActivityDialog
  connect(
    (state) => ({
      compatibleConsumerPacks: state.payment.compatibleConsumerPacks || [],
      compatiblePaymentPacks: state.payment.compatiblePaymentPacks || [],
    }),
    {
      fetchPaymentPacks: paymentActions.fetchCompatiblePaymentPacks,
      fetchCompatiblePass: paymentActions.fetchCompatiblePass,
      goToPackPayment: (packId, offerId, companyId) =>
        push(
          `/customer/payment/pass/${packId}?nextOffer=${offerId}&membership=${companyId}`,
        ),
    },
  ),
)(MarketplaceCalendarStyled);
