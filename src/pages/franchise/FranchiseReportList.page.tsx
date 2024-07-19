import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import { TFunction } from 'i18next';
import { push } from 'connected-react-router';
import makeStyles from '@material-ui/core/styles/makeStyles';

import withTitle from '#src/hocs/with-title.hoc';

import LinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';
import ReportDashboard from '#src/libs/reporting/v1/components/ReportDashboard.component';

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
import { RootState } from '#src/reducers';
import {
  getReportMetadata,
  getReports,
} from '#src/libs/reporting/v1/selectors';
import { OptionCallback } from '#src/state/types';
import { OwnProps } from '#src/components/HighlightedText/HighlightedText.component';
import ReportDashboardReworked from '#src/libs/reporting/v2/components/ReportDashboardReworked.component';
import ReportVersionSwitcher from '#src/libs/reporting/v2/components/ReportVersionSwitcher.component';

type Props = ConnectedProps<typeof connector> & WithTranslation;

const FranchiseReportList: React.FC<Props> = ({
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
        // @ts-expect-error TODO: franchise case
        <ReportDashboardReworked
          handleConfirmationDialogState={handleConfirmationDialogState}
          metadata={metadata.results}
        />
      ) : (
        <ReportDashboard
          metadata={metadata.results}
          onDeleteReport={deleteReport}
          onReportDetail={goToReport}
          reportConfigurations={reports.results ?? []}
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
    isV2Displayed: getIsReportV2Displayed(state),
    IsReportAlertDisplayedInV2: getIsReportAlertDisplayedInV2(state),
  }),
  {
    fetchReportMetadata: fetchReportMetadataAction,
    fetchReports: fetchReportsAction,
    updateReport: updateReportAction,
    createReport: createReportAction,
    deleteReport: deleteReportAction,
    goToReport: (id: number) => push(`reporting/${id}`),
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
)(React.memo(FranchiseReportList));
