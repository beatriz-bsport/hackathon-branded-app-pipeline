// @flow
import React, { Component } from 'react';
import { compose, withProps } from 'recompose';
import { withRouter } from 'react-router';
import { push, replace } from 'react-router-redux';

import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';

import MarketplaceCalendarComponent from '../../libs/marketplace/components/MarketplaceCalendar.component';
import MarketplaceActivityDialog from '../../libs/marketplace/components/MarketplaceActivityDialog.component';

import { Moment } from '../../i18n';
import {
  getOffersFiltered,
  isOfferLoading,
} from '../../libs/marketplace/selectors';

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
  offers: Array<Offer>,
  coaches: Array<Coach>,
  establishments: Array<Establishment>,
  metaActivities: Array<MetaActivity>,
  loading: boolean,
  filters: *,
  location: Object,
  classes: Object,
  companyId: number,
  resetOffers: () => void,
  fetchCompanyOffers: (
    companyId: number,
    min_date: string,
    max_date: string,
  ) => void,
  replace: (path: string) => void,
  goToBook: (offerId: number, comapnyId: number) => void,
  goToBookOption: (offerId: number, comapnyId: number) => void,
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
    return Moment(date_string.split('=')[1]);
  } catch (err) {
    return Moment();
  }
};

const fromPropsToNewDateURL = (date, location) => {
  const params = location.search.slice(1).split('&');
  const filtered_params = params.filter((p) => !p.includes('date='));
  const newDate = Moment(date);
  return [
    newDate,
    `${location.pathname}?${filtered_params.join('&')}&date=${newDate.format(
      'YYYY-MM-DD',
    )}`,
  ];
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
    const min_date = fromURLtoDate(this.props.location.search)
      .startOf('month')
      .format('YYYY-MM-DD');
    const max_date = fromURLtoDate(this.props.location.search)
      .endOf('month')
      .format('YYYY-MM-DD');
    this.props.fetchCompanyOffers(this.props.companyId, min_date, max_date);
  }

  handleDateChange = (date: Object) => {
    const currentDate = fromURLtoDate(this.props.location.search);
    const [newDate, pathname] = fromPropsToNewDateURL(
      date,
      this.props.location,
    );

    // the condition mean simply the month has been changed
    if (newDate.month() !== currentDate.month()) {
      const min_date = newDate.startOf('month').format('YYYY-MM-DD');
      const max_date = newDate.endOf('month').format('YYYY-MM-DD');
      this.props.fetchCompanyOffers(this.props.companyId, min_date, max_date);
    }
    this.props.replace(pathname);
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

  replaceFiltersInURL = (filters: *) => {
    const urlParams = fromPropsToURL(filters, this.props.location.search);
    this.props.replace(this.props.location.pathname + urlParams);
  };

  toogleFiltersOpen = () => {
    if (this.props.location.search.includes('filtersOpen=true')) {
      this.props.replace(
        this.props.location.pathname +
          this.props.location.search
            .replace('&filtersOpen=true', '')
            .replace('filtersOpen=true', ''),
      );
    } else if (this.props.location.search === '') {
      this.props.replace(`${this.props.location.pathname}?filtersOpen=true`);
    } else {
      this.props.replace(
        `${this.props.location.pathname +
          this.props.location.search}&filtersOpen=true`,
      );
    }
  };

  render() {
    const { classes, offers, filters, establishments, coaches } = this.props;
    const selectedDate = fromURLtoDate(this.props.location.search);

    const selectedDayOffers = offers.filter((o) =>
      Moment(o.date_start).isSame(selectedDate, 'day'),
    );

    return (
      <div className={classes.container}>
        <MarketplaceActivityDialog
          offerId={this.state.offerId}
          offer={this.state.offer}
          showBookingButton
          displayPacksInformation
          onClose={this.closeOfferDialog}
          open={!!this.state.offerId}
        />
        <MarketplaceCalendarComponent
          selectedDate={selectedDate}
          offers={offers}
          setFilters={this.replaceFiltersInURL}
          filters={filters}
          loading={this.props.loading}
          dayOffers={selectedDayOffers}
          onClickOffer={this.openOfferDialog}
          onClickBook={(id) => this.props.goToBook(id, this.props.companyId)}
          onClickBookOption={(id) =>
            this.props.goToBookOption(id, this.props.companyId)
          }
          onSelectDate={this.handleDateChange}
          coaches={coaches}
          establishments={establishments}
          metaActivities={this.props.metaActivities}
          filtersOpen={this.props.filtersOpen}
          toogleFiltersOpen={this.toogleFiltersOpen}
        />
      </div>
    );
  }
}

const styles = () => ({
  container: {
    flexGrow: 1,
    width: '100%',
  },
});

export default compose(
  withRouter,
  withProps(({ location }) => ({
    filters: readFiltersFromURL(location.search),
    filtersOpen: location.search.includes('filtersOpen=true'),
  })),
  withStyles(styles),
  withNamespaces(),
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
      replace,
    },
  ),
)(MarketplaceCalendar);
