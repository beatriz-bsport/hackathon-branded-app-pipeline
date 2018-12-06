// @flow
import React, { Component } from 'react';

import { compose } from 'recompose';

import {
  Grid,
  CircularProgress,
  Typography,
  Paper,
  AppBar,
  Tab,
  Tabs,
  withStyles,
} from '@material-ui/core';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import routerParamsToProps from '../hocs/router-params-to-props.hoc';

import MarketplacePassList from '../components/marketplace/MarketplacePassList.component';
import MarketplaceCalendar from '../components/marketplace/MarketplaceCalendar.component';

import { Moment } from '../i18n';
import { marketplace as marketplaceActions } from '../actions';

import api from '../api';

type Props = {
  companyName: ?string,
  company: MarketPlaceCompany,
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
};

const TAB_CALENDAR = 0;
const TAB_PASS = 1;

export class MarketPlace extends Component<Props, State> {
  state = {
    selectedDate: Moment(),
    tabSelected: TAB_CALENDAR,
  };

  async componentDidMount() {
    try {
      const response = await api.marketplace.getIdByName(
        this.props.companyName,
      );
      if (response.status !== 200) {
        console.log(response);
        throw new Error(response);
      }
      this.companyId = response.data;
      this.props.fetchCompany(this.companyId);
    } catch (e) {
      console.log(e);
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
    this.props.fetchOffersByDay({
      companyId: this.companyId,
      year,
      month,
      day,
    });
  };

  renderContent = () => {
    switch (this.state.tabSelected) {
      case TAB_PASS:
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
            calendarLoading={calendarLoading}
            onSelectDate={this.handleDateChange}
          />
        );
      }
    }
  };

  render() {
    const { classes, t, company } = this.props;
    if (!company) {
      return (
        <Grid container item alignItems="center" justify="center">
          <CircularProgress />
        </Grid>
      );
    }
    return (
      <div className={classes.container}>
        <Typography variant="h2" className={classes.title}>
          {`${t('marketplace.welcomeTo')} ${company.name}`}
        </Typography>
        <AppBar position="relative" color="default">
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
    );
  }
}

function mapStateToProps(state) {
  return {
    company: state.marketplace.company,
    offers: state.marketplace.offers,
    activities: state.marketplace.activities,
    calendarLoading: state.marketplace.loading,
    selectedDayOffers: state.marketplace.detailedOffers,
    selectedDayOffersLoading: state.marketplace.detailedOffersLoading,
    paymentPacks: state.marketplace.paymentPacks,
  };
}

const styles = (theme) => ({
  container: {
    [theme.breakpoints.up('sm')]: {
      margin: theme.spacing.unit * 2,
    },
    width: '100%',
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
  translate(),
  routerParamsToProps({ id: 'companyName' }),
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
