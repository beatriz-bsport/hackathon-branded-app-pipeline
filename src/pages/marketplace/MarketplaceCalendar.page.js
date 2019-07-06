// @flow
import React, { Component } from 'react';
import { compose } from 'recompose';

import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';

import MarketplaceCalendarComponent from '../../libs/marketplace/MarketplaceCalendar.component';
import MarketplaceActivityDialog from '../../libs/marketplace/MarketplaceActivityDialog.component';

import { Moment } from '../../i18n';
import { getOffers, isOfferLoading } from '../../libs/marketplace/selectors';

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
  offers: Array<Offer>,
  coaches: Array<Coach>,
  establishments: Array<Establishment>,
  metaActivities: Array<MetaActivity>,
  loading: boolean,
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
};

type State = {
  selectedDate: Object,
  offerId: ?number,
  offer: Object,
  month: string,
};

export class MarketplaceCalendar extends Component<Props, State> {
  state = {
    selectedDate: Moment(),
    offerId: null,
    offer: null,
    month: '',
    filters: {},
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

  render() {
    const { classes, offers, establishments, coaches } = this.props;
    const { selectedDate, filters } = this.state;

    let offersFiltered = offers;
    if ((filters.establishments || []).length) {
      offersFiltered = offersFiltered.filter((o) =>
        filters.establishments
          .map((eee) => eee.value)
          .includes(o.activity.establishment.id),
      );
    }
    if ((filters.coaches || []).length) {
      offersFiltered = offersFiltered.filter((o) =>
        filters.coaches.map((eee) => eee.value).includes(o.activity.coach.id),
      );
    }
    if ((filters.levels || []).length) {
      offersFiltered = offersFiltered.filter((o) =>
        filters.levels.map((eee) => eee.value).includes(o.activity.level),
      );
    }
    if ((filters.metaActivities || []).length) {
      offersFiltered = offersFiltered.filter((o) =>
        filters.metaActivities
          .map((eee) => eee.value)
          .includes(o.activity.meta_activity.id),
      );
    }

    const selectedDayOffers = offersFiltered.filter((o) =>
      Moment(o.date_start).isSame(this.state.selectedDate, 'day'),
    );

    return (
      <div className={classes.container}>
        {this.state.offerId ? (
          <MarketplaceActivityDialog
            offerId={this.state.offerId}
            offer={this.state.offer}
            showBookingButton
            displayPacksInformation
            onClose={this.closeOfferDialog}
            open
          />
        ) : null}
        <MarketplaceCalendarComponent
          selectedDate={selectedDate}
          offers={offersFiltered}
          setFilters={(f) => this.setState({ filters: f })}
          filters={this.state.filters}
          loading={this.props.loading}
          dayOffers={selectedDayOffers}
          onClickOffer={this.openOfferDialog}
          onSelectDate={this.handleDateChange}
          coaches={coaches}
          establishments={establishments}
          metaActivities={this.props.metaActivities}
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
  withStyles(styles),
  withNamespaces(),
  connect(
    (state) => ({
      offers: getOffers(state.marketplacev2),
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
    },
  ),
)(MarketplaceCalendar);
