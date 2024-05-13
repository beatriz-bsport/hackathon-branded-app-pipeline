import React, { useEffect } from 'react';

import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
import { TFunction } from 'i18next';
import { WithTranslation, withTranslation } from 'react-i18next';
import { push } from 'connected-react-router';

import withTitle from '../../hocs/with-title.hoc';

import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import ReportDashboard from '../../libs/reporting/components/ReportDashboard.component';

import {
  fetchReports as fetchReportsAction,
  fetchReportMetadata as fetchReportMetadataAction,
  deleteReport as deleteReportAction,
  updateReport as updateReportAction,
  createReport as createReportAction,
} from '../../libs/reporting/actions';
import { ReportConfiguration } from '../../libs/reporting/types';
import { RootState } from '../../reducers';
import { getReportMetadata, getReports } from '../../libs/reporting/selectors';
import { OptionCallback } from '../../state/types';
import { OwnProps } from '../../components/HighlightedText/HighlightedText.component';
import { filter_reports_by_upsells } from '#src/libs/reporting/permissions';
import { getCompanyUpsellData } from '#src/libs/company/selectors';

type Props = ConnectedProps<typeof connector> & WithTranslation;
const ReportingDashboard = (props: Props) => {
  const {
    reports,
    createReport,
    updateReport,
    goToReport,
    subscribedUpsells,
    metadata,
    deleteReport,
    fetchReports,
    fetchReportMetadata,
  } = props;

  useEffect(() => {
    fetchReports();
    fetchReportMetadata();
  }, [fetchReports, fetchReportMetadata]);

  if (metadata.loading || !metadata.results || reports.loading) {
    return <LinearProgress />;
  }

  const filteredReportConfigurations = (reports?.results ?? []).filter(
    (report) => filter_reports_by_upsells(report.category, subscribedUpsells),
  );

  const filteredMetadata = (metadata?.results ?? []).filter((reportMetadata) =>
    filter_reports_by_upsells(reportMetadata.category, subscribedUpsells),
  );

  const handleUpsert = (value: {
    reportId: number;
    data: ReportConfiguration;
    options: OptionCallback;
  }) => {
    const { reportId, data, options } = value;

    if (reportId) {
      updateReport({
        reportId,
        data,
        options,
      });
      return;
    }

    createReport({
      data,
      // @ts-expect-error
      options,
    });
  };
  return (
    <div>
      <ReportDashboard
        metadata={filteredMetadata}
        onDeleteReport={deleteReport}
        onReportDetail={goToReport}
        reportConfigurations={filteredReportConfigurations}
        upsertReportConfiguration={handleUpsert}
      />
    </div>
  );
};

const connector = connect(
  (state: RootState) => ({
    metadata: getReportMetadata(state),
    reports: getReports(state),
    subscribedUpsells: getCompanyUpsellData(state),
  }),
  {
    fetchReportMetadata: fetchReportMetadataAction,
    fetchReports: fetchReportsAction,
    updateReport: updateReportAction,
    createReport: createReportAction,
    deleteReport: deleteReportAction,
    goToReport: (id: number) => push(`/reporting/${id}`),
  },
);

export default compose<any, OwnProps>(
  connector,
  withTranslation(),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:dashboard.reportingDashboard'),
  ),
)(ReportingDashboard);
