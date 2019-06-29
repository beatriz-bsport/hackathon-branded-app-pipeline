// @flow
import React, { Component } from 'react';

import { compose } from 'recompose';

import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';

import MarketplaceCalendar from '../../libs/marketplace/MarketplaceCalendar.component';
import MarketplaceActivityDialog from '../../libs/marketplace/MarketplaceActivityDialog.component';

import { Moment } from '../../i18n';
import { marketplace as marketplaceActions } from '../../actions';
import {
  offersSelector,
  offerBuilderSelector,
} from '../../libs/marketplace/selectors';

import {
  fetchCompanyMetaActivitiesAction,
  fetchCompanyActivitiesAction,
  fetchCompanyEstablishmentsAction,
  fetchCompanyCoachesAction,
  fetchCompanyOffersAction,
} from '../../libs/marketplace/actions';

type Props = {
  offers: Array<OfferBasic>,
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
};

export class MarketPlace extends Component<Props, State> {
  state = {
    selectedDate: Moment(),
    selectedDayOffers: [],
    offerId: null,
    offer: null,
  };

  componentWillMount() {
    //   const { fetchCalendar } = this.props;
    //   fetchCalendar(this.props.companyId);
    //   this.updateOfferList(this.state.selectedDate);
    // fetch marketplace data expcept
    const min_date = Moment()
      .startOf('month')
      .format('YYYY-MM-DD');
    const max_date = Moment()
      .endOf('month')
      .format('YYYY-MM-DD');
    this.props.fetchCompanyOffers(this.props.companyId, min_date, max_date);
    this.props.fetchCompanyActivities(this.props.companyId);
    this.props.fetchCompanyMetaActivities(this.props.companyId);
    this.props.fetchCompanyCoaches(this.props.companyId);
    this.props.fetchCompanyEstablishments(this.props.companyId);
  }

  handleDateChange = (date: Object) => {
    const offers = this.props.offers.filter((o) =>
      Moment(o.date_start).isSame(date, 'day'),
    );

    const todayOffers = offers.map((o) =>
      offerBuilderSelector(o, this.props.marketplacev2),
    );
    console.log(todayOffers);

    this.setState(() => {
      return {
        selectedDate: date,
        selectedDayOffers: todayOffers,
      };
    });
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
      calendarLoading,
      classes,
      offers,
      companyOffersLoading,
    } = this.props;
    const { selectedDayOffers, selectedDate } = this.state;

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
          dayOffersLoading={companyOffersLoading}
          onClickOffer={this.openOfferDialog}
          calendarLoading={calendarLoading}
          onSelectDate={this.handleDateChange}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    marketplacev2: state.marketplacev2,
    offers: offersSelector(state.marketplacev2),
    companyOffersLoading: state.marketplacev2.offers.loading,
    // calendarLoading: state.marketplace.loading,
    // selectedDayOffers: state.marketplace.detailedOffers,
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
