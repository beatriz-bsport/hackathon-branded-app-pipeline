import React, { useEffect } from 'react';

import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
import { TFunction } from 'i18next';
import { WithTranslation, withTranslation } from 'react-i18next';
import { push } from 'connected-react-router';

import withTitle from '../../hocs/with-title.hoc';

import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import ReportDashboard from '../../libs/reporting/ReportDashboard.component';

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

type Props = ConnectedProps<typeof connector> & WithTranslation;
const ReportingDashboard = (props: Props) => {
  const {
    reports,
    createReport,
    updateReport,
    goToReport,
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

  const handleUpsert = (value: {
    data: ReportConfiguration;
    options: OptionCallback;
  }) => {
    const { data, options } = value;

    if (data.id) {
      updateReport({
        reportId: data.id,
        data,
        options,
      });
      return;
    }

    createReport({
      data,
      options,
    });
  };
  return (
    <div>
      <ReportDashboard
        metadata={metadata.results}
        reportConfigurations={reports.results ?? []}
        upsertReportConfiguration={handleUpsert}
        onReportDetail={goToReport}
        onDeleteReport={deleteReport}
      />
    </div>
  );
};

const connector = connect(
  (state: RootState) => ({
    metadata: getReportMetadata(state),
    reports: getReports(state),
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
