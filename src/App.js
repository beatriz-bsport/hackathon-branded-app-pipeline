// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import {
  fetchCompanyAction,
  fetchCompanyMetaActivitiesAction,
  fetchCompanyActivitiesAction,
  fetchCompanyEstablishmentsAction,
  fetchCompanyCoachesAction,
} from 'bsport-saas/src/libs/marketplace/actions';
import { fetchSCT } from 'bsport-saas/src/actions/category.actions';
import theme from 'bsport-saas/src/theme';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import asyncComponent from './async-component';

const CalendarWidget = asyncComponent(() => import('./components/Calendar'));
const PassWidget = asyncComponent(() => import('./components/Pass'));
const ShopWidget = asyncComponent(() => import('./components/Shop'));
const WorkshopWidget = asyncComponent(() => import('./components/Workshop'));

type Props = {
  companyId: number,
  store: any,
  history: Object,
  widgetType: string,
  fetchSCT: () => void,
  fetchCompany: (companyId: number) => void,
  fetchCompanyActivities: (companyId: number) => void,
  fetchCompanyMetaActivities: (companyId: number) => void,
  fetchCompanyCoaches: (companyId: number) => void,
  fetchCompanyEstablishments: (companyId: number) => void,
  fetchCurrentOrder: (companyId: number) => void,
  fetchProfile: () => void,
  auth: *,
  consumerProfile: *,
};

class BsportWidget extends Component<Props> {
  fetchData = () => {
    this.props.fetchSCT();
    this.props.fetchCompany(this.props.companyId);
    this.props.fetchCompanyActivities(this.props.companyId);
    this.props.fetchCompanyMetaActivities(this.props.companyId);
    this.props.fetchCompanyCoaches(this.props.companyId);
    this.props.fetchCompanyEstablishments(this.props.companyId);
  };

  componentDidMount() {
    this.fetchData();
  }

  renderWidget() {
    const { companyId, store, history, widgetType } = this.props;
    switch (widgetType) {
      case 'workshop':
        return (
          <WorkshopWidget
            companyId={companyId}
            location={history.location}
            store={store}
          />
        );
      case 'pass':
        return (
          <PassWidget
            companyId={companyId}
            store={store}
            location={history.location}
          />
        );
      case 'shop':
        return (
          <ShopWidget
            companyId={companyId}
            store={store}
            location={history.location}
          />
        );
      default:
        return (
          <CalendarWidget
            companyId={companyId}
            location={history.location}
            store={store}
          />
        );
    }
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>{this.renderWidget()}</MuiThemeProvider>
    );
  }
}

export default compose(
  connect(
    (state) => ({ auth: state.auth }),
    {
      // General information
      fetchSCT,
      fetchCompany: fetchCompanyAction,
      fetchCompanyMetaActivities: fetchCompanyMetaActivitiesAction,
      fetchCompanyActivities: fetchCompanyActivitiesAction,
      fetchCompanyEstablishments: fetchCompanyEstablishmentsAction,
      fetchCompanyCoaches: fetchCompanyCoachesAction,
    },
  ),
)(BsportWidget);
