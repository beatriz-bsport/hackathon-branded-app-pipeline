// @flow
import React, { Component } from 'react';

import { compose } from 'recompose';

import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import LinearProgress from '@material-ui/core/LinearProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { connect } from 'react-redux';

import ConsumerAppBar from '../../components/navigation/ConsumerAppBar.component';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import MarketplacePassPage from './MarketplacePass.page';
import MarketplaceCalendarPage from './MarketplaceCalendar.page';

import { marketplace as marketplaceActions } from '../../actions';

import api from '../../api';

type Props = {
  companyName: ?string,
  company: MarketPlaceCompany,
  companyLoading: boolean,
  fetchCompany: (companyId: number) => void,
  t: TFunction,
  classes: Object,
};

type State = {
  tabSelected: number,
};

const TAB_CALENDAR = 0;
const TAB_PASS = 1;

export class MarketPlace extends Component<Props, State> {
  state = {
    tabSelected: window.location.href.includes('tab=pass')
      ? TAB_PASS
      : TAB_CALENDAR,
  };

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
    this.props.fetchCompany(this.companyId);
  }

  handleTabChange = (event, value) => {
    this.setState({ tabSelected: value });
  };

  renderContent = () => {
    if (!this.companyId) {
      return null;
    }
    switch (this.state.tabSelected) {
      case TAB_PASS:
        return <MarketplacePassPage companyId={this.companyId} />;
      case TAB_CALENDAR:
      default: {
        return <MarketplaceCalendarPage companyId={this.companyId} />;
      }
    }
  };

  render() {
    const { companyLoading, classes, t, company } = this.props;
    if (!company) {
      if (!companyLoading) {
        this.props.fetchCompany(this.companyId);
      }
      return (
        <Grid container item alignItems="center" justify="center">
          <LinearProgress />
        </Grid>
      );
    }
    return (
      <div style={{ width: '100%', flexGrow: 1 }}>
        <ConsumerAppBar title={company.name} />
        <div className={classes.container}>
          <AppBar position="relative" color="default">
            <Tabs
              value={this.state.tabSelected}
              onChange={this.handleTabChange}
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab value={TAB_CALENDAR} label={t('marketplace.calendar')} />
              <Tab value={TAB_PASS} label={t('marketplace.pass')} />
            </Tabs>
          </AppBar>
          {this.renderContent()}
        </div>
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    flexGrow: 1,
    width: '100%',
  },
  title: {
    marginBottom: theme.spacing.unit * 6,
  },
  paperContainer: {
    flexGrow: 1,
    height: '100%',
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(),
  routerParamsToProps({
    id: 'companyName',
  }),
  connect(
    (state) => ({
      company: state.marketplace.company,
      companyLoading: state.marketplace.companyLoading,
    }),
    {
      fetchCompany: marketplaceActions.fetchCompany,
    },
  ),
)(MarketPlace);
