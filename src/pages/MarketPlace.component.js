// @flow
import React, { Component } from 'react';

import { compose } from 'recompose';

import {
  Grid,
  Paper,
  AppBar,
  Tab,
  Tabs,
  LinearProgress,
  withStyles,
} from '@material-ui/core';
import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import ConsumerAppBar from '../components/navigation/ConsumerAppBar.component';

import routerParamsToProps from '../hocs/router-params-to-props.hoc';

import MarketplacePassList from '../components/marketplace/MarketplacePassList.component';
import MarketplaceCalendar from '../components/marketplace/MarketplaceCalendar.component';
import MarketplaceActivityDialog from '../components/marketplace/MarketplaceActivityDialog.component';

import { Moment } from '../i18n';
import { marketplace as marketplaceActions } from '../actions';

import api from '../api';

type Props = {
  companyName: ?string,
  company: MarketPlaceCompany,
  companyLoading: boolean,
  paymentPacksLoading: boolean,
  offers: Array<OfferBasic>,
  selectedDayOffers: ?Array<OfferMarketplace>,
  selectedDayOffersLoading: boolean,
  calendarLoading: boolean,
  paymentPacks: Array<PaymentPack>,
  fetchCompany: (companyId: number) => void,
  fetchCalendar: (companyId: number) => void,
  fetchOffersByDay: ({ companyId: number, date: Object }) => void,
  fetchPaymentPacks: (companyId: number) => void,
  pushPackCheckout: (packId: number, companyId: number) => void,
  t: (x: string) => string,
  classes: Object,
};

type State = {
  selectedDate: Object,
  tabSelected: number,
  offerId: ?number,
};

const TAB_CALENDAR = 0;
const TAB_PASS = 1;

export class MarketPlace extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: Moment(),
      tabSelected: window.location.href.includes('tab=pass')
        ? TAB_PASS
        : TAB_CALENDAR,
      offerId: null,
    };
  }

  async componentDidMount() {
    try {
      const response = await api.marketplace.getIdByName(
        this.props.companyName,
      );
      if (response.status !== 200) {
        throw new Error(response);
      }
      this.companyId = response.data;
      this.props.fetchCompany(this.companyId);
    } catch (error) {
      console.error(error);
    }
    const { fetchCompany, fetchCalendar, fetchPaymentPacks } = this.props;
    fetchCompany(this.companyId);
    fetchCalendar(this.companyId);
    fetchPaymentPacks(this.companyId);
    this.updateOfferList(this.state.selectedDate);
  }

  handleDateChange = (date) => {
    this.setState(() => {
      this.updateOfferList(date);
      return { selectedDate: date };
    });
  };

  handleTabChange = (event, value) => {
    this.setState({ tabSelected: value });
  };

  updateOfferList = (selectedDate) => {
    const day = selectedDate.date();
    const year = selectedDate.year();
    const month = selectedDate.month() + 1;
    if (!this.companyId) {
      return;
    }
    this.props.fetchOffersByDay({
      companyId: this.companyId,
      year,
      month,
      day,
    });
  };

  openOfferDialog = (offerId) => {
    this.setState({
      offerId,
      offer: this.props.selectedDayOffers.find((o) => o.id === offerId),
    });
  };

  closeOfferDialog = () => {
    this.setState({ offerId: null });
  };

  renderContent = () => {
    switch (this.state.tabSelected) {
      case TAB_PASS:
        if (this.props.paymentPacksLoading) {
          return <LinearProgress />;
        }
        return (
          <MarketplacePassList
            paymentPacks={this.props.paymentPacks}
            pushPackCheckout={(packId) =>
              this.props.pushPackCheckout(packId, this.companyId)
            }
          />
        );
      case TAB_CALENDAR:
      default: {
        const {
          calendarLoading,
          offers,
          selectedDayOffers,
          selectedDayOffersLoading,
        } = this.props;
        const { selectedDate } = this.state;
        return (
          <MarketplaceCalendar
            selectedDate={selectedDate}
            offers={offers}
            dayOffers={selectedDayOffers}
            dayOffersLoading={selectedDayOffersLoading}
            onClickOffer={this.openOfferDialog}
            calendarLoading={calendarLoading}
            onSelectDate={this.handleDateChange}
          />
        );
      }
    }
  };

  render() {
    const { companyLoading, classes, t, company } = this.props;
    if (!company) {
      if (!companyLoading) {
        this.props.fetchCompany(this.companyId);
        this.props.fetchCalendar(this.companyId);
        this.props.fetchPaymentPacks(this.companyId);
        this.updateOfferList(this.state.selectedDate);
      }
      return (
        <Grid container item alignItems="center" justify="center">
          <LinearProgress />
        </Grid>
      );
    }
    return (
      <div style={{ width: '100%' }}>
        <ConsumerAppBar title={company.name} />
        <div className={classes.container}>
          <AppBar position="relative" color="default">
            {this.state.offerId ? (
              <MarketplaceActivityDialog
                offerId={this.state.offerId}
                offer={this.state.offer}
                showBookingButton
                displayPacksInformation
                onClose={this.closeOfferDialog}
              />
            ) : null}
            <Tabs
              value={this.state.tabSelected}
              onChange={this.handleTabChange}
              textColor="primary"
              indicatorColor="primary"
              centered
            >
              <Tab value={TAB_CALENDAR} label={t('marketplace.calendar')} />
              <Tab value={TAB_PASS} label={t('marketplace.pass')} />
            </Tabs>
          </AppBar>
          <Paper>{this.renderContent()}</Paper>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    company: state.marketplace.company,
    companyLoading: state.marketplace.companyLoading,
    offers: state.marketplace.offers,
    activities: state.marketplace.activities,
    calendarLoading: state.marketplace.loading,
    selectedDayOffers: state.marketplace.detailedOffers,
    selectedDayOffersLoading: state.marketplace.detailedOffersLoading,
    paymentPacks: state.marketplace.paymentPacks,
    paymentPacksLoading: state.marketplace.paymentPacksLoading,
  };
}

const styles = (theme) => ({
  container: {
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing.unit * 2,
    },
    width: '100%',
  },
  appBar: {
    padding: theme.spacing.unit * 2,
  },
  title: {
    marginBottom: theme.spacing.unit * 6,
  },
  paperContainer: {
    padding: theme.spacing.unit,
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(),
  routerParamsToProps({
    id: 'companyName',
  }),
  connect(
    mapStateToProps,
    {
      fetchCompany: marketplaceActions.fetchCompany,
      fetchCalendar: marketplaceActions.fetchCalendar,
      fetchOffersByDay: marketplaceActions.fetchOffersByDay,
      fetchPaymentPacks: marketplaceActions.fetchPaymentPacks,
      pushPackCheckout: (packId, companyId) =>
        push(`/customer/payment/pass/${packId}?membership=${companyId}`),
    },
  ),
)(MarketPlace);
