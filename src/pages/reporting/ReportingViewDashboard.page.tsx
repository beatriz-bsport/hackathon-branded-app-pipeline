import React, { useEffect } from 'react';

import { connect, ConnectedProps } from 'react-redux';
import { push } from 'connected-react-router';
import { compose } from 'recompose';
import { TFunction } from 'i18next';
import { WithTranslation, withTranslation } from 'react-i18next';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories';
import type { ReportV2QueryParams } from '#src/libs/reporting/common/types';

import {
  fetchReports as fetchReportsAction,
  deleteReport as deleteReportAction,
  updateReport as updateReportAction,
  createReport as createReportAction,
} from '#src/libs/reporting/v1/actions';
import {
  fetchReportMetadata as fetchReportMetadataAction,
  fetchReportsV2Paginated as fetchReportsV2PaginatedAction,
} from '#src/libs/reporting/v2/actions';
import {
  setIsReportAlertDisplayedInV2 as setIsReportAlertDisplayedAction,
  setIsReportV2Displayed as setIsReportV2DisplayedAction,
} from '#src/libs/user-preference/actions';

import type { RootState } from '#src/reducers';

import { getCompanyUpsellData } from '#src/libs/company/selectors';
import {
  getCustomViewsReports,
  getReports,
} from '#src/libs/reporting/v1/selectors';
import {
  getReportsV2,
  getReportV2Loading,
  getReportCategoriesMetadata,
  getReportsViewsPaginated,
} from '#src/libs/reporting/v2/selectors';
import { getObjectPermissions } from '#src/libs/role/selectors';
import {
  getIsReportV2Displayed,
  getIsReportAlertDisplayedInV2,
  getLastVisitedReportV2,
} from '#src/libs/user-preference/selectors';

import withTitle from '#src/hocs/with-title.hoc';

import LinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';
import ReportViewDashboard from '#src/libs/reporting/v2/components/ReportViewDashboard.component';
import type { OwnProps } from '#src/components/HighlightedText/HighlightedText.component';

import { REPORT_VIEWS_FETCHING_PAGINATION_SIZE } from '#src/libs/reporting/common/constants';

type Props = ConnectedProps<typeof connector> & WithTranslation;

const ReportingViewDashboard: React.FC<Props> = ({
  fetchReportMetadata,
  fetchReports,
  fetchReportsV2Paginated,
  pushRouter,
  isV2Displayed,
  lastVisitedReportV2,
  metadata,
  reports,
  reportsV2,
  reportsV2Loading,
  reportViewsPaginated,
}) => {
  useEffect(() => {
    fetchReports();
    fetchReportMetadata();
    fetchReportsV2Paginated({
      page_size: REPORT_VIEWS_FETCHING_PAGINATION_SIZE,
      ordering: '-created_at',
    });
  }, [fetchReports, fetchReportMetadata, fetchReportsV2Paginated]);

  const classes = useStyles();

  const reportViews = Object.values(reportViewsPaginated.byId);

  const handleGoToReportV2 = React.useCallback(
    (categoryName: ReportCategoryEnum) => () => {
      const reportId =
        lastVisitedReportV2?.[categoryName] ||
        reportViews?.find((result) => result.category === categoryName)?.id;

      reportId
        ? pushRouter(`/reporting/detail/${categoryName}/${reportId}`)
        : pushRouter('/reporting/views');
    },
    [pushRouter, reportViews, lastVisitedReportV2],
  );

  const fetchNextReportViews = React.useCallback(
    (params: ReportV2QueryParams) => {
      fetchReportsV2Paginated(params);
    },
    [fetchReportsV2Paginated],
  );

  if (
    metadata.loading ||
    !metadata.results ||
    (!isV2Displayed && reports.loading) ||
    (isV2Displayed && reportsV2Loading)
  ) {
    return <LinearProgress />;
  }

  return (
    <div className={classes.pageContainer}>
      {reportViewsPaginated && (
        <ReportViewDashboard
          handleGoToReportV2={handleGoToReportV2}
          onPageRequested={fetchNextReportViews}
          reportViews={reportsV2}
          reportViewsPaginated={reportViewsPaginated}
        />
      )}
    </div>
  );
};

const connector = connect(
  (state: RootState) => ({
    metadata: getReportCategoriesMetadata(state),
    objectLevelPermissions: getObjectPermissions(state),
    reports: getReports(state),
    reportsV2: getReportsV2(state),
    customReports: getCustomViewsReports(state),
    reportsV2Loading: getReportV2Loading(state),
    subscribedUpsells: getCompanyUpsellData(state),
    isV2Displayed: getIsReportV2Displayed(state),
    isReportAlertDisplayedInV2: getIsReportAlertDisplayedInV2(state),
    lastVisitedReportV2: getLastVisitedReportV2(state),
    reportViewsPaginated: getReportsViewsPaginated(state),
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
    fetchReportsV2Paginated: fetchReportsV2PaginatedAction,
  },
);

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: `0px ${theme.spacing(2)}px`,
  },
}));

export default compose<any, OwnProps>(
  connector,
  withTranslation('titles'),
  withTitle(({ t }: { t: TFunction }) => t('dashboard.reportingDashboard')),
)(React.memo(ReportingViewDashboard));
