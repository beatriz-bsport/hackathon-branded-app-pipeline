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

type Props = {
  companyName: ?string,
  company: MarketPlaceCompany,
  companyLoading: boolean,
  offers: Array<OfferBasic>,
  selectedDayOffers: ?Array<OfferMarketplace>,
  selectedDayOffersLoading: boolean,
  calendarLoading: boolean,
  fetchCalendar: (companyId: number) => void,
  fetchOffersByDay: ({ companyId: number, date: Object }) => void,
  classes: Object,
};

type State = {
  selectedDate: Object,
  offerId: ?number,
};

export class MarketPlace extends Component<Props, State> {
  state = {
    selectedDate: Moment(),
    offerId: null,
    offer: null,
  };

  async componentDidMount() {
    const { fetchCalendar } = this.props;
    fetchCalendar(this.props.companyId);
    this.updateOfferList(this.state.selectedDate);
  }

  handleDateChange = (date) => {
    this.setState(() => {
      this.updateOfferList(date);
      return { selectedDate: date };
    });
  };

  updateOfferList = (selectedDate) => {
    const day = selectedDate.date();
    const year = selectedDate.year();
    const month = selectedDate.month() + 1;
    if (!this.props.companyId) {
      return;
    }
    this.props.fetchOffersByDay({
      companyId: this.props.companyId,
      year,
      month,
      day,
    });
  };

  openOfferDialog = (offerId: number) => {
    this.setState({
      offerId,
      offer: this.props.selectedDayOffers.find((o) => o.id === offerId),
    });
  };

  closeOfferDialog = () => {
    this.setState({ offerId: null });
  };

  render() {
    const {
      loading,
      calendarLoading,
      classes,
      offers,
      selectedDayOffers,
      selectedDayOffersLoading,
    } = this.props;
    const { selectedDate } = this.state;

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
          dayOffersLoading={selectedDayOffersLoading}
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
    offers: state.marketplace.offers,
    calendarLoading: state.marketplace.loading,
    selectedDayOffers: state.marketplace.detailedOffers,
    selectedDayOffersLoading: state.marketplace.detailedOffersLoading,
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
      fetchCalendar: marketplaceActions.fetchCalendar,
      fetchOffersByDay: marketplaceActions.fetchOffersByDay,
    },
  ),
)(MarketPlace);
