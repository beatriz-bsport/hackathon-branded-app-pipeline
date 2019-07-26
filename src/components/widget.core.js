// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  fetchCompanyAction,
  fetchCompanyMetaActivitiesAction,
  fetchCompanyActivitiesAction,
  fetchCompanyEstablishmentsAction,
  fetchCompanyCoachesAction,
} from 'bsport-saas/src/libs/marketplace/actions';
import { fetchSCT } from 'bsport-saas/src/actions/category.actions';

import CalendarWidget from './widget.calendar';
import PassWidget from './widget.pass';
import WorkshopWidget from './widget.workshop';

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
        return <PassWidget companyId={companyId} store={store} />;
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
