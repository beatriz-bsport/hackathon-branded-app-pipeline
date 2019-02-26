// @flow

import React from 'react';

import { connect } from 'react-redux';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { push } from 'connected-react-router';

import LinearProgress from '@material-ui/core/LinearProgress';

import ReportDashboard from '../../libs/reporting/ReportDashboard.component';

import {
  reports as reportsRes,
  reportMetadata,
} from '../../resources/reporting';

import withDrawer from '../../hocs/with-drawer.hoc';

type Props = {
  metadata: ReportMetadata,
  reports: ReportConfiguration[],
  fetchReportMetadata: () => void,
  fetchReports: () => void,
  goToReport: (ReportConfiguration) => void,
  upsertReport: (ReportConfiguration) => void,
  deleteReport: (ReportConfiguration) => void,
};

export class ReportingDashboard extends React.Component<Props> {
  componentWillMount() {
    this.props.fetchReports();
    this.props.fetchReportMetadata();
  }

  render() {
    const {
      reports,
      upsertReport,
      goToReport,
      metadata,
      deleteReport,
    } = this.props;

    if (metadata.loading || !metadata.value) {
      return <LinearProgress />;
    }

    return (
      <ReportDashboard
        metadata={metadata.value}
        reportConfigurations={reports}
        upsertReportConfiguration={upsertReport}
        onReportDetail={goToReport}
        onDeleteReport={deleteReport}
      />
    );
  }
}

export default connect(
  (state) => ({
    metadata: reportMetadata.selectors.get(state),
    reports: reportsRes.selectors.all(state),
  }),
  {
    fetchReportMetadata: reportMetadata.effects.get,
    fetchReports: reportsRes.effects.fetchAll,
    upsertReport: reportsRes.effects.upsert,
    deleteReport: reportsRes.effects.delete,
    goToReport: (r: ReportConfiguration) => push(`/reporting/${r.id}`),
  },
  withNamespaces(),
  withDrawer(({ t }: { t: TFunction }) => t('appbar.title.reportingDashboard')),
)(ReportingDashboard);
