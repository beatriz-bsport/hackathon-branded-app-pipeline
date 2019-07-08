// @flow
import React, { Component } from 'react';
import { compose, withProps } from 'recompose';
import { withRouter } from 'react-router';
import { replace } from 'react-router-redux';

import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';

import MarketplaceCalendarComponent from '../../libs/marketplace/MarketplaceCalendar.component';
import MarketplaceActivityDialog from '../../libs/marketplace/MarketplaceActivityDialog.component';

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
  fetchCompanyMetaActivitiesAction,
  fetchCompanyActivitiesAction,
  fetchCompanyEstablishmentsAction,
  fetchCompanyCoachesAction,
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
  fetchCompanyOffers: (
    companyId: number,
    min_date: string,
    max_date: string,
  ) => void,
  fetchCompanyActivities: (companyId: number) => void,
  fetchCompanyMetaActivities: (companyId: number) => void,
  fetchCompanyEstablishments: (companyId: number) => void,
  fetchCompanyCoaches: (companyId: number) => void,
  replace: (path: string) => void,
};

type State = {
  selectedDate: Object,
  offerId: ?number,
  offer: Object,
  month: string,
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
    selectedDate: Moment(),
    offerId: null,
    offer: null,
    month: '',
  };

  componentWillMount() {
    // fetch marketplace data expcept
    const min_date = Moment()
      .startOf('month')
      .format('YYYY-MM-DD');
    const max_date = Moment()
      .endOf('month')
      .format('YYYY-MM-DD');
    this.props.fetchCompanyActivities(this.props.companyId);
    this.props.fetchCompanyMetaActivities(this.props.companyId);
    this.props.fetchCompanyCoaches(this.props.companyId);
    this.props.fetchCompanyEstablishments(this.props.companyId);
    this.props.fetchCompanyOffers(this.props.companyId, min_date, max_date);
  }

  handleDateChange = (date: Object) => {
    // the condition mean simply the month has been changed
    if (this.state.month && this.state.month !== date.get('month')) {
      const min_date = date.startOf('month').format('YYYY-MM-DD');
      const max_date = date.endOf('month').format('YYYY-MM-DD');
      this.props.fetchCompanyOffers(this.props.companyId, min_date, max_date);
    }
    this.setState((prevState) => ({
      month: prevState.selectedDate.get('month'),
      selectedDate: date,
    }));
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
    const { selectedDate } = this.state;

    const selectedDayOffers = offers.filter((o) =>
      Moment(o.date_start).isSame(this.state.selectedDate, 'day'),
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
      offers: getOffersFiltered(state.marketplacev2, filters),
      loading: isOfferLoading(state.marketplacev2),
      coaches: state.marketplacev2.coaches.items,
      establishments: state.marketplacev2.establishments.items,
      metaActivities: state.marketplacev2.metaActivities.items,
    }),
    {
      fetchCompanyMetaActivities: fetchCompanyMetaActivitiesAction,
      fetchCompanyActivities: fetchCompanyActivitiesAction,
      fetchCompanyEstablishments: fetchCompanyEstablishmentsAction,
      fetchCompanyCoaches: fetchCompanyCoachesAction,
      fetchCompanyOffers: fetchCompanyOffersAction,
      replace,
    },
  ),
)(MarketplaceCalendar);
