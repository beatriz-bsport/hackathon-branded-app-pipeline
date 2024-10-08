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

import { fetchDefaultReports as fetchDefaultReportsAction } from '#src/libs/reporting/v2/actions';

import {
  getDefaultReportsV2,
  getReportV2Loading,
} from '#src/libs/reporting/v2/selectors';

import {
  getIsReportV2Displayed,
  getIsReportAlertDisplayedInV2,
  getLastVisitedReportV2,
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
import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories';

type Props = ConnectedProps<typeof connector> & WithTranslation;

const FranchiseReportList: React.FC<Props> = ({
  createReport,
  deleteReport,
  fetchDefaultReports,
  fetchReportMetadata,
  fetchReports,
  isReportAlertDisplayedInV2,
  isV2Displayed,
  lastVisitedReportV2,
  metadata,
  pushRouter,
  reports,
  defaultReportsV2,
  reportsV2Loading,
  setIsReportAlertDisplayedInV2,
  setIsReportV2Displayed,
  updateReport,
}) => {
  useEffect(() => {
    fetchReports();
    fetchReportMetadata();
    fetchDefaultReports();
  }, [fetchReports, fetchReportMetadata, fetchDefaultReports]);
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

  const handleGoToReportV1 = React.useCallback(
    (id: number) => pushRouter(`/f/reporting/v1/detail/${id}`),
    [pushRouter],
  );

  const handleGoToReportV2 = React.useCallback(
    (categoryName: ReportCategoryEnum) => () => {
      const reportId =
        lastVisitedReportV2?.[categoryName] ||
        defaultReportsV2?.find((result) => result.category === categoryName)
          ?.id;

      reportId
        ? pushRouter(`/f/reporting/detail/${categoryName}/${reportId}`)
        : pushRouter('/f/reporting/categories/');
    },
    [pushRouter, defaultReportsV2, lastVisitedReportV2],
  );

  if (
    metadata.loading ||
    !metadata.results ||
    (!isV2Displayed && reports.loading) ||
    (isV2Displayed && reportsV2Loading)
  ) {
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
        isReportAlertDisplayedInV2={isReportAlertDisplayedInV2}
        isV2Displayed={isV2Displayed}
      />
      {isV2Displayed ? (
        <ReportDashboardReworked
          handleConfirmationDialogState={handleConfirmationDialogState}
          handleGoToReportV2={handleGoToReportV2}
          metadata={metadata.results}
        />
      ) : (
        <ReportDashboard
          metadata={metadata.results}
          onDeleteReport={deleteReport}
          onReportDetail={handleGoToReportV1}
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
    defaultReportsV2: getDefaultReportsV2(state),
    reportsV2Loading: getReportV2Loading(state),
    isV2Displayed: getIsReportV2Displayed(state),
    isReportAlertDisplayedInV2: getIsReportAlertDisplayedInV2(state),
    lastVisitedReportV2: getLastVisitedReportV2(state),
  }),
  {
    fetchReportMetadata: fetchReportMetadataAction,
    fetchReports: fetchReportsAction,
    updateReport: updateReportAction,
    createReport: createReportAction,
    deleteReport: deleteReportAction,
    pushRouter: push,
    setIsReportAlertDisplayedInV2: setIsReportAlertDisplayedAction,
    setIsReportV2Displayed: setIsReportV2DisplayedAction,
    fetchDefaultReports: fetchDefaultReportsAction,
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
