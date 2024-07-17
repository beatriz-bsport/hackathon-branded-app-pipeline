import React, { useEffect } from 'react';

import { WithTranslation, withTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { TFunction } from 'i18next';
import { push } from 'connected-react-router';

import { filter_reports_by_upsells } from '#src/libs/reporting/common/permissions';
import { getCompanyUpsellData } from '#src/libs/company/selectors';
import withTitle from '#src/hocs/with-title.hoc';

import LinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';
import ReportDashboard from '#src/libs/reporting/v1/components/ReportDashboard.component';
import ReportDashboardReworked from '#src/libs/reporting/v2/components/ReportDashboardReworked.component';
import ReportVersionSwitcher from '#src/libs/reporting/v2/components/ReportVersionSwitcher.component';

import {
  fetchReports as fetchReportsAction,
  fetchReportMetadata as fetchReportMetadataAction,
  deleteReport as deleteReportAction,
  updateReport as updateReportAction,
  createReport as createReportAction,
} from '#src/libs/reporting/v1/actions';

import {
  getIsReportV2Displayed,
  getIsReportAlertDisplayedInV2,
} from '#src/libs/user-preference/selectors';
import {
  setIsReportAlertDisplayedInV2 as setIsReportAlertDisplayedAction,
  setIsReportV2Displayed as setIsReportV2DisplayedAction,
} from '#src/libs/user-preference/actions';
import type { ReportConfiguration } from '#src/libs/reporting/common/types';
import type { RootState } from '#src/reducers';
import {
  getReportMetadata,
  getReports,
} from '#src/libs/reporting/v1/selectors';
import type { OptionCallback } from '#src/state/types';
import type { OwnProps } from '#src/components/HighlightedText/HighlightedText.component';

type Props = ConnectedProps<typeof connector> & WithTranslation;

const ReportingDashboard: React.FC<Props> = ({
  createReport,
  deleteReport,
  fetchReportMetadata,
  fetchReports,
  goToReport,
  IsReportAlertDisplayedInV2,
  isV2Displayed,
  metadata,
  reports,
  setIsReportAlertDisplayedInV2,
  setIsReportV2Displayed,
  subscribedUpsells,
  updateReport,
}) => {
  useEffect(() => {
    fetchReports();
    fetchReportMetadata();
  }, [fetchReports, fetchReportMetadata]);
  const classes = useStyles();

  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    React.useState(false);

  const handleConfirmationDialogState = React.useCallback(
    (bool: boolean) => () => setIsConfirmationDialogOpen(bool),
    [],
  );

  const handleDisplayReworkedVersion = React.useCallback(
    (shouldCloseDialog: boolean) => () => {
      setIsReportV2Displayed(!isV2Displayed);
      if (shouldCloseDialog) {
        setIsConfirmationDialogOpen(false);
      }
    },
    [setIsReportV2Displayed, isV2Displayed],
  );

  const handleRemoveReportAlertDisplay = React.useCallback(() => {
    setIsReportAlertDisplayedInV2(false);
  }, [setIsReportAlertDisplayedInV2]);

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
    <div className={classes.pageContainer}>
      <ReportVersionSwitcher
        handleConfirmationDialogState={handleConfirmationDialogState}
        handleDisplayReworkedVersion={handleDisplayReworkedVersion}
        handleRemoveReportAlertDisplay={handleRemoveReportAlertDisplay}
        isConfirmationDialogOpen={isConfirmationDialogOpen}
        IsReportAlertDisplayedInV2={IsReportAlertDisplayedInV2}
        isV2Displayed={isV2Displayed}
      />
      {isV2Displayed ? (
        <ReportDashboardReworked
          handleConfirmationDialogState={handleConfirmationDialogState}
          metadata={filteredMetadata}
        />
      ) : (
        <ReportDashboard
          metadata={filteredMetadata}
          onDeleteReport={deleteReport}
          onReportDetail={goToReport}
          reportConfigurations={filteredReportConfigurations}
          upsertReportConfiguration={handleUpsert}
        />
      )}
    </div>
  );
};

const connector = connect(
  (state: RootState) => ({
    metadata: getReportMetadata(state),
    reports: getReports(state),
    subscribedUpsells: getCompanyUpsellData(state),
    isV2Displayed: getIsReportV2Displayed(state),
    IsReportAlertDisplayedInV2: getIsReportAlertDisplayedInV2(state),
  }),
  {
    fetchReportMetadata: fetchReportMetadataAction,
    fetchReports: fetchReportsAction,
    updateReport: updateReportAction,
    createReport: createReportAction,
    deleteReport: deleteReportAction,
    goToReport: (id: number) => push(`/reporting/${id}`),
    setIsReportAlertDisplayedInV2: setIsReportAlertDisplayedAction,
    setIsReportV2Displayed: setIsReportV2DisplayedAction,
  },
);

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
}));

export default compose<any, OwnProps>(
  connector,
  withTranslation(),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:dashboard.reportingDashboard'),
  ),
)(React.memo(ReportingDashboard));
