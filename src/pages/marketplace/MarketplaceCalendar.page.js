// @flow
import React, { Component } from 'react';
import _ from 'lodash';
import { compose } from 'recompose';

import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';

import MarketplaceCalendar from '../../libs/marketplace/MarketplaceCalendar.component';
import MarketplaceActivityDialog from '../../libs/marketplace/MarketplaceActivityDialog.component';

import { Moment } from '../../i18n';
import { marketplace as marketplaceActions } from '../../actions';
import { offerBuilderSelector } from '../../libs/marketplace/selectors';

import type { Coach, Establishment } from '../../libs/marketplace/types';

import {
  fetchCompanyMetaActivitiesAction,
  fetchCompanyActivitiesAction,
  fetchCompanyEstablishmentsAction,
  fetchCompanyCoachesAction,
  fetchCompanyOffersAction,
} from '../../libs/marketplace/actions';

type Props = {
  offers: Array<OfferBasic>,
  coaches: Array<Coach>,
  establishments: Array<Establishment>,
  selectedDayOffers: ?Array<OfferMarketplace>,
  companyOffersLoading: boolean,
  calendarLoading: boolean,
  fetchCalendar: (companyId: number) => void,
  fetchOffersByDay: ({ companyId: number, date: Object }) => void,
  classes: Object,
  companyId: number,
  marketplacev2: Object,
  fetchCompany: (companyId: number) => void,
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
  selectedDayOffers: Array<OfferMarketplace>,
  month: string,
};

export class MarketPlace extends Component<Props, State> {
  state = {
    selectedDate: Moment(),
    selectedDayOffers: [],
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
    const selectedDayOffers = this.props.offers.filter((o) =>
      Moment(o.date_start).isSame(date, 'day'),
    );
    this.setState(() => {
      return {
        month: this.state.selectedDate.get('month'),
        selectedDate: date,
        selectedDayOffers,
      };
    });

    // the condition mean simply the month has been changed
    if (this.state.month && this.state.month !== date.get('month')) {
      const min_date = date.startOf('month').format('YYYY-MM-DD');
      const max_date = date.endOf('month').format('YYYY-MM-DD');
      this.props.fetchCompanyOffers(this.props.companyId, min_date, max_date);
    }
  };

  openOfferDialog = (offerId: number) => {
    this.setState({
      offerId,
      offer: this.state.selectedDayOffers.find((o) => o.id === offerId),
    });
  };

  closeOfferDialog = () => {
    this.setState({ offerId: null });
  };

  render() {
    const {
      classes,
      offers,
      companyOffersLoading,
      establishments,
      coaches,
    } = this.props;
    const { selectedDate, selectedDayOffers } = this.state;

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
        <MarketplaceCalendar
          selectedDate={selectedDate}
          offers={offers}
          dayOffers={selectedDayOffers}
          onClickOffer={this.openOfferDialog}
          dayOffersLoading={companyOffersLoading}
          onSelectDate={this.handleDateChange}
          coaches={coaches}
          establishments={establishments}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    marketplacev2: state.marketplacev2,
    offers: offerBuilderSelector(state.marketplacev2),
    coaches: state.marketplacev2.coaches.items,
    establishments: state.marketplacev2.establishments.items,
    companyOffersLoading: state.marketplacev2.offers.loading,
  };
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
    mapStateToProps,
    {
      fetchCompany: marketplaceActions.fetchCompany,
      fetchCompanyMetaActivities: fetchCompanyMetaActivitiesAction,
      fetchCompanyActivities: fetchCompanyActivitiesAction,
      fetchCompanyEstablishments: fetchCompanyEstablishmentsAction,
      fetchCompanyCoaches: fetchCompanyCoachesAction,
      fetchCompanyOffers: fetchCompanyOffersAction,
    },
  ),
)(MarketPlace);
