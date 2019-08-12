// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import './App.scss';

// used to init moment correctly
// eslint-disable-next-line
import i18n from 'bsport-saas/src/i18n';

import {
  fetchCompanyAction,
  fetchCompanyMetaActivitiesAction,
  fetchCompanyActivitiesAction,
  fetchCompanyEstablishmentsAction,
  fetchCompanyCoachesAction,
} from 'bsport-saas/src/libs/marketplace/actions';
import { fetchCompanyTheme } from 'bsport-saas/src/libs/theme/actions';
import { fetchSCT } from 'bsport-saas/src/actions/category.actions';
import { getTheme } from 'bsport-saas/src/theme';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import asyncComponent from './async-component';

/* FOR TESTING PURPOSES
import WorkshopWidget from './components/Workshop';
import CalendarWidget from './components/Calendar';
import ShopWidget from './components/Shop';
*/
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
  lang: string,
};

class BsportWidget extends Component<Props> {
  fetchData = () => {
    this.props.fetchSCT();
    this.props.fetchCompanyTheme(this.props.companyId);
    this.props.fetchCompany(this.props.companyId);
    this.props.fetchCompanyActivities(this.props.companyId);
    this.props.fetchCompanyMetaActivities(this.props.companyId);
    this.props.fetchCompanyCoaches(this.props.companyId);
    this.props.fetchCompanyEstablishments(this.props.companyId);
  };

  componentWillMount() {
    i18n.changeLanguage(this.props.lang || 'fr-FR');
  }

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
      <MuiThemeProvider theme={getTheme(this.props.theme)}>
        {this.renderWidget()}
      </MuiThemeProvider>
    );
  }
}

export default compose(
  connect(
    (state) => ({ auth: state.auth, theme: state.theme.theme }),
    {
      // General information
      fetchSCT,
      fetchCompanyTheme,
      fetchCompany: fetchCompanyAction,
      fetchCompanyMetaActivities: fetchCompanyMetaActivitiesAction,
      fetchCompanyActivities: fetchCompanyActivitiesAction,
      fetchCompanyEstablishments: fetchCompanyEstablishmentsAction,
      fetchCompanyCoaches: fetchCompanyCoachesAction,
    },
  ),
)(BsportWidget);
