// @flow
import React, { Component } from 'react';

import {
  Grid,
  CircularProgress,
  Typography,
  Paper,
  AppBar,
  Tab,
  Button,
  Tabs,
  LinearProgress,
  withStyles,
} from '@material-ui/core';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { push as pushRouter } from 'react-router-redux';

import { Calendar, PaymentPackCard } from '../components';
import { MarketplaceTimetable } from '../components/marketplace';
import { Moment } from '../i18n';
import { marketplace as marketplaceActions } from '../actions';

type Props = {
  companyId: ?number,
  company: MarketPlaceCompany,
  offers: Array<OfferBasic>,
  selectedDayOffers: ?Array<OfferMarketplace>,
  selectedDayOffersLoading: boolean,
  calendarLoading: boolean,
  paymentPacks: Array<PaymentPack>,
  fetchCompany: (companyId: number) => void,
  fetchCalendar: (companyId: number) => void,
  fetchOffersByDay: ({ companyId: number, date: Object }) => void,
  pushPackCheckout: (packId: number) => void,
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

  componentDidMount() {
    const {
      companyId,
      fetchCompany,
      fetchCalendar,
      fetchPaymentPacks,
    } = this.props;
    fetchCompany(companyId);
    fetchCalendar(companyId);
    fetchPaymentPacks(companyId);
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
    const { companyId } = this.props;
    const day = selectedDate.date();
    const year = selectedDate.year();
    const month = selectedDate.month() + 1;
    this.props.fetchOffersByDay({ companyId, year, month, day });
  };

  renderCalendar = () => {
    const {
      classes,
      calendarLoading,
      offers,
      selectedDayOffers,
      selectedDayOffersLoading,
    } = this.props;
    const { selectedDate } = this.state;
    const events = {};
    offers.forEach((o) => {
      const midnight = Moment(o.date_start).startOf('day');
      if (!events[midnight]) {
        events[midnight] = [];
      }
      events[midnight].push(o);
    });
    return (
      <Grid container direction="row" alignItems="stretch">
        <Grid item xs={12} md={6}>
          <div className={classes.leftPanel}>
            <Calendar
              forceMonthDisplay
              onDateClick={this.handleDateChange}
              events={events}
            />
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <div className={classes.rightPanel}>
            <MarketplaceTimetable
              offers={selectedDayOffers}
              date={selectedDate}
              loading={selectedDayOffersLoading}
            />
          </div>
        </Grid>
        <Grid item xs={12}>
          {calendarLoading ? <LinearProgress /> : null}
        </Grid>
      </Grid>
    );
  };

  renderPass = () => {
    const { t } = this.props;
    return (
      <Grid container direction="row" spacing={16}>
	{//Forgive me but i haz no tiime
	this.props.paymentPacks
          .map((p) => ({
            ...p,
            metaActivities: p.metaActivities.map((ma) => ma.id),
            metaActivitiesFull: p.metaActivities,
          }))
          .map((pp) => (
            <Grid item xs={12} md={6} lg={4}>
              <PaymentPackCard
                pack={pp}
                metaActivities={pp.metaActivitiesFull}
                onlyPublic
              />
              <Button
                style={{ width: '100%' }}
                onClick={() => this.props.pushPackCheckout(pp.id)}
                color="primary"
                variant="raised"
              >
                {t('marketplace.buyPack')}
              </Button>
            </Grid>
          ))}
      </Grid>
    );
  };

  renderContent = () => {
    switch (this.state.tabSelected) {
      case TAB_PASS:
        return this.renderPass();
      case TAB_CALENDAR:
      default:
        return this.renderCalendar();
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

function mapStateToProps(state, nextProps) {
  const { match } = nextProps;
  const companyId = (match && match.params && +match.params.id) || null;
  return {
    companyId,
    company: state.marketplace.company,
    offers: state.marketplace.offers,
    activities: state.marketplace.activities,
    calendarLoading: state.marketplace.loading,
    selectedDayOffers: state.marketplace.detailedOffers,
    selectedDayOffersLoading: state.marketplace.detailedOffersLoading,
    paymentPacks: state.marketplace.paymentPacks,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    fetchCompany(companyId: number) {
      dispatch(marketplaceActions.fetchCompany(companyId));
    },
    fetchCalendar(companyId) {
      dispatch(marketplaceActions.fetchCalendar(companyId));
    },
    fetchOffersByDay({ companyId, year, month, day }) {
      dispatch(
        marketplaceActions.fetchOffersByDay({ companyId, year, month, day }),
      );
    },
    fetchPaymentPacks(companyId) {
      dispatch(marketplaceActions.fetchPaymentPacks(companyId));
    },
    pushPackCheckout(packId) {
      dispatch(pushRouter(`/customer/payment/pass/${packId}`));
    },
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
  leftPanel: {
    padding: theme.spacing.unit * 2,
  },
  rightPanel: {
    borderLeft: '1px solid #F0F0F0',
    height: '100%',
  },
});

export default withStyles(styles)(
  translate()(
    connect(
      mapStateToProps,
      mapDispatchToProps,
    )(MarketPlace),
  ),
);
