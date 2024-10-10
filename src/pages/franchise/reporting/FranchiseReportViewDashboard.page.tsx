import React, { useEffect } from 'react';

import { WithTranslation, withTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { TFunction } from 'i18next';
import { push } from 'connected-react-router';

import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories';

import type { OwnProps } from '#src/components/HighlightedText/HighlightedText.component';
import { ReportV2QueryParams } from '#src/libs/reporting/common/types';

import {
  fetchReports as fetchReportsAction,
  deleteReport as deleteReportAction,
  updateReport as updateReportAction,
  createReport as createReportAction,
} from '#src/libs/reporting/v1/actions';
import {
  fetchReportsV2Paginated as fetchReportsV2PaginatedAction,
  fetchReportMetadata as fetchReportMetadataAction,
} from '#src/libs/reporting/v2/actions';
import {
  setIsReportAlertDisplayedInV2 as setIsReportAlertDisplayedAction,
  setIsReportV2Displayed as setIsReportV2DisplayedAction,
} from '#src/libs/user-preference/actions';

import type { RootState } from '#src/reducers';

import { getCompanyUpsellData } from '#src/libs/company/selectors';
import {
  getIsReportV2Displayed,
  getIsReportAlertDisplayedInV2,
  getLastVisitedReportV2,
} from '#src/libs/user-preference/selectors';
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

import withTitle from '#src/hocs/with-title.hoc';
import LinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';
import ReportViewDashboard from '#src/libs/reporting/v2/components/ReportViewDashboard.component';

import { REPORT_VIEWS_FETCHING_PAGINATION_SIZE } from '#src/libs/reporting/common/constants';

type Props = ConnectedProps<typeof connector> & WithTranslation;

const FranchiseReportViewDashboard: React.FC<Props> = ({
  fetchReportMetadata,
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
    fetchReportMetadata();
    fetchReportsV2Paginated({
      page_size: REPORT_VIEWS_FETCHING_PAGINATION_SIZE,
      ordering: '-created_at',
    });
  }, [fetchReportMetadata, fetchReportsV2Paginated]);

  const classes = useStyles();

  const handleGoToReportV2 = React.useCallback(
    (categoryName: ReportCategoryEnum) => () => {
      const reportId =
        lastVisitedReportV2?.[categoryName] ||
        reportsV2?.find((result) => result.category === categoryName)?.id;

      reportId
        ? pushRouter(`/f/reporting/detail/${categoryName}/${reportId}`)
        : pushRouter('/f/reporting/views');
    },
    [pushRouter, reportsV2, lastVisitedReportV2],
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
      <ReportViewDashboard
        handleGoToReportV2={handleGoToReportV2}
        onPageRequested={fetchNextReportViews}
        reportViews={reportsV2}
        reportViewsPaginated={reportViewsPaginated}
      />
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
)(React.memo(FranchiseReportViewDashboard));
