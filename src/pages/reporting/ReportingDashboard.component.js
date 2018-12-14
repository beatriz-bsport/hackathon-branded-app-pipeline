// @flow

import React from 'react';

import { connect } from 'react-redux';

import ReportDashboard from '../../libs/reporting/ReportDashboard.component';

type Props = {};

export function ReportingDashboard(props: Props) {
  return <ReportDashboard reportConfigurations={[]} />;
}

export default connect(
  null,
  {},
)(ReportingDashboard);
