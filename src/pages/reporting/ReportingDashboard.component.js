// @flow

import React from 'react';

import { connect } from 'react-redux';

import ReportDashboard from '../../libs/reporting/ReportDashboard.component';

import { reports } from '../../resources/reporting';

type Props = {};

export class ReportingDashboard extends React.Component {
  componentWillMount() {
    this.props.fetchReports();
  }
  render() {
    const { reports, upsertReport } = this.props;
    return (
      <ReportDashboard
        reportConfigurations={reports}
        upsertReportConfiguration={upsertReport}
      />
    );
  }
}

export default connect(
  (state) => ({
    reports: reports.selectors.all(state),
  }),
  {
    fetchReports: reports.effects.fetchAll,
    upsertReport: reports.effects.upsert,
  },
)(ReportingDashboard);
