// @flow
import React, { Component } from 'react';
import { Moment } from 'bsport-saas/src/i18n';
import Immutable from 'seamless-immutable';
import { Provider, connect } from 'react-redux';
import { BrowserRouter, Router, Route } from 'react-router-dom';
import {
  fetchCompanyAction,
  fetchCompanyMetaActivitiesAction,
  fetchCompanyActivitiesAction,
  fetchCompanyEstablishmentsAction,
  fetchCompanyCoachesAction,
} from 'bsport-saas/src/libs/marketplace/actions';
import { fetchSCT } from 'bsport-saas/src/actions/category.actions';

import { MarketplaceCalendarWidget } from 'bsport-saas/src/pages/marketplace/MarketplaceCalendar.page';

// import PropTypes from 'prop-types';

type Props = {
  companyId: number,
  store: any,
  history: Object,
  fetchSCT: () => void,
  fetchCompany: (companyId: number) => void,
  fetchCompanyActivities: (companyId: number) => void,
  fetchCompanyMetaActivities: (companyId: number) => void,
  fetchCompanyCoaches: (companyId: number) => void,
  fetchCompanyEstablishments: (companyId: number) => void,
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

  render() {
    const { companyId, store, history } = this.props;
    return (
      <MarketplaceCalendarWidget
        companyId={companyId}
        location={history.location}
        store={store}
      />
    );
  }
}

BsportWidget.propTypes = {};

// BsportWidget.defaultProps = {};

export default connect(
  (state) => ({}),
  {
    // General information
    fetchSCT,
    fetchCompany: fetchCompanyAction,
    fetchCompanyMetaActivities: fetchCompanyMetaActivitiesAction,
    fetchCompanyActivities: fetchCompanyActivitiesAction,
    fetchCompanyEstablishments: fetchCompanyEstablishmentsAction,
    fetchCompanyCoaches: fetchCompanyCoachesAction,
    // For shop pages
  },
)(BsportWidget);
